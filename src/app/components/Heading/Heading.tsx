import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const wordVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const charVariants = {
  hidden: { opacity: 0, y: "0.25em" },
  show: { opacity: 1, y: "0em" },
};

// known ligatures — you can extend this list
const ligatures = ["ffi", "ffl", "ff", "fi", "fl"];

// naive ligature-aware splitter
function segmentWithLigatures(text: string): string[] {
  const segments: string[] = [];
  let i = 0;
  while (i < text.length) {
    let matched = false;
    for (const lig of ligatures) {
      if (text.slice(i, i + lig.length) === lig) {
        segments.push(lig);
        i += lig.length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      segments.push(text[i]);
      i++;
    }
  }
  return segments;
}

export default function Heading({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const words = children.split(" ");

  return (
    <motion.h1
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={className}
      style={{ wordWrap: "break-word" }}
    >
      {words.map((word, wordIndex) => (
        <motion.span
          key={wordIndex}
          variants={wordVariants}
          style={{
            display: "inline-block",
            whiteSpace: "nowrap",
            marginRight: "0.25em",
          }}
        >
          {segmentWithLigatures(word).map((char, charIndex) => (
            <motion.span
              key={charIndex}
              variants={charVariants}
              style={{ display: "inline-block" }}
            >
              {char}
            </motion.span>
          ))}
        </motion.span>
      ))}
    </motion.h1>
  );
}
