/**
 * Optimize portfolio thumbnails for web delivery.
 *
 *   Videos  -> H.264 MP4, max 960px wide, no audio, +faststart (web-streamable)
 *   Images  -> resized (long edge <= 1600px), re-encoded; format preserved
 *             (png->png, jpg->jpg) so projects.json image refs need no changes.
 *   .mov / .webm thumbnails -> .mp4, and src/app/data/projects.json is updated.
 *
 * Originals are backed up to public/thumbnails_original/ and never overwritten,
 * so the script is safe to re-run (it re-derives outputs from the backups).
 *
 * Requires: ffmpeg on PATH, and the `sharp` dependency (already in package.json).
 *
 * Usage:  node scripts/optimize-thumbnails.mjs
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readdir, mkdir, copyFile, stat, rm, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const execFileP = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "public/thumbnails");
const BACKUP = path.join(ROOT, "public/thumbnails_original");
const DATA = path.join(ROOT, "src/app/data/projects.json");

const VIDEO_MAX_WIDTH = 960;
const IMAGE_MAX_DIM = 1600;
const IMAGE_QUALITY = 80;

const VIDEO_EXTS = new Set([".mp4", ".mov", ".webm", ".gif", ".m4v", ".avi"]);
const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp"]);

const mb = (bytes) => (bytes / 1024 / 1024).toFixed(2) + "MB";

async function sizeOf(p) {
  try {
    return (await stat(p)).size;
  } catch {
    return 0;
  }
}

async function optimizeVideo(input, output) {
  await execFileP("ffmpeg", [
    "-y", "-loglevel", "error", "-i", input,
    "-vf", `scale='min(${VIDEO_MAX_WIDTH},iw)':-2`,
    "-c:v", "libx264", "-profile:v", "high", "-pix_fmt", "yuv420p",
    "-crf", "28", "-preset", "slow", "-an",
    "-movflags", "+faststart",
    output,
  ]);
}

async function optimizeImage(input, output, ext) {
  let pipeline = sharp(input).resize(IMAGE_MAX_DIM, IMAGE_MAX_DIM, {
    fit: "inside",
    withoutEnlargement: true,
  });
  if (ext === ".png") {
    pipeline = pipeline.png({ quality: IMAGE_QUALITY, compressionLevel: 9, effort: 8 });
  } else {
    pipeline = pipeline.jpeg({ quality: IMAGE_QUALITY, mozjpeg: true });
  }
  await pipeline.toFile(output);
}

async function main() {
  await mkdir(BACKUP, { recursive: true });

  // 1. Back up originals (skip files already backed up).
  console.log(`==> Backing up originals to ${path.relative(ROOT, BACKUP)}`);
  const files = (await readdir(SRC)).filter((f) => !f.startsWith("."));
  for (const f of files) {
    const dst = path.join(BACKUP, f);
    if ((await sizeOf(dst)) === 0 && (await sizeOf(path.join(SRC, f))) > 0) {
      await copyFile(path.join(SRC, f), dst);
    }
  }

  // 2. Process each backed-up original -> optimized output in SRC.
  const renames = {}; // old filename -> new filename (for video format changes)
  const originals = (await readdir(BACKUP)).filter((f) => !f.startsWith("."));
  for (const base of originals) {
    const orig = path.join(BACKUP, base);
    const ext = path.extname(base).toLowerCase();
    const name = path.basename(base, path.extname(base));
    const before = await sizeOf(orig);

    if (before === 0) {
      console.log(`  !! ${base} is empty — skipping (broken source)`);
      continue;
    }

    if (VIDEO_EXTS.has(ext)) {
      const outName = `${name}.mp4`;
      const out = path.join(SRC, outName);
      await optimizeVideo(orig, out);
      if (ext !== ".mp4") {
        renames[base] = outName;
        await rm(path.join(SRC, base), { force: true }); // drop stale .mov/.webm/.gif
      }
      console.log(`  video ${base.padEnd(34)} ${mb(before)} -> ${mb(await sizeOf(out))}`);
    } else if (IMAGE_EXTS.has(ext)) {
      const out = path.join(SRC, base);
      const tmp = path.join(SRC, `.${base}.tmp${ext}`);
      await optimizeImage(orig, tmp, ext);
      // Keep whichever is smaller (re-encode can occasionally grow already-tiny files).
      if ((await sizeOf(tmp)) < before) {
        await rm(out, { force: true });
        await execFileP("mv", [tmp, out]);
      } else {
        await rm(tmp, { force: true });
        await copyFile(orig, out);
      }
      console.log(`  image ${base.padEnd(34)} ${mb(before)} -> ${mb(await sizeOf(out))}`);
    } else {
      console.log(`  skip  ${base} (unknown type)`);
    }
  }

  // 3. Update projects.json for any video format renames.
  if (Object.keys(renames).length) {
    let json = await readFile(DATA, "utf8");
    for (const [oldName, newName] of Object.entries(renames)) {
      json = json.split(`"${oldName}"`).join(`"${newName}"`);
    }
    await writeFile(DATA, json);
    console.log(`==> Updated projects.json: ${Object.entries(renames).map(([a, b]) => `${a} -> ${b}`).join(", ")}`);
  }

  console.log("==> Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
