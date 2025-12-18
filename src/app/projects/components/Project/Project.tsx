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

  // Intersection Observer for video lazy loading
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoVisible, setVideoVisible] = useState(false); // eager load first 12

  useEffect(() => {
    if (isImage || videoVisible) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVideoVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );
    if (videoRef.current) {
      observer.observe(videoRef.current);
    }
    return () => observer.disconnect();
  }, [isImage, videoVisible]);

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
      style={{ gridRow: `span ${colSpan}`, gridColumn: `span ${rowSpan}` }}
    >
      <div className={styles.projectNameHover}>
        <motion.p
          variants={{
            initial: { opacity: 0, y: 10 },
            hover: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.3 }}
        >
          {project.name}
        </motion.p>
      </div>

      <Link href={`/projects/${project.slug}`} className={styles.link}>
        <motion.div
          variants={{
            hover: { filter: "blur(3px)" },
          }}
          style={{ width: "100%", height: "100%" }}
          transition={{ duration: 0.2 }}
        >
          {isImage ? (
            <Image
              src={formattedThumbnail}
              alt={"thumbnail"}
              width={newWidth}
              height={newHeight}
              priority={idx < 12}
              loading={idx < 12 ? "eager" : "lazy"}
              style={{
                aspectRatio: ratio || "4/3",
              }}
              className={styles.thumbnail}
              placeholder="blur"
              blurDataURL={`/posters/${project.thumbnail.replace(
                /\.[\w]+$/,
                "-blur.webp"
              )}`}
            />
          ) : (
            <video
              ref={videoRef}
              src={videoVisible ? formattedThumbnail : undefined}
              poster={`/posters/${project.thumbnail.replace(
                /\.[\w]+$/,
                "-blur.webp"
              )}`}
              className={styles.thumbnail}
              style={{
                aspectRatio: ratio || "4/3",
                transition: "opacity 0.3s ease",
              }}
              autoPlay={videoVisible}
              preload="metadata"
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
