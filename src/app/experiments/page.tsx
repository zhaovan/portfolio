"use client";
import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import Image from "next/image";
import Layout from "../components/Layout/Layout";
import { checkURLIsImage } from "../helpers";
import { CONTENTFUL_BASE_API_URL } from "../constants";

export default function Experiments() {
  const [experiments, setExperiments] = useState<Array<any>>([]);
  useEffect(() => {
    async function getData() {
      const FETCH_URL =
        CONTENTFUL_BASE_API_URL +
        `/spaces/${process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID}/environments/master/entries?access_token=${process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN}`;
      const response = await fetch(FETCH_URL);
      const data = await response.json();
      const assets = data["includes"]["Asset"];
      setExperiments(assets);
    }

    getData();
  }, []);

  return (
    <Layout>
      <div className={styles.container}>
        {experiments.map((experiment, idx) => {
          const fileLink = `http:${experiment["fields"]["file"]["url"]}`;

          if (checkURLIsImage(fileLink)) {
            return (
              <Image key={idx} src={fileLink} width="320" height="180" alt="" />
            );
          } else {
            return (
              <div key={idx} className={styles.experimentContainer}>
                <video
                  className={styles.experiment}
                  src={fileLink}
                  autoPlay
                  muted
                  loop
                />
              </div>
            );
          }
        })}
      </div>
    </Layout>
  );
}
