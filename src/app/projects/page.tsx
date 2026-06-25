"use client";
import React, { useMemo } from "react";
import ProjectList from "../data/projects.json";
import Project from "./components/Project/Project";
import styles from "./index.module.css";
import Layout from "../components/Layout/Layout";
import Head from "next/head";

export type ProjectProps = {
  name: string;
  slug: string;
  thumbnail: string;
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
  // const [layout, setLayout] = useState(LayoutType.GRID);

  // Simple sorted list for rendering (no explicit placement)
  const allProjects = ProjectList;

  return (
    <Layout>
      <Head>
        <title>Ivan Zhao | Projects</title>
      </Head>
      <div className={styles.container} data-scroll-section>
        <div className={styles.projectContainer}>
          {allProjects.map((project, idx) => {
            return <Project key={idx} idx={idx} project={project} />;
          })}
        </div>
      </div>
    </Layout>
  );
}
