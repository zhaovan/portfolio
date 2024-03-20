"use client";
import styles from "./index.module.css";
import Layout from "@/app/components/Layout/Layout";

import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import projects from "@/app/data/projects.json";
import Image from "next/image";

export default function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const project = projects.filter((project) => project.slug === slug)[0];

  const [mdx, setMdx] = useState<any>();
  useEffect(() => {
    async function fetchPost() {
      const response = await fetch(`./${slug}.md`);
      const data = await response.text();
      setMdx(data);
    }
    fetchPost();
  }, [slug, mdx]);
  //   const response = await fetch(`/public/projects/${slug}.md`);
  //   const data = await response.text();

  //   if (!mdx) {
  //     return <Layout />;
  //   }

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.post}>
          <div className={styles.headerContainer}>
            <div className={styles.tagContainer}>
              <h1 className={styles.projectName}>{project.name}</h1>
              <h2 className={styles.projectTag}>{project.tag}</h2>
            </div>
            <Image
              src={project.thumbnail}
              width={800}
              height={600}
              priority
              className={styles.headerImage}
              alt={`thumbnail image for ${project.name}`}
            />
          </div>
          <div className={styles.contentContainer} suppressHydrationWarning>
            <Markdown rehypePlugins={[rehypeRaw]}>{mdx}</Markdown>
          </div>
        </div>
      </div>
    </Layout>
  );
}
