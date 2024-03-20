"use client";
import React, { useState } from "react";
import styles from "./index.module.css";
import Link from "next/link";

export const navLinks: Record<string, string> = {
  projects: "/projects",
  experiments: "/experiments",
  // writing: "/writing",
  about: "/about",
};

type NavbarProps = {
  row: boolean;
};

export default function Navbar({ row = true }: NavbarProps) {
  const [darkMode, setDarkMode] = useState();
  return (
    <div className={styles.navbarContainer}>
      {row && (
        <Link href="/">
          <h1 className={styles.navbarName}>zhaovan</h1>
        </Link>
      )}
      <div
        className={styles.navbarLinksContainer}
        style={{ flexDirection: row ? "row" : "column" }}
      >
        {Object.keys(navLinks).map((key, idx) => {
          const href = navLinks[key];
          return (
            <Link href={href} key={idx}>
              {key}
            </Link>
          );
        })}
        {/* <p>DARK MODE</p> */}
      </div>
    </div>
  );
}
