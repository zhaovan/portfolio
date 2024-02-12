import React from "react";
import styles from "./index.module.css";
import Image from "next/image";

export default function Project({ project }) {
  return (
    <div className={styles.projectContainer}>
      <div className={styles.thumbnailContainer}>
        <Image
          src={project.thumbnail}
          width={400}
          height={300}
          alt=""
          className={styles.thumbnail}
        />
      </div>
      <div>
        <h1>{project.name}</h1>
        <p>{project.description}</p>
      </div>
    </div>
  );
}
