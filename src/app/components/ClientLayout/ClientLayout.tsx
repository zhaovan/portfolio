"use client";
import { usePathname } from "next/navigation"; // if using app router
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Loader from "../Loader/Loader";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // App Router version
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
  }, [pathname]);

  return (
    <>
      <AnimatePresence>
        {loading && <Loader setLoading={setLoading} />}
      </AnimatePresence>
      <div style={{ opacity: loading ? 0 : 1 }}>{children}</div>
    </>
  );
}
