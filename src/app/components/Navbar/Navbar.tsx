import React from "react";
import styles from "./navbar.module.css";
import Link from "next/link";

const navLinks: Record<string, string> = {
  work: "/work",
  projects: "/projects",
  writing: "/writing",
  about: "/about",
};

export default function Navbar() {
  return (
    <div className={styles.navbarContainer}>
      <h1 className={styles.navbarName}>zhaovan</h1>
      <div className={styles.navbarLinksContainer}>
        {Object.keys(navLinks).map((key, idx) => {
          const href = navLinks[key];
          return (
            <Link href={href} key={idx}>
              {key}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
