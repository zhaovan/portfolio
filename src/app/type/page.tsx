"use client";
import React from "react";
import Layout from "../components/Layout/Layout";

const typefaces = [
  {
    name: "Convo Pixel",
  },
  {
    name: "Convo Script",
  },
  {
    name: "Convo Bold",
  },
  {
    name: "Convo Bold Ialic",
  },
  {
    name: "Convo Regular",
  },
  {
    name: "Convo Italic",
  },
  {
    name: "Convo Light",
  },
  {
    name: "Convo Light Italic",
  },
  {
    name: "MOD",
    className: "mod",
    placeholder: "Here is a text value of MOD",
  },
];

export default function Type() {
  return (
    <Layout>
      <div className="page" data-scroll-section>
        {typefaces.map((typeface, idx) => {
          return (
            <div className="typeface" key={idx}>
              <h1>{typeface.name}</h1>
              <input
                type="text"
                className={typeface.className ?? ""}
                value={typeface.placeholder ?? ""}
              />
            </div>
          );
        })}
      </div>
    </Layout>
  );
}
