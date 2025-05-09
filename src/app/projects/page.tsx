"use client";
import React, { useEffect, useState } from "react";
import ProjectList from "../data/projects.json";
import Project from "./components/Project/Project";
import styles from "./index.module.css";
import Layout from "../components/Layout/Layout";
import { checkURLIsImage } from "../helpers";

export type ProjectProps = {
  name: string;
  slug: string;
  thumbnail: string;
  tag: string;
  year: number;
};

export default function Projects() {
  const [hoveredProjectThumbnailUrl, setHoveredProjectThumbnailUrl] =
    useState("");
  const [isImage, setIsImage] = useState(false);

  const allProjects: ProjectProps[] = ProjectList;

  useEffect(() => {
    setIsImage(checkURLIsImage(hoveredProjectThumbnailUrl));
  }, [hoveredProjectThumbnailUrl]);

  const formattedThumbnail = `/thumbnails/${hoveredProjectThumbnailUrl}`;

  return (
    <Layout>
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
      {/* {hoveredProjectThumbnailUrl && (
        <div className={styles.lightbox}>
          {isImage ? (
            <Image
              src={formattedThumbnail}
              className={styles.lightboxImage}
              alt="thumbnail"
              width="600"
              height="400"
            />
          ) : (
            <video
              src={formattedThumbnail}
              className={styles.lightboxImage}
              width="600"
              height="400"
              autoPlay
              muted
              loop
            />
          )}
        </div>
      )} */}
    </Layout>
  );
}
