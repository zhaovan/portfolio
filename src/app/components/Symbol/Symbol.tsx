import React from "react";
import { motion } from "framer-motion";
import styles from "./index.module.css";

type SymbolProps = {
  type: string;
};

export default function Symbol({ type }: SymbolProps) {
  const openInwardsLeft = {
    initial: {},
    hover: { rotateY: "25deg", transition: { duration: 0.3 } },
  };

  const openInwardsRight = {
    initial: {},
    hover: { rotateY: "-25deg", transition: { duration: 0.3 } },
  };

  const experimentChildVariant = {
    initial: {},
    hover: {
      rotate: [0, 30, -20, 5, -2.5, 0, 0],
      rotateY: "30deg",
      trasition: {
        duration: 1,
        rotateY: {
          duration: 0.5,
        },
      },
    },
  };

  const aboutChildVariant = {
    initial: { rotate: "0deg" },
    hover: {
      rotate: "360deg",
      x: 0,
      transition: {
        repeat: Infinity,
        duration: 1,
      },
    },
  };

  if (type === "experiments") {
    return (
      <motion.div
        className={styles.symbolContainer}
        initial="initial"
        whileHover="hover"
      >
        <motion.a
          href="/experiments"
          className={styles.symbol}
          variants={openInwardsLeft}
          style={{ transformOrigin: "left" }}
        >
          <motion.p variants={experimentChildVariant}>ℑ</motion.p>
        </motion.a>
      </motion.div>
    );
  } else if (type === "about") {
    return (
      <motion.div
        className={styles.symbolContainer}
        initial="initial"
        whileHover="hover"
      >
        <motion.a href="/about" className={styles.symbol}>
          <motion.span
            animate={{
              x: [0, -20, 40, -10, 0],
              transition: {
                repeat: Infinity,
                times: [0, 0.2, 0.3, 0.5, 0.8],
                duration: 2,
              },
            }}
            variants={aboutChildVariant}
          >
            ✑
          </motion.span>
        </motion.a>
      </motion.div>
    );
  } else if (type === "projects") {
    return (
      <motion.div
        className={`${styles.symbolContainer} ${styles.above} `}
        initial="initial"
        whileHover="hover"
      >
        <motion.a
          href="/projects"
          className={styles.symbol}
          variants={openInwardsRight}
          style={{ transformOrigin: "right" }}
        >
          <motion.p
            transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
            animate={{ rotate: "360deg" }}
          >
            ✾
          </motion.p>
        </motion.a>
      </motion.div>
    );
  }
}
