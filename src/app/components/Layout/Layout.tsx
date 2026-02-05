"use client";
import React, { useRef } from "react";
import Navbar from "../Navbar/Navbar";

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <main>
      <Navbar />
      {children}
    </main>
  );
}
