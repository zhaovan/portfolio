"use client";
import React, { useEffect, useMemo, useState } from "react";
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
  const [layout, setLayout] = useState(LayoutType.GRID);

  // Start with projects sorted by span (larger first) and year
  const initialSorted = useMemo(() => {
    return [...ProjectList].sort((a, b) => {
      const aSpan = (a.colSpan ?? 1) * (a.rowSpan ?? 1);
      const bSpan = (b.colSpan ?? 1) * (b.rowSpan ?? 1);
      if (bSpan !== aSpan) return bSpan - aSpan; // larger spans first
      return (b.year ?? 0) - (a.year ?? 0); // then newer first
    });
  }, []);

  // Determine current expected number of columns client-side so we can distribute items
  const [columns, setColumns] = useState<number>(6);
  useEffect(() => {
    function updateColumns() {
      const w = window.innerWidth;
      if (w <= 768) setColumns(1);
      else if (w <= 1024) setColumns(4);
      else setColumns(6);
    }
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  // Simple sorted list for rendering (no explicit placement)
  const allProjects = initialSorted;

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
