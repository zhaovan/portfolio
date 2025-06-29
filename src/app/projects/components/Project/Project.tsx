import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.css";
import { ProjectProps } from "@/app/projects/page";
import Link from "next/link";
import Image from "next/image";
import { checkURLIsImage } from "@/app/helpers";
import { motion } from "framer-motion";

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
  const ratio = project?.ratio;
  const rowSpan = project.rowSpan ?? 1;
  const colSpan = project?.ratio === "2/3" ? 2 : project.colSpan ?? 1;

  const { newWidth, newHeight } = ratio
    ? calculateImageSize(ratio)
    : { newWidth: 400, newHeight: 300 };

  return (
    <motion.div
      initial={{ opacity: 0, skewY: "10deg" }}
      whileInView={{ opacity: 1, skewY: "0deg" }}
      transition={{ duration: 0.5 }}
      className={styles.projectContainer}
      style={{ gridRow: `span ${colSpan}`, gridColumn: `span ${rowSpan}` }}
    >
      <Link href={`/projects/${project.slug}`}>
        {isImage ? (
          <Image
            src={formattedThumbnail}
            alt={"thumbnail"}
            width={newWidth}
            height={newHeight}
            priority={idx < 12}
            loading={idx < 12 ? "eager" : "lazy"}
            style={{
              aspectRatio: ratio || "4:3",
              transition: "opacity 0.3s ease",
            }}
            className={styles.thumbnail}
          />
        ) : (
          <video
            src={formattedThumbnail}
            poster={`/posters/${project.thumbnail.replace(
              /\.\w+$/,
              "-blur.jpg"
            )}`}
            className={styles.thumbnail}
            style={{
              aspectRatio: ratio || "4:3",
              transition: "opacity 0.3s ease",
            }}
            width={newWidth}
            height={newHeight}
            autoPlay
            preload="metadata"
            playsInline
            muted
            loop
          />
        )}
      </Link>
    </motion.div>
  );
}
