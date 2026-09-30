"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import styles from "./index.module.css";

const columns = 4;
const rows = 6;
const cellAnimationDuration = 150;
const transitionHoldDuration = 200;
const cellStaggerDuration = 1000;

type TransitionPhase = "cover" | "hold" | "reveal" | null;

function createCellDelays() {
  const cellCount = columns * rows;
  const cellOrder = Array.from({ length: cellCount }, (_, index) => index);

  for (let index = cellCount - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [cellOrder[index], cellOrder[randomIndex]] = [
      cellOrder[randomIndex],
      cellOrder[index],
    ];
  }

  const delays = Array<number>(cellCount);

  cellOrder.forEach((cellIndex, order) => {
    delays[cellIndex] = (order / (cellCount - 1)) * cellStaggerDuration;
  });

  return delays;
}

const maxCellDelay = cellStaggerDuration;
const coverDuration =
  maxCellDelay + cellAnimationDuration + transitionHoldDuration;
const revealDuration = maxCellDelay + cellAnimationDuration;

export default function CellularPageTransition({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [phase, setPhase] = useState<TransitionPhase>(null);
  const [cellDelays, setCellDelays] = useState<number[]>([]);
  const phaseRef = useRef<TransitionPhase>(null);
  const sourcePath = useRef(pathname);
  const coverTimeout = useRef<number | null>(null);
  const hasMounted = useRef(false);

  const handleClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      !pathname ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Element)) return;

    const link = target.closest<HTMLAnchorElement>("a[href]");
    if (!link || link.hasAttribute("download")) return;
    if (link.target && link.target !== "_self") return;

    const destination = new URL(link.href, window.location.href);
    if (
      destination.origin !== window.location.origin ||
      destination.pathname === pathname ||
      pathname === "/" ||
      destination.pathname === "/"
    ) {
      return;
    }

    event.preventDefault();
    sourcePath.current = pathname;
    setCellDelays(createCellDelays());
    phaseRef.current = "cover";
    setPhase("cover");
    coverTimeout.current = window.setTimeout(() => {
      phaseRef.current = "hold";
      setPhase("hold");
      router.push(
        `${destination.pathname}${destination.search}${destination.hash}`,
      );
    }, coverDuration);
  };

  useLayoutEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      sourcePath.current = pathname;
      return;
    }

    if (!pathname || pathname === sourcePath.current) return;
    const previousPath = sourcePath.current;
    sourcePath.current = pathname;

    if (previousPath === "/" || pathname === "/") {
      if (coverTimeout.current !== null) {
        window.clearTimeout(coverTimeout.current);
        coverTimeout.current = null;
      }
      phaseRef.current = null;
      setPhase(null);
      return;
    }

    const finishTransition = () => {
      phaseRef.current = null;
      setPhase(null);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finishTransition();
      return;
    }

    if (phaseRef.current === "hold") {
      phaseRef.current = "reveal";
      setPhase("reveal");
      const finishTimeout = window.setTimeout(finishTransition, revealDuration);
      return () => window.clearTimeout(finishTimeout);
    }

    phaseRef.current = "cover";
    setCellDelays(createCellDelays());
    setPhase("cover");
    const revealTimeout = window.setTimeout(() => {
      phaseRef.current = "reveal";
      setPhase("reveal");
    }, coverDuration);
    const finishTimeout = window.setTimeout(
      finishTransition,
      coverDuration + revealDuration,
    );

    return () => {
      window.clearTimeout(revealTimeout);
      window.clearTimeout(finishTimeout);
    };
  }, [pathname]);

  useLayoutEffect(
    () => () => {
      if (coverTimeout.current !== null) {
        window.clearTimeout(coverTimeout.current);
      }
    },
    [],
  );

  return (
    <>
      <div className={styles.pageStack} onClickCapture={handleClickCapture}>
        <div className={styles.pageFrame}>{children}</div>
      </div>
      {phase && (
        <div
          className={styles.transition}
          data-phase={phase}
          aria-hidden="true"
          style={
            {
              "--cell-columns": columns,
              "--cell-rows": rows,
            } as CSSProperties
          }
        >
          {cellDelays.map((delay, index) => (
            <span
              className={styles.cell}
              key={index}
              style={
                {
                  "--enter-delay": `${delay}ms`,
                  "--exit-delay": `${maxCellDelay - delay}ms`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      )}
    </>
  );
}
