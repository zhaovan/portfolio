import React, { useState } from "react";
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
  placementStyle?: React.CSSProperties;
}

export default function Project({
  project,
  idx,
  placementStyle,
}: IndividualProject) {
  const BASE_IMAGE_SIZE = 400;
  const isImage = checkURLIsImage(project.thumbnail);
  const formattedThumbnail = `/thumbnails/${project.thumbnail}`;

  const rowSpan = project.rowSpan ?? 1;
  const colSpan = project.colSpan ?? 1;
  const computedRowSpan = rowSpan;

  const { elementRef: videoRef, isVisible: videoVisible } = useVideoVisibility(
    idx < 6,
  );

  const imgStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  return (
    <motion.div
      custom={idx}
      variants={{
        initial: { opacity: 0 },
        visible: (index: number) => ({
          opacity: 1,
          transition: {
            duration: 0.35,
            delay: (index % 6) * 0.1,
            ease: "easeOut",
          },
        }),
      }}
      initial="initial"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2, margin: "100px 0px" }}
      className={styles.projectContainer}
      whileHover="hover"
      style={
        placementStyle ?? {
          gridRow: `span ${computedRowSpan}`,
          gridColumn: `span ${colSpan}`,
        }
      }
    >
      <div className={styles.projectNameHover}>
        <motion.div
          variants={{
            initial: { opacity: 0, y: -12 },
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
              width={BASE_IMAGE_SIZE}
              height={BASE_IMAGE_SIZE}
              priority={idx < 6}
              loading={idx < 6 ? "eager" : "lazy"}
              style={imgStyle}
              className={styles.thumbnail}
              placeholder="blur"
              blurDataURL={`/posters/${project.thumbnail.replace(/\.[\w]+$/, "-blur.webp")}`}
            />
          ) : (
            <video
              ref={videoRef}
              src={videoVisible ? formattedThumbnail : undefined}
              poster={`/posters/${project.thumbnail.replace(/\.[\w]+$/, "-blur.webp")}`}
              className={styles.thumbnail}
              style={imgStyle}
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
