import React from "react";
import styles from "./index.module.css";

import { ProjectProps } from "@/app/projects/page";
import Link from "next/link";

interface IndividualProject {
  project: ProjectProps;
  onHover: () => void;
}

export default function Project({ project, onHover }: IndividualProject) {
  return (
    <Link href={`/projects/${project.slug}`}>
      <div className={styles.projectContainer} onMouseEnter={onHover}>
        <p className={styles.projectName}>{project.name}</p>
        <div className={styles.tagContainer}>
          <p className={styles.tag}>{project.tag}</p>
          <p className={styles.year}>{project.year}</p>
        </div>
      </div>
    </Link>
  );
}
