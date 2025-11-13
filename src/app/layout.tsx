import type { Metadata } from "next";
import { ReactLenis } from "lenis/react";

import "./globals.css";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "Ivan Zhao",
  description:
    "Ivan Zhao is a creative technologist with a love for the weird and wacky things in the world.",
  openGraph: {
    title: "Ivan Zhao",
    description:
      "Ivan Zhao is a creative technologist with a love for the weird and wacky things in the world.",
    url: "https://ivanzhao.me",
    siteName: "Ivan Zhao",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ivan Zhao",
    description:
      "Ivan Zhao is a creative technologist with a love for the weird and wacky things in the world.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "og:logo": "https://ivanzhao.me/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ReactLenis root>
          <ThemeProvider>{children}</ThemeProvider>
        </ReactLenis>
      </body>
    </html>
  );
}
