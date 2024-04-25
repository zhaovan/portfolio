"use client";
import React from "react";
import Layout from "../components/Layout/Layout";
import Image from "next/image";
import portrait from "@/../public/images/about.jpg";
import Link from "next/link";
import styles from "./index.module.css";
import aboutData from "../data/bio.json";
import AboutText from "./about.md";
import Markdown from "react-markdown";

type BioKey =
  | "education"
  | "experiences"
  | "fellowships & awards"
  | "appearances"
  | "exhibitions & shows"
  | "writing & webart"
  | "speaking"
  | "research";

type BioItem = {
  organization: string;
  date: string;
  website?: string;
  title: string;
  endDate?: string;
};

export default function About() {
  const bio = aboutData as Record<BioKey, BioItem[]>;

  return (
    <Layout>
      <div className={styles.container} data-scroll-section>
        <div className={styles.imageTextContainer}>
          <div className={styles.imageContainer}>
            <Image
              src={portrait}
              alt="Photo of ivan taken on a film camera with grain"
              width="600"
              height="400"
              priority
              className={styles.portrait}
            />
            <div className={styles.bioContainer}>
              {Object.keys(aboutData).map((bioKey, idx) => {
                const newKey = bioKey as BioKey;
                return (
                  <div key={idx} className={styles.headingContainer}>
                    <h2>{bioKey}</h2>
                    <div>
                      {bio[newKey].map((item: BioItem, secondIdx: number) => {
                        return (
                          <p className={styles.info} key={secondIdx}>
                            <span className={styles.date}>
                              {item.date}
                              {item.endDate && " - " + item.endDate}
                            </span>
                            <span className={styles.titleContainer}>
                              <Link
                                href={item.website || ""}
                                target="_blank"
                                className={styles.site}
                              >
                                {item.title}
                              </Link>
                              <i className={styles.org}>{item.organization}</i>
                            </span>
                          </p>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className={styles.textContainer}>
            <Markdown>{AboutText as unknown as string}</Markdown>
          </div>
        </div>
      </div>
    </Layout>
  );
}
