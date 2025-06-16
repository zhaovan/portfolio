"use client";
import React, { useEffect, useState } from "react";
import ProjectList from "../data/projects.json";
import Project from "./components/Project/Project";
import styles from "./index.module.css";
import Layout from "../components/Layout/Layout";
import { checkURLIsImage } from "../helpers";
import Head from "../components/Head/Head";

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
  const [layout, setLayout] = useState(LayoutType.GRID);

  const allProjects: ProjectProps[] = ProjectList;

  return (
    <Layout>
      <Head title="Ivan Zhao | Projects" />
      <div className={styles.container} data-scroll-section>
        <div className={styles.projectContainer}>
          {allProjects
            .sort((projectA, projectB) => projectB.year - projectA.year)
            .map((project, idx) => {
              return <Project key={idx} idx={idx} project={project} />;
            })}
        </div>
      </div>
    </Layout>
  );
}
