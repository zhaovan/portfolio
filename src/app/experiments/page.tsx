"use client";
import React from "react";
import styles from "./index.module.css";
import Image from "next/image";
import Layout from "../components/Layout/Layout";

const experiments = [
  {
    link: "/experiments/sc-remake.gif",
  },
  //   {
  //     link
  //   }
];

export default function Experiments() {
  return (
    <Layout>
      <div className={styles.container}>
        {experiments.map((exp, idx) => {
          return (
            <Image key={idx} src={exp.link} width="160" height="90" alt="" />
          );
        })}
      </div>
    </Layout>
  );
}
