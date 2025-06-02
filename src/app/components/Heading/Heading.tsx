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
      style={{
        wordWrap: "break-word",
      }}
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
          {word.split("").map((char, charIndex) => (
            <motion.span
              key={charIndex}
              variants={charVariants}
              style={{
                display: "inline-block",
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.span>
      ))}
    </motion.h1>
  );
}
