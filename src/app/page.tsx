"use client";
import styles from "./page.module.css";
import Marquee from "./components/Marquee/Marquee";
import { useRef } from "react";
import Layout from "./components/Layout/Layout";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar/Navbar";
import NavbarVertical from "./components/Navbar/NavbarVertical";

export default function Home() {
  return (
    <div className={styles.container} data-scroll-section>
      <Marquee />
      <div className={styles.bodyContainer}>
        <div className={styles.grid}>
          <h1 className={styles.firstName}>
            {"Ivan".split("").map((char, idx) => {
              return <span key={idx}>{char}</span>;
            })}
          </h1>
          <h1 className={styles.lastName}>
            {"Zhao".split("").map((char, idx) => {
              return <span key={idx}>{char}</span>;
            })}
          </h1>
          <h1 className={styles.chineseName}>
            {"赵艾文".split("").map((char, idx) => {
              return <span key={idx}>{char}</span>;
            })}
          </h1>

          <div className={styles.quote}>
            <NavbarVertical />
            {/* <h2 className={styles.quoteText}>
              While the soul, after all, is only a window, and the opening of
              the window no more difficult than the wakening from a little sleep
            </h2>
            <p className={styles.quoteName}>Mary Oliver</p> */}
          </div>
          <p className={styles.symbol}>
            <motion.span
              whileHover={{ rotate: [0, 30, -20, 5, -2.5, 0, 0] }}
              transition={{ duration: 1.5 }}
              // whileTap={{ rotate: [0, 30, -30, 0] }}
            >
              ℑ
            </motion.span>
          </p>
          <p className={styles.symbol}>
            <motion.span
              transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
              animate={{ rotate: "360deg" }}
            >
              ✾
            </motion.span>
          </p>
          <div className={styles.image} />
          <p className={styles.symbol}>
            <motion.span
              animate={{ x: [0, -20, 40, -10, 0] }}
              transition={{
                repeat: Infinity,
                times: [0, 0.2, 0.3, 0.5, 0.8],
                duration: 2,
              }}
            >
              ✑
            </motion.span>
          </p>
        </div>
      </div>
      <Marquee offset />
    </div>
  );
}
