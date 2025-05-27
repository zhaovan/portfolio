import { useEffect, useState } from "react";

export function useLoadingPercentage(durationMs = 5000) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const intervalMs = 50; // update every 50ms
    const totalSteps = durationMs / intervalMs;
    const increment = 100 / totalSteps;

    const interval = setTimeout(
      () =>
        setInterval(() => {
          setPercent((prev) => {
            const next = prev + increment;
            return next >= 100 ? 100 : next;
          });
        }, intervalMs),
      1000
    );

    return () => clearInterval(interval);
  }, [durationMs]);

  return Math.round(percent);
}
