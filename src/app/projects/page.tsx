"use client";
import React, { useState } from "react";
import ProjectList from "../data/projects.json";
import Project from "../components/Project/Project";
import styles from "./index.module.css";
import Layout from "../components/Layout/Layout";
import Image from "next/image";

export type ProjectProps = {
  name: string;
  description: string;
  slug: string;
  thumbnail: string;
  tag: string;
  year: number;
};

export default function Projects() {
  const [hoveredProject, setHoveredProject] = useState("");
  const allProjects: ProjectProps[] = ProjectList;
  return (
    <Layout>
      <div className={styles.container} data-scroll-section>
        <div
          className={styles.projectContainer}
          onMouseLeave={() => setHoveredProject("")}
        >
          {allProjects
            .sort((projectA, projectB) => projectB.year - projectA.year)
            .map((project, idx) => {
              return (
                <Project
                  key={idx}
                  project={project}
                  onHover={() => setHoveredProject(project.thumbnail)}
                />
              );
            })}
        </div>
      </div>
      {hoveredProject && (
        <div className={styles.lightbox}>
          <Image
            src={hoveredProject}
            className={styles.lightboxImage}
            alt="thumbnail"
            width="600"
            height="400"
          />
        </div>
      )}
    </Layout>
  );
}
