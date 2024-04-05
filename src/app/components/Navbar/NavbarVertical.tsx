import React from "react";

import { navLinks } from "@/app/constants";
import Link from "next/link";
import styles from "./index.module.css";

export default function NavbarVertical() {
  return (
    <div className={styles.navbarVerticalContainer}>
      {Object.keys(navLinks).map((key, idx) => {
        const href = navLinks[key];
        return (
          <Link href={href} key={idx} className={styles.navbarItem}>
            {key}
          </Link>
        );
      })}
    </div>
  );
}
