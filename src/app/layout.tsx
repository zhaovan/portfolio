// import type { Metadata } from "next";
import { ReactLenis } from "lenis/react";

import "./globals.css";
import { ThemeProvider } from "next-themes";

// export const metadata: Metadata = {
//   title: "Ivan Zhao",
//   description:
//     "Ivan Zhao is a creative technologist with a love for the weird and wacky things in the world.",
// };

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
