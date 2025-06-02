"use client";
import styles from "./page.module.css";
import Marquee from "./components/Marquee/Marquee";
import Symbol from "./components/Symbol/Symbol";
import { useTheme } from "next-themes";
import { useState } from "react";
import Loader from "./components/Loader/Loader";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const [lanternOn, setLanternOn] = useState(true);
  const [loading, setLoading] = useState(true);

  const [isDoorActive, setIsDoorActive] = useState(false);

  const { resolvedTheme } = useTheme();

  function handleTheme(resolvedTheme: string) {
    if (resolvedTheme === "light") {
      return styles.chineseName;
    } else if (lanternOn) {
      return styles.chineseNameDark;
    } else {
      return styles.chineseNameDarkLantern;
    }
  }

  if (!resolvedTheme) {
    return;
  }

  const doorVariants = {
    closed: { x: 0 },
    openLeft: { x: "-100%" },
    openRight: { x: "100%" },
  };

  return (
    <div className={styles.container}>
      <AnimatePresence>
        {loading && <Loader setLoading={setLoading} />}
      </AnimatePresence>

      <div
        className={styles.bodyContainer}
        style={{ opacity: loading ? 0 : 1 }}
      >
        <Marquee offset />
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

          <h1
            className={handleTheme(resolvedTheme)}
            onClick={() => setLanternOn(!lanternOn)}
          >
            {"赵艾文".split("").map((char, idx) => {
              return <span key={idx}>{char}</span>;
            })}
          </h1>
          <motion.div
            className={styles.enter}
            initial="closed"
            whileHover="open"
            onTap={(e) => {
              e.stopPropagation();
              setIsDoorActive(!isDoorActive);
            }}
            animate={isDoorActive ? "open" : "closed"}
          >
            <Link href="/projects">
              <p className={styles.doorBehindText}>
                Get to the meat and potatoes
              </p>
            </Link>
            <motion.div
              className={styles.door1}
              variants={{
                closed: doorVariants.closed,
                open: doorVariants.openLeft,
              }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {new Array(9).fill(0).map((_, idx) => {
                return (
                  <div className={styles.doorContainer} key={idx}>
                    <div className={styles.doorIcon} />
                  </div>
                );
              })}
            </motion.div>
            <motion.div
              className={styles.door2}
              variants={{
                closed: doorVariants.closed,
                open: doorVariants.openRight,
              }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {new Array(9).fill(0).map((_, idx) => {
                return (
                  <div className={styles.doorContainer} key={idx}>
                    <div className={styles.doorIcon} />
                  </div>
                );
              })}
            </motion.div>
          </motion.div>
          <Symbol type="about" />
          <div className={styles.image} />
        </div>
        <Marquee />
      </div>
    </div>
  );
}
