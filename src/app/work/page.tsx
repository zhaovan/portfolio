import React from "react";
import Works from "../data/work.json";

export default function Work() {
  return (
    <div>
      {Works.map((work, idx) => {
        return <div key={idx}>{work.name}</div>;
      })}
    </div>
  );
}
