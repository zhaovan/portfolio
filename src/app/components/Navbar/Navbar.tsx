"use client";
import styles from "./index.module.css";
import Link from "next/link";
import DarkModeButton from "../DarkModeButton/DarkModeButton";
import { navLinks } from "@/app/constants";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.div
      initial={{ y: "-10vh" }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={styles.navbarContainer}
    >
      <Link href="/">
        <h1 className={styles.navbarName}>zhaovan</h1>
      </Link>

      <div className={styles.navbarLinksContainer}>
        {Object.keys(navLinks).map((key, idx) => {
          const href = navLinks[key];
          return (
            <Link href={href} key={idx} className={styles.navbarItem}>
              {key}
            </Link>
          );
        })}
        <DarkModeButton />
      </div>
      <div className={styles.mobileNavbar}></div>
    </motion.div>
  );
}
