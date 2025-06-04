import React from "react";
import styles from "./index.module.css";

import { ProjectProps } from "@/app/projects/page";
import Link from "next/link";
import Image from "next/image";
import { checkURLIsImage } from "@/app/helpers";
import { motion } from "framer-motion";

interface IndividualProject {
  project: ProjectProps;

  onHover: () => void;
}

const BASE_IMAGE_SIZE = 100;

function calculateImageSize(ratio: string) {
  const [width, height] = ratio.split("/").map(Number);

  const newWidth = width * BASE_IMAGE_SIZE;
  const newHeight = height * BASE_IMAGE_SIZE;
  return { newWidth, newHeight };
}

export default function Project({ project, onHover }: IndividualProject) {
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
      <Link href={`/projects/${project.slug}`} onMouseEnter={onHover}>
        {isImage ? (
          <Image
            src={formattedThumbnail}
            alt={"thumbnail"}
            width={newWidth}
            height={newHeight}
            priority={false}
            style={{
              aspectRatio: ratio || "4:3",
            }}
            className={styles.thumbnail}
          />
        ) : (
          <video
            src={formattedThumbnail}
            className={styles.thumbnail}
            style={{
              aspectRatio: ratio || "4:3",
            }}
            width={newWidth}
            height={newHeight}
            autoPlay
            preload="auto"
            playsInline
            muted
            loop
          />
        )}
      </Link>
    </motion.div>
  );
}
