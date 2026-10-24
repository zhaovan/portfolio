import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.css";
import { ProjectProps } from "@/app/projects/page";
import Link from "next/link";
import Image from "next/image";
import { checkURLIsImage } from "@/app/helpers";
import { motion, useInView } from "framer-motion";
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
  const blurThumbnail = `/posters/${project.thumbnail.replace(/\.[\w]+$/, "-blur.webp")}`;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const mediaLoaded = isImage ? imageLoaded : videoLoaded;

  // Pop the tile in once its media has loaded, so the entrance animation plays
  // over the real image instead of the blur placeholder. If loading is slow,
  // fall back to animating in anyway after a short wait.
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, {
    once: true,
    amount: 0.2,
    margin: "100px 0px",
  });
  const [waitedTooLong, setWaitedTooLong] = useState(false);
  useEffect(() => {
    if (!inView || mediaLoaded) return;
    const timeout = setTimeout(() => setWaitedTooLong(true), 1500);
    return () => clearTimeout(timeout);
  }, [inView, mediaLoaded]);
  const showTile = inView && (mediaLoaded || waitedTooLong);

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
        initial: { opacity: 0, scale: 0.4 },
        visible: (index: number) => ({
          opacity: 1,
          scale: 1,
          transition: {
            duration: 0.5,
            delay: (index % 4) * 0.15,

            ease: [0.22, 1, 0.36, 1],
          },
        }),
      }}
      ref={containerRef}
      initial="initial"
      animate={showTile ? "visible" : "initial"}
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
            <>
              <Image
                src={blurThumbnail}
                alt=""
                aria-hidden="true"
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 25vw"
                className={`${styles.thumbnail} ${styles.thumbnailPlaceholder}`}
              />
              <Image
                src={formattedThumbnail}
                alt={project.name}
                width={BASE_IMAGE_SIZE}
                height={BASE_IMAGE_SIZE}
                sizes="(max-width: 768px) 100vw, 25vw"
                quality={80}
                priority={idx < 6}
                loading={idx < 6 ? "eager" : "lazy"}
                onLoad={() => setImageLoaded(true)}
                style={imgStyle}
                className={`${styles.thumbnail} ${styles.thumbnailImage} ${imageLoaded ? styles.thumbnailLoaded : ""}`}
              />
            </>
          ) : (
            <video
              ref={videoRef}
              src={videoVisible ? formattedThumbnail : undefined}
              poster={`/posters/${project.thumbnail.replace(/\.[\w]+$/, "-blur.webp")}`}
              className={styles.thumbnail}
              style={imgStyle}
              autoPlay={videoVisible}
              preload="none"
              onLoadedData={() => setVideoLoaded(true)}
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
