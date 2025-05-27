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
  const [mdx, setMdx] = useState<any>("");
  const [loading, setLoading] = useState(true);

  const [imageMdx, setImageMdx] = useState<any>("");

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/projects/${slug}/index.md`);
        if (!response.ok) {
          throw new Error(`Failed to fetch index.md: ${response.statusText}`);
        }
        const data = await response.text();
        setMdx(data);
      } catch (error) {
        console.error("Error fetching the post:", error);
      }

      try {
        const imageResponse = await fetch(`/projects/${slug}/images.md`);
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

      setLoading(false);
    }
    fetchPost();
  }, [slug]);

  const isImage = checkURLIsImage(project.thumbnail);
  const formattedThumbnail = `/thumbnails/${project.thumbnail}`;

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>{project.name}</h1>

        {isImage ? (
          <Image
            src={formattedThumbnail}
            width={1600}
            height={1200}
            priority
            style={{
              objectFit: project.ratio ? "scale-down" : undefined,
              height: project.ratio ? "fit-content" : "",
            }}
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

        <div className={styles.content}>
          <div className={styles.textContent}>
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

            <Markdown
              rehypePlugins={[rehypeRaw]}
              className={styles.projectText}
            >
              {mdx}
            </Markdown>
          </div>
        </div>
      </div>
    </Layout>
  );
}
