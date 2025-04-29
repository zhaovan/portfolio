import React from "react";
import styles from "./index.module.css";
import Link from "next/link";

type SectionHeaderProps = {
  title: string;
  description?: string | number;
  links?: Array<Record<string, string>>;
};

export default function SectionHeader({
  title,
  description,
  links,
}: SectionHeaderProps) {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{title}</h3>
      {links === undefined ? (
        <h3 className={styles.description}>{description}</h3>
      ) : (
        <h3 className={styles.linkContainer}>
          {links &&
            links.map((link: Record<string, string>, idx: number) => {
              return (
                <Link key={idx} href={link.link} target="_blank">
                  {link.text}
                </Link>
              );
            })}
        </h3>
      )}
    </div>
  );
}
