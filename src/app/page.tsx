"use client";
import styles from "./page.module.css";
import Marquee from "./components/Marquee/Marquee";
import Symbol from "./components/Symbol/Symbol";
import { useTheme } from "next-themes";
import { useState } from "react";

export default function Home() {
  const [lanternOn, setLanternOn] = useState(true);
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

          <h1
            className={handleTheme(resolvedTheme)}
            onClick={() => setLanternOn(!lanternOn)}
          >
            {"赵艾文".split("").map((char, idx) => {
              return <span key={idx}>{char}</span>;
            })}
          </h1>

          <Symbol type="experiments" />
          <Symbol type="projects" />

          <Symbol type="about" />
          <div className={styles.image} />
        </div>
      </div>
      <Marquee offset />
    </div>
  );
}
