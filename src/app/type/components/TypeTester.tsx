import React, { useState } from "react";
import styles from "./index.module.css";

interface TypeTesterProps {
  typeface: Record<string, string>;
}

export default function TypeTester({ typeface }: TypeTesterProps) {
  const [typeBlock, setTypeBlock] = useState(
    typeface.placeholder ?? "The quick brown fox jumps over the lazy dog"
  );
  return (
    <div>
      <h2>{typeface.name}</h2>
      <textarea
        onChange={(e) => setTypeBlock(e.target.value)}
        className={[styles.typeInput, typeface.className ?? ""].join(" ")}
        value={typeBlock}
        // placeholder={typeface.placeholder ?? ""}
      />
    </div>
  );
}
