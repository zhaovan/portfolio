"use client";
import styles from "./index.module.css";
import Layout from "@/app/components/Layout/Layout";

import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import projects from "@/app/data/projects.json";
import Image from "next/image";
import { checkURLIsImage } from "@/app/helpers";
import Link from "next/link";
import SectionHeader from "../components/SectionHeader";

export default function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const project = projects.filter((project) => project.slug === slug)[0];
  const [mdx, setMdx] = useState<any>();

  useEffect(() => {
    async function fetchPost() {
      const response = await fetch(`/projects/${slug}/index.md`);
      const data = await response.text();
      setMdx(data);
    }
    fetchPost();
  }, [slug, mdx]);

  const isImage = checkURLIsImage(project.thumbnail);
  const formattedThumbnail = `/thumbnails/${project.thumbnail}`;

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.post}>
          <div className={styles.headerContainer}>
            <div className={styles.imageContainer}>
              {isImage ? (
                <Image
                  src={formattedThumbnail}
                  width={800}
                  height={600}
                  priority
                  className={styles.headerImage}
                  alt={`thumbnail image for ${project.name}`}
                />
              ) : (
                <video
                  src={formattedThumbnail}
                  className={styles.headerImage}
                  loop
                  autoPlay
                  muted
                />
              )}
              {/* <div className={styles.imageMask} /> */}
            </div>
          </div>

          <div className={styles.contentContainer} suppressHydrationWarning>
            <div className={styles.tagContainer}>
              <h1 className={styles.projectName}>{project.name}</h1>
              <h2 className={styles.projectTag}>{project.tag}</h2>
            </div>
            <div className={styles.overviewContainer}>
              <SectionHeader
                title="Affiliation"
                description={project.organization}
              />
              <SectionHeader title="Year" description={project.year} />
              <SectionHeader title="Links" links={project.links} />
            </div>
            <Markdown rehypePlugins={[rehypeRaw]}>{mdx}</Markdown>
          </div>
        </div>
      </div>
    </Layout>
  );
}
