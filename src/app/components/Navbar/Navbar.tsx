"use client";
import styles from "./index.module.css";
import Link from "next/link";
import DarkModeButton from "../DarkModeButton/DarkModeButton";
import { navLinks } from "@/app/constants";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { HamburgerIcon, PenNibIcon, XIcon } from "@phosphor-icons/react";
import { useState } from "react";
import Heading from "../Heading/Heading";

export default function Navbar() {
  const pathname = usePathname();

  const [mobileNavbarOpen, setMobileNavbarOpen] = useState(false);

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
        {Object.keys(navLinks).map((path) => {
          const href = navLinks[path];
          const selected = pathname === href;
          return (
            <Link
              href={href}
              key={path}
              className={styles.navbarItem}
              style={{ fontWeight: selected ? "bold" : "normal" }}
            >
              {path}
            </Link>
          );
        })}
        <DarkModeButton />
      </div>
      <div className={styles.mobileNavbar}>
        <HamburgerIcon
          className={styles.navbarItem}
          onClick={() => setMobileNavbarOpen(true)}
        />
      </div>
      <AnimatePresence>
        {mobileNavbarOpen && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={styles.mobileNavbarContainer}
          >
            <button
              className={styles.mobileCloseButton}
              onClick={() => setMobileNavbarOpen(false)}
            >
              <PenNibIcon size={24} fill="rgb(var(--text-red))" />
            </button>
            {Object.keys(navLinks).map((path) => {
              const href = navLinks[path];
              const selected = pathname === href;
              return (
                <Link href={href} key={path}>
                  <Heading className={styles.mobileNavbarItem}>{path}</Heading>
                </Link>
              );
            })}
            <div>
              <p>Designing and programming...</p>
              <p>San Francisco, CA</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
