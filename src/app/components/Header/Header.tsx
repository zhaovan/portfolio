import React from "react";
import styles from "./header.module.css";
// import Marquee from "../Marquee/Marquee";
import { motion } from "framer-motion";

type HeaderTextProps = {
  text: String;
};

function HeaderText({ text }: HeaderTextProps) {
  return text.split("").map((char, idx) => {
    const randomHeight = Math.floor(Math.random() * 60);
    const rotate = Math.floor(-30 + Math.random() * 60);
    const duration = Math.floor(Math.random() * 5);
    return (
      <span
        key={idx}
        style={{
          top: randomHeight + "px",
          animationDuration: `${duration}s`,
        }}
        className={styles.character}
      >
        {char}
      </span>
    );
  });
}

export default function Header() {
  return (
    <div className={styles.headerContainer}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <h1 className={styles.headerText}>
          <HeaderText text={"IVAN"} />
        </h1>
        <h1 className={styles.headerText}>
          <HeaderText text={"ZHAO"} />
        </h1>
      </div>
    </div>
  );
}
