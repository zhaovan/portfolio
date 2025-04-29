"use client";
import React from "react";
import Layout from "../components/Layout/Layout";
import TypeTester from "./components/TypeTester";

const typefaces = [
  {
    name: "MOD",
    className: "mod",
    placeholder: "Here is a text value of MOD",
  },
  {
    name: "Convo Pixel",
    className: "convo-pixel",
    placeholder: "Here is a text value of Convo Pixel",
  },
  {
    name: "Convo Script",
    className: "convo-script",
    placeholder: "Here is a text value of Convo Script",
  },
  {
    name: "Convo Bold",
    className: "convo-bold",
    placeholder: "Here is a text value of Convo Bold",
  },
  {
    name: "Convo Bold Ialic",
    className: "convo-bold-italic",
    placeholder: "Here is a text value of Convo Light Italic",
  },
  {
    name: "Convo Regular",
    className: "convo",
    placeholder: "Here is a text value of Convo Light Italic",
  },
  {
    name: "Convo Italic",
    className: "convo-italic",
    placeholder: "Here is a text value of Convo Light Italic",
  },
  {
    name: "Convo Light",
    className: "convo-light",
    placeholder: "Here is a text value of Convo Light Italic",
  },
  {
    name: "Convo Light Italic",
    className: "convo-light-italic",
    placeholder: "Here is a text value of Convo Light Italic",
  },
];

export default function Type() {
  return (
    <Layout>
      <div className="page" data-scroll-section>
        {typefaces.map((typeface, idx) => {
          return (
            <div className="typeface" key={idx}>
              <TypeTester typeface={typeface} />
            </div>
          );
        })}
      </div>
    </Layout>
  );
}
