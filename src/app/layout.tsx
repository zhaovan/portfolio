import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ivan Zhao",
  description:
    "Ivan Zhao is a creative technologist with a love for the weird and wacky things in the world.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
