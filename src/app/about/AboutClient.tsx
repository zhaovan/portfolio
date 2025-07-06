"use client";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import Image from "next/image";
import portrait from "@/../public/images/about.jpg";
import Link from "next/link";
import styles from "./index.module.css";
import aboutData from "../data/bio.json";
import Markdown from "react-markdown";
import { motion } from "framer-motion";
import Heading from "../components/Heading/Heading";
import Head from "next/head";

type BioItem = {
  organization: string;
  date: string;
  website?: string;
  title: string;
  endDate?: string;
};

export default function AboutClient() {
  const bio = aboutData as Record<string, BioItem[]>;
  const [aboutText, setAboutText] = useState<string>("");

  useEffect(() => {
    const fetchAboutText = async () => {
      try {
        const response = await fetch("/pages/about.md");
        if (!response.ok) {
          throw new Error(`Failed to fetch about.md: ${response.statusText}`);
        }
        const data = await response.text();
        setAboutText(data);
      } catch (error) {
        console.error("Error fetching the about text:", error);
      }
    };
    fetchAboutText();
  });

  return (
    <Layout>
      <Head>
        <title>Ivan Zhao | About</title>
      </Head>
      <div className={styles.container} data-scroll-section>
        <div className={styles.titleContainer}>
          <Heading className={styles.title}>
            Ivan Zhao is a designer, programmer, & text artist with a love of
            animations, comics, games, & type.
          </Heading>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.375, duration: 0.5, ease: "easeOut" }}
          className={styles.mobileTitleContainer}
        >
          <h1 className={styles.mobileTitle}>
            Ivan Zhao is a designer, programmer, & text artist with a love of
            animations, comics, games, & type.
          </h1>
        </motion.div>

        <div className={styles.imageTextContainer}>
          <motion.div
            className={styles.textContainer}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
          >
            <Markdown>{aboutText}</Markdown>
          </motion.div>
          <div className={styles.imageContainer}>
            <motion.div
              initial={{ opacity: 0, y: "50px" }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 0.5, ease: "easeOut" }}
            >
              <Image
                src={portrait}
                alt="Photo of ivan taken on a film camera with grain"
                width="1200"
                height="800"
                priority
                className={styles.portrait}
              />
            </motion.div>
            <div className={styles.bioContainer}>
              {Object.keys(aboutData).map((bioKey, idx) => {
                const newKey = bioKey;
                return (
                  <motion.div
                    key={idx}
                    className={styles.headingContainer}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                  >
                    <h2>{bioKey}</h2>
                    <div>
                      {bio[newKey].map((item: BioItem, secondIdx: number) => {
                        return (
                          <div className={styles.info} key={secondIdx}>
                            {item.date && (
                              <p className={styles.date}>
                                {item.date}
                                {item.endDate && " - " + item.endDate}
                              </p>
                            )}
                            <span className={styles.itemTitleContainer}>
                              <Link
                                href={item.website || ""}
                                target="_blank"
                                className={styles.site}
                              >
                                {item.title}
                              </Link>
                              <p className={styles.organization}>
                                {item.organization}
                              </p>
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
