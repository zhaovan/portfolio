import React from "react";
import ProjectList from "../data/projects.json";
import Project from "../components/Project/Project";
import styles from "./index.module.css";

export default function Projects() {
  return (
    <div className={styles.container}>
      {ProjectList.map((project, idx) => {
        return <Project project={project} />;
      })}
    </div>
  );
}
