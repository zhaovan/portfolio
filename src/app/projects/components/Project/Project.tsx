import React from "react";
import styles from "./index.module.css";
import { ProjectProps } from "@/app/projects/page";
import Link from "next/link";
import Image from "next/image";
import { checkURLIsImage } from "@/app/helpers";
import { motion } from "framer-motion";
import { useVideoVisibility } from "@/app/hooks/useVideoVisibility";

interface IndividualProject {
  project: ProjectProps;
  idx: number;
}

const BASE_IMAGE_SIZE = 100;

function calculateImageSize(ratio: string) {
  const [width, height] = ratio.split("/").map(Number);
  return {
    newWidth: width * BASE_IMAGE_SIZE,
    newHeight: height * BASE_IMAGE_SIZE,
  };
}

export default function Project({ project, idx }: IndividualProject) {
  const isImage = checkURLIsImage(project.thumbnail);
  const formattedThumbnail = `/thumbnails/${project.thumbnail}`;
  const ratio = project?.ratio || "4/3";
  const rowSpan = project.rowSpan ?? 1;
  const colSpan = project.colSpan ?? 1;

  const { newWidth, newHeight } = calculateImageSize(ratio);

  // Use shared Intersection Observer for video lazy loading
  const { elementRef: videoRef, isVisible: videoVisible } = useVideoVisibility(
    idx < 6,
  );

  return (
    <motion.div
      variants={{
        initial: { opacity: 0 },
        visible: { opacity: 1 },
      }}
      initial="initial"
      whileInView="visible"
      whileHover="hover"
      transition={{ duration: 0.3 }}
      className={styles.projectContainer}
      style={{ gridRow: `span ${rowSpan}`, gridColumn: `span ${colSpan}` }}
    >
      <div className={styles.projectNameHover}>
        <motion.div
          variants={{
            initial: { opacity: 0, y: 10 },
            hover: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.3 }}
        >
          <p>{project.name}</p>
        </motion.div>
      </div>

      <Link href={`/projects/${project.slug}`} className={styles.link}>
        <motion.div
          className={styles.thumbnailContainer}
          transition={{ duration: 0.2 }}
        >
          {isImage ? (
            <Image
              src={formattedThumbnail}
              alt={"thumbnail"}
              width={newWidth}
              height={newHeight}
              priority={idx < 6}
              loading={idx < 6 ? "eager" : "lazy"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              className={styles.thumbnail}
              placeholder="blur"
              blurDataURL={`/posters/${project.thumbnail.replace(
                /\.[\w]+$/,
                "-blur.webp",
              )}`}
            />
          ) : (
            <video
              ref={videoRef}
              src={videoVisible ? formattedThumbnail : undefined}
              poster={`/posters/${project.thumbnail.replace(
                /\.[\w]+$/,
                "-blur.webp",
              )}`}
              className={styles.thumbnail}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              autoPlay={videoVisible}
              preload="none"
              playsInline
              muted
              loop
            />
          )}
        </motion.div>
      </Link>
    </motion.div>
  );
}
