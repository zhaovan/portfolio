import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import styles from "./index.module.css";
import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useState } from "react";

enum Theme {
  LIGHT = "light",
  DARK = "dark",
}
export default function DarkModeButton() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);
  const controls = useAnimationControls();

  function handleDarkModeSwap() {
    if (resolvedTheme === Theme.DARK) {
      setTheme(Theme.LIGHT);
    } else {
      setTheme(Theme.DARK);
    }
    controls.start({
      y: [null, -20, 4, 0],
      rotate: [null, 25, -25, 0],

      transition: { duration: 1, times: [0, 0.1, 0.4, 0.5] },
    });
  }

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return <div className={styles.placeholder} />;
  }

  return (
    <button onClick={handleDarkModeSwap} className={styles.button}>
      <motion.div animate={controls}>
        {resolvedTheme === Theme.DARK ? (
          <Moon className={styles.icon} fill="currentColor" size={20} />
        ) : (
          <Sun className={styles.icon} size={20} />
        )}
      </motion.div>
    </button>
  );
}
