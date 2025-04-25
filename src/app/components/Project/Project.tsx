import React from "react";
import styles from "./index.module.css";

import { ProjectProps } from "@/app/projects/page";
import Link from "next/link";
import Image from "next/image";
import { checkURLIsImage } from "@/app/helpers";

interface IndividualProject {
  project: ProjectProps;
  onHover: () => void;
}

export default function Project({ project, onHover }: IndividualProject) {
  const isImage = checkURLIsImage(project.thumbnail);

  const formattedThumbnail = `/thumbnails/${project.thumbnail}`;
  return (
    <Link href={`/projects/${project.slug}`}>
      <div className={styles.projectContainer} onMouseEnter={onHover}>
        <div className={styles.projectText}>
          <p className={styles.projectName}>{project.name}</p>
          <p className={styles.year}>{project.year}</p>
          {/* <div className={styles.tagContainer}> */}
          {/* <p className={styles.tag}>{project.tag}</p> */}
          {/* </div> */}
        </div>

        {isImage ? (
          <Image
            src={formattedThumbnail}
            width={400}
            height={300}
            alt={"thumbnail"}
            className={styles.thumbnail}
          />
        ) : (
          <video
            src={formattedThumbnail}
            className={styles.thumbnail}
            width="400"
            height="300"
            autoPlay
            muted
            loop
          />
        )}
      </div>
    </Link>
  );
}
