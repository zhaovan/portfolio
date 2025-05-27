"use client";
import { useEffect, useState, useRef } from "react";
import styles from "./index.module.css";
import { motion } from "framer-motion";
import { useLoadingPercentage } from "@/app/hooks/useLoadingPercentage";

const CELL_SIZE = 20; // smaller for more resolution
const TICK_INTERVAL = 125; // ms

interface LoaderProps {
  setLoading: (loading: boolean) => void;
}

export default function Loader({ setLoading }: LoaderProps) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [grid, setGrid] = useState<number[][]>([]);
  const loadingPercentage = useLoadingPercentage(3000);
  const rows = useRef(0);
  const cols = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    setWindowSize({ width: w, height: h });

    cols.current = Math.floor(w / CELL_SIZE);
    rows.current = Math.floor(h / CELL_SIZE);

    const emptyGrid = makeEmptyGrid(rows.current, cols.current);
    setGrid(emptyGrid);

    const animationSequence = getAnimationSequence(rows.current, cols.current);
    let step = 0;
    let timeoutId: NodeJS.Timeout;
    const drawInterval = setInterval(() => {
      if (step < animationSequence.length) {
        const [r, c] = animationSequence[step];
        setGrid((prev) => {
          const newGrid = prev.map((row) => [...row]);
          newGrid[r][c] = 1;
          return newGrid;
        });
        step++;
      } else {
        clearInterval(drawInterval);

        // Now start the Game of Life
        timeoutId = setTimeout(() => {
          intervalRef.current = setInterval(() => {
            setGrid((prev) => nextGen(prev));
          }, TICK_INTERVAL);
        }, 1000);
      }
    }, 20);

    const loadingId = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      clearInterval(drawInterval);
      clearTimeout(timeoutId);
      clearTimeout(loadingId);
    };
  }, []);

  return (
    <motion.div
      exit={{
        y: [0, "-100vh"],

        transition: {
          y: {
            type: "spring",
            duration: 2,
          },
        },
      }}
      className={styles.container}
      key="loader"
      style={{
        width: windowSize.width,
        gridTemplateColumns: `repeat(${cols.current}, ${CELL_SIZE}px)`,
      }}
    >
      {grid.flatMap((row, r) =>
        row.map((cell, c) => (
          <div
            key={`${r}-${c}`}
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              backgroundColor: cell ? "rgb(var(--text-red))" : "inherit",
            }}
          />
        ))
      )}
      <p className={styles.percentage}>{`[${loadingPercentage} %]`}</p>
    </motion.div>
  );
}

// Create empty grid
function makeEmptyGrid(rows: number, cols: number) {
  return Array.from({ length: rows }, () => Array(cols).fill(0));
}

// Return next generation
function nextGen(grid: any[][]) {
  const rows = grid.length;
  const cols = grid[0].length;
  const newGrid = makeEmptyGrid(rows, cols);

  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
    [1, 1],
    [-1, -1],
    [1, -1],
    [-1, 1],
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let liveNeighbors = 0;
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          liveNeighbors += grid[nr][nc];
        }
      }

      if (grid[r][c] === 1 && (liveNeighbors === 2 || liveNeighbors === 3)) {
        newGrid[r][c] = 1;
      } else if (grid[r][c] === 0 && liveNeighbors === 3) {
        newGrid[r][c] = 1;
      }
    }
  }

  return newGrid;
}

// function seedWithIvanZhao(grid: any[][]) {
//   const baseRow = 5;
//   const baseCol = 5;

//   // Very rough pixel letters — each array is a small pattern for a letter
//   const letters: Record<string, number[][]> = {
//     I: [
//       [1, 1, 1],
//       [0, 1, 0],
//       [0, 1, 0],
//       [0, 1, 0],
//       [1, 1, 1],
//     ],
//     V: [
//       [1, 0, 1],
//       [1, 0, 1],
//       [1, 0, 1],
//       [1, 0, 1],
//       [0, 1, 0],
//     ],
//     A: [
//       [0, 1, 0],
//       [1, 0, 1],
//       [1, 1, 1],
//       [1, 0, 1],
//       [1, 0, 1],
//     ],
//     N: [
//       [1, 1, 1],
//       [1, 0, 1],
//       [1, 0, 1],
//       [1, 0, 1],
//       [1, 0, 1],
//     ],
//     Z: [
//       [1, 1, 1],
//       [0, 0, 1],
//       [0, 1, 0],
//       [1, 0, 0],
//       [1, 1, 1],
//     ],
//     H: [
//       [1, 0, 1],
//       [1, 0, 1],
//       [1, 1, 1],
//       [1, 0, 1],
//       [1, 0, 1],
//     ],
//     O: [
//       [1, 1, 1],
//       [1, 0, 1],
//       [1, 0, 1],
//       [1, 0, 1],
//       [1, 1, 1],
//     ],
//     SPACE: [[]],
//   };

//   const lines = [
//     ["I", "V", "A", "N"],
//     ["Z", "H", "A", "O"],
//   ];

//   lines.forEach((line, lineIndex) => {
//     let colOffset = baseCol;

//     for (const char of line) {
//       const pattern = letters[char] || [[]];
//       for (let r = 0; r < pattern.length; r++) {
//         for (let c = 0; c < pattern[r].length; c++) {
//           const row = baseRow + lineIndex * (pattern.length + 1) + r; // stack vertically
//           const col = colOffset + c;
//           if (grid[row] && grid[row][col] !== undefined) {
//             grid[row][col] = pattern[r][c];
//           }
//         }
//       }

//       colOffset += 4; // space between letters
//     }
//   });
// }

function getAnimationSequence(rows: number, cols: number): [number, number][] {
  const grid = makeEmptyGrid(rows, cols);
  const sequence: [number, number][] = [];

  const baseRow = 5;
  const baseCol = 5;

  const letters: Record<string, number[][]> = {
    I: [
      [1, 1, 1],
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 1],
    ],
    V: [
      [1, 0, 1],
      [1, 0, 1],
      [1, 0, 1],
      [1, 0, 1],
      [0, 1, 0],
    ],
    A: [
      [0, 1, 0],
      [1, 0, 1],
      [1, 1, 1],
      [1, 0, 1],
      [1, 0, 1],
    ],
    N: [
      [1, 1, 1],
      [1, 0, 1],
      [1, 0, 1],
      [1, 0, 1],
      [1, 0, 1],
    ],
    Z: [
      [1, 1, 1],
      [0, 0, 1],
      [0, 1, 0],
      [1, 0, 0],
      [1, 1, 1],
    ],
    H: [
      [1, 0, 1],
      [1, 0, 1],
      [1, 1, 1],
      [1, 0, 1],
      [1, 0, 1],
    ],
    O: [
      [1, 1, 1],
      [1, 0, 1],
      [1, 0, 1],
      [1, 0, 1],
      [1, 1, 1],
    ],
    SPACE: [[]],
  };

  const lines = [
    ["I", "V", "A", "N"],
    ["Z", "H", "A", "O"],
  ];

  lines.forEach((line, lineIndex) => {
    let colOffset = baseCol;

    for (const char of line) {
      const pattern = letters[char] || [[]];
      for (let r = 0; r < pattern.length; r++) {
        for (let c = 0; c < pattern[r].length; c++) {
          if (pattern[r][c] === 1) {
            const row = baseRow + lineIndex * (pattern.length + 1) + r;
            const col = colOffset + c;
            if (row < rows && col < cols) {
              sequence.push([row, col]);
            }
          }
        }
      }

      colOffset += 4;
    }
  });

  return sequence;
}
