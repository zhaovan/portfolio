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
import Heading from "@/app/components/Heading/Heading";
import { motion } from "framer-motion";
import matter from "gray-matter";

import Head from "next/head";

export default function PageContent() {
  const { slug } = useParams<{ slug: string }>();

  const project = projects.find((project) => project.slug === slug)!;
  const [mdx, setMdx] = useState<any>("");
  const [metadata, setMetadata] = useState<any>(null);

  const [imageMdx, setImageMdx] = useState<any>("");

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/project-info/${slug}/index.md`);
        if (!response.ok) {
          throw new Error(`Failed to fetch index.md: ${response.statusText}`);
        }
        const rawData = await response.text();
        const { data, content } = matter(rawData);
        setMetadata(data);
        setMdx(content);
      } catch (error) {
        console.error("Error fetching the post:", error);
      }

      try {
        const imageResponse = await fetch(`/project-info/${slug}/images.md`);
        if (!imageResponse.ok) {
          console.warn(`images.md not found for slug: ${slug}`);
          setImageMdx(""); // Set to an empty string if the file doesn't exist
          return;
        }
        const imageData = await imageResponse.text();
        setImageMdx(imageData);
      } catch (error) {
        console.error("Error fetching the image post:", error);
      }
    }
    fetchPost();
  }, [slug]);

  const isImage = checkURLIsImage(project.thumbnail);
  const formattedThumbnail = `/thumbnails/${project.thumbnail}`;

  const isHorizontal = metadata?.layout === "horizontal";

  return (
    <Layout>
      <Head>
        <title>{`Ivan Zhao | ${project.name}`}</title>
      </Head>
      {isHorizontal ? (
        <div className={styles.horizontalContainer}>
          <Heading className={styles.title}>{project.name}</Heading>

          <div className={styles.horizontalContentContainer}>
            <motion.div
              className={styles.content}
              whileInView={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className={styles.textContent}>
                <Markdown
                  rehypePlugins={[rehypeRaw]}
                  className={styles.projectText}
                >
                  {mdx}
                </Markdown>
                <div className={styles.overviewContainer}>
                  <SectionHeader title="Medium" description={project.medium} />

                  <SectionHeader title="Year" description={project.year} />
                  {project.links && (
                    <SectionHeader title="Links" links={project.links} />
                  )}
                  {project.client && (
                    <SectionHeader title="Client" links={project.client} />
                  )}
                  {project.collaborators && (
                    <SectionHeader
                      title="Collaborators"
                      links={project.collaborators}
                    />
                  )}
                  {imageMdx.length > 0 && (
                    <Markdown
                      rehypePlugins={[rehypeRaw]}
                      className={styles.additionalImages}
                    >
                      {imageMdx}
                    </Markdown>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: "50px" }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5, ease: "easeOut" }}
            >
              {isImage ? (
                <Image
                  src={formattedThumbnail}
                  width={1600}
                  height={1200}
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
                  playsInline
                  preload="auto"
                />
              )}
            </motion.div>

            {imageMdx.length > 0 && (
              <Markdown
                rehypePlugins={[rehypeRaw]}
                className={styles.mobileAdditionalImages}
              >
                {imageMdx}
              </Markdown>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.container}>
          <Heading className={styles.title}>{project.name}</Heading>

          <motion.div
            initial={{ opacity: 0, y: "50px" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5, ease: "easeOut" }}
          >
            {isImage ? (
              <Image
                src={formattedThumbnail}
                width={1600}
                height={1200}
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
                playsInline
                preload="auto"
              />
            )}
          </motion.div>

          <motion.div
            className={styles.content}
            whileInView={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <div className={styles.textContent}>
              <Markdown
                rehypePlugins={[rehypeRaw]}
                className={styles.projectText}
              >
                {mdx}
              </Markdown>
              <div className={styles.overviewContainer}>
                <SectionHeader title="Medium" description={project.medium} />

                <SectionHeader title="Year" description={project.year} />
                {project.links && (
                  <SectionHeader title="Links" links={project.links} />
                )}
                {project.client && (
                  <SectionHeader title="Client" links={project.client} />
                )}
                {project.collaborators && (
                  <SectionHeader
                    title="Collaborators"
                    links={project.collaborators}
                  />
                )}
                {imageMdx.length > 0 && (
                  <Markdown
                    rehypePlugins={[rehypeRaw]}
                    className={styles.additionalImages}
                  >
                    {imageMdx}
                  </Markdown>
                )}
              </div>
            </div>
          </motion.div>
          {imageMdx.length > 0 && (
            <Markdown
              rehypePlugins={[rehypeRaw]}
              className={styles.mobileAdditionalImages}
            >
              {imageMdx}
            </Markdown>
          )}
        </div>
      )}
    </Layout>
  );
}
