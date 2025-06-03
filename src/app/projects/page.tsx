"use client";
import React, { useEffect, useState } from "react";
import ProjectList from "../data/projects.json";
import Project from "./components/Project/Project";
import styles from "./index.module.css";
import Layout from "../components/Layout/Layout";
import { checkURLIsImage } from "../helpers";
import HeadTitle from "../components/Head/Head";

export type ProjectProps = {
  name: string;
  slug: string;
  thumbnail: string;
  ratio?: string;
  tag: string;
  year: number;
  medium?: string;
  rowSpan?: number;
  colSpan?: number;
};

enum LayoutType {
  GRID = "grid",
  LIST = "list",
}

export default function Projects() {
  const [hoveredProjectThumbnailUrl, setHoveredProjectThumbnailUrl] =
    useState("");
  const [isImage, setIsImage] = useState(false);
  const [layout, setLayout] = useState(LayoutType.GRID);

  const allProjects: ProjectProps[] = ProjectList;

  useEffect(() => {
    setIsImage(checkURLIsImage(hoveredProjectThumbnailUrl));
  }, [hoveredProjectThumbnailUrl]);

  return (
    <Layout>
      <HeadTitle title="Ivan Zhao | Projects" />
      <div className={styles.container} data-scroll-section>
        <div
          className={styles.projectContainer}
          onMouseLeave={() => setHoveredProjectThumbnailUrl("")}
        >
          {allProjects
            .sort((projectA, projectB) => projectB.year - projectA.year)
            .map((project, idx) => {
              return (
                <Project
                  key={idx}
                  project={project}
                  onHover={() =>
                    setHoveredProjectThumbnailUrl(project.thumbnail)
                  }
                />
              );
            })}
        </div>
      </div>
    </Layout>
  );
}
