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
      <p className={styles.title}>{title}</p>
      {links === undefined ? (
        <p className={styles.description}>{description}</p>
      ) : (
        <p className={styles.linkContainer}>
          {links &&
            links.map((link: Record<string, string>, idx: number) => {
              return (
                <Link key={idx} href={link.website} target="_blank">
                  {link.name}
                </Link>
              );
            })}
        </p>
      )}
    </div>
  );
}
