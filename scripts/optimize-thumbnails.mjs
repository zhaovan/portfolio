/**
 * Optimize portfolio thumbnails for web delivery.
 *
 *   Videos  -> H.264 MP4, max 960px wide, no audio, +faststart (web-streamable)
 *   Images  -> resized (long edge <= 1600px), re-encoded; format preserved
 *             (png->png, jpg->jpg) so projects.json image refs need no changes.
 *   .mov / .webm thumbnails -> .mp4, and src/app/data/projects.json is updated.
 *
 * Also optimizes project page media in public/project-info/ (files > 1.5MB):
 *   Images  -> long edge <= 2000px (PNG lossless, JPEG q85), in place
 *   Videos  -> H.264 MP4 <= 1280px wide; .mov -> .mp4 with images.md updated.
 *             Alpha-channel .webm stays VP9 webm so transparency is kept.
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

// Project page media (public/project-info/<slug>/images). Optimized in place —
// originals stay recoverable from git history, so no backup folder (it would
// double an already ~600MB directory). Only files over the size threshold are
// touched, so re-running won't keep re-encoding already-optimized media.
const PROJECT_INFO = path.join(ROOT, "public/project-info");
const PROJECT_IMAGE_MAX_DIM = 2000;
const PROJECT_JPEG_QUALITY = 85;
const PROJECT_VIDEO_MAX_WIDTH = 1280;
const PROJECT_MIN_BYTES = 1.5 * 1024 * 1024;

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

async function optimizeVideo(input, output, maxWidth = VIDEO_MAX_WIDTH, crf = 28) {
  await execFileP("ffmpeg", [
    "-y", "-loglevel", "error", "-i", input,
    "-vf", `scale='min(${maxWidth},iw)':-2`,
    "-c:v", "libx264", "-profile:v", "high", "-pix_fmt", "yuv420p",
    "-crf", String(crf), "-preset", "slow", "-an",
    "-movflags", "+faststart",
    output,
  ]);
}

async function optimizeImage(input, output, ext, maxDim = IMAGE_MAX_DIM, jpegQuality = IMAGE_QUALITY) {
  // .rotate() applies EXIF orientation before metadata is stripped.
  let pipeline = sharp(input).rotate().resize(maxDim, maxDim, {
    fit: "inside",
    withoutEnlargement: true,
  });
  if (ext === ".png") {
    // Lossless: no palette quantization, so gradients and print textures keep full colour.
    pipeline = pipeline.png({ compressionLevel: 9 });
  } else if (ext === ".webp") {
    pipeline = pipeline.webp({ quality: IMAGE_QUALITY });
  } else {
    pipeline = pipeline.jpeg({ quality: jpegQuality, mozjpeg: true });
  }
  await pipeline.toFile(output);
}

// VP9 webm with an alpha channel: keep it webm so transparency survives.
async function optimizeAlphaWebm(input, output) {
  await execFileP("ffmpeg", [
    "-y", "-loglevel", "error", "-c:v", "libvpx-vp9", "-i", input,
    "-vf", `scale='min(${PROJECT_VIDEO_MAX_WIDTH},iw)':-2`,
    "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "0", "-crf", "34",
    "-row-mt", "1", "-an",
    output,
  ]);
}

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

async function optimizeProjectInfo() {
  console.log(`==> Optimizing project page media in ${path.relative(ROOT, PROJECT_INFO)}`);
  const files = await walk(PROJECT_INFO);
  const renames = {}; // "/project-info/x/images/1.mov" -> "/project-info/x/images/1.mp4"
  const publicPath = (p) => "/" + path.relative(path.join(ROOT, "public"), p).split(path.sep).join("/");

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const before = await sizeOf(file);
    const rel = path.relative(PROJECT_INFO, file);
    if (before < PROJECT_MIN_BYTES) continue;
    if (!IMAGE_EXTS.has(ext) && !VIDEO_EXTS.has(ext)) continue;
    if (ext === ".gif") continue; // animated; converting would change how it's embedded

    const dir = path.dirname(file);
    const name = path.basename(file, path.extname(file));
    const tmp = path.join(dir, `.${name}.tmp${ext === ".webm" ? ".webm" : VIDEO_EXTS.has(ext) ? ".mp4" : ext}`);

    try {
      if (IMAGE_EXTS.has(ext)) {
        await optimizeImage(file, tmp, ext, PROJECT_IMAGE_MAX_DIM, PROJECT_JPEG_QUALITY);
      } else if (ext === ".webm") {
        await optimizeAlphaWebm(file, tmp);
      } else {
        await optimizeVideo(file, tmp, PROJECT_VIDEO_MAX_WIDTH, 24);
      }
    } catch (err) {
      await rm(tmp, { force: true });
      console.log(`  !! ${rel} failed: ${err.message.split("\n")[0]}`);
      continue;
    }

    const after = await sizeOf(tmp);
    if (after === 0 || after >= before) {
      await rm(tmp, { force: true });
      console.log(`  keep  ${rel.padEnd(48)} ${mb(before)} (re-encode wasn't smaller)`);
      continue;
    }

    // .mov/.m4v/etc become .mp4; images and webm/mp4 keep their name.
    const outExt = IMAGE_EXTS.has(ext) || ext === ".webm" ? path.extname(file) : ".mp4";
    const out = path.join(dir, name + outExt);
    if (out !== file && (await sizeOf(out)) > 0) {
      await rm(tmp, { force: true });
      console.log(`  !! ${rel}: ${path.basename(out)} already exists — skipping`);
      continue;
    }
    await rm(file, { force: true });
    await execFileP("mv", [tmp, out]);
    if (out !== file) renames[publicPath(file)] = publicPath(out);
    console.log(`  ${(IMAGE_EXTS.has(ext) ? "image" : "video").padEnd(5)} ${rel.padEnd(48)} ${mb(before)} -> ${mb(after)}`);
  }

  // Point images.md / index.md at renamed videos.
  if (Object.keys(renames).length) {
    for (const md of files.filter((f) => f.endsWith(".md"))) {
      const text = await readFile(md, "utf8");
      let next = text;
      for (const [oldPath, newPath] of Object.entries(renames)) {
        next = next.split(`"${oldPath}"`).join(`"${newPath}"`);
      }
      if (next !== text) {
        await writeFile(md, next);
        console.log(`  updated ${path.relative(ROOT, md)}`);
      }
    }
  }
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

  await optimizeProjectInfo();

  console.log("==> Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
