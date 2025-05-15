"use client";
import styles from "./index.module.css";
import Layout from "@/app/components/Layout/Layout";

import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import projects from "@/app/data/projects.json";
import Image from "next/image";
import { checkURLIsImage } from "@/app/helpers";

import SectionHeader from "./components/SectionHeader/SectionHeader";
import { useParams } from "next/navigation";

export default function Page() {
  const { slug } = useParams<{ slug: string }>();

  const project = projects.filter((project) => project.slug === slug)[0];
  const [mdx, setMdx] = useState<any>();

  const [imageMdx, setImageMdx] = useState<any>();

  useEffect(() => {
    async function fetchPost() {
      const response = await fetch(`/projects/${slug}/index.md`);
      const data = await response.text();

      const imageResponse = await fetch(`/projects/${slug}/images.md`);
      const imageData = await imageResponse.text();
      setImageMdx(imageData);
      setMdx(data);
    }
    fetchPost();
  }, [slug, mdx]);

  const isImage = checkURLIsImage(project.thumbnail);
  const formattedThumbnail = `/thumbnails/${project.thumbnail}`;

  return (
    <Layout>
      <div className={styles.container} suppressHydrationWarning>
        <div className={styles.mainContent}>
          <div className={styles.tagContainer}>
            <h1 className={styles.title}>{project.name}</h1>
            <h2 className={styles.description}>{project.description}</h2>
          </div>
          <div className={styles.overviewContainer}>
            <SectionHeader title="Year" description={project.year} />
            {project.links && (
              <SectionHeader title="Links" links={project.links} />
            )}
          </div>
          <Markdown rehypePlugins={[rehypeRaw]}>{mdx}</Markdown>
        </div>

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

          {/* <Markdown rehypePlugins={[rehypeRaw]}>{imageMdx}</Markdown> */}
        </div>
      </div>
    </Layout>
  );
}
