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
      <h2 className={styles.title}>{title}</h2>
      {links === undefined ? (
        <h2 className={styles.description}>{description}</h2>
      ) : (
        <h2 className={styles.linkContainer}>
          {links &&
            links.map((link: Record<string, string>, idx: number) => {
              return (
                <Link key={idx} href={link.website} target="_blank">
                  {link.name}
                </Link>
              );
            })}
        </h2>
      )}
    </div>
  );
}
