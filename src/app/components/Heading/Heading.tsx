import React from "react";

export default function Heading({
  children,
  as = "h1",
}: {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}) {
  return <h1>{children}</h1>;
}
