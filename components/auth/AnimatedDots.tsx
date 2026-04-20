"use client";

import { motion } from "framer-motion";

const AnimatedDots = ({ position }: { position: "top" | "bottom" }) => {
  const dotsPattern = Array.from({ length: 8 }, (_, row) =>
    Array.from({ length: 16 }, (_, col) => ({ row, col })),
  ).flat();

  return (
    <div
      className={`absolute ${
        position === "top" ? "top-0 right-0" : "bottom-0 left-0"
      } pointer-events-none overflow-hidden`}
      style={{ width: "200px", height: "200px" }}
    >
      {dotsPattern.map(({ row, col }, index) => (
        <motion.div
          key={`${row}-${col}`}
          className="absolute bg-green-900"
          style={{
            width: "3px",
            height: "10px",
            left: `${col * 16}px`,
            top: `${row * 25}px`,
            transform: "rotate(-45deg)",
            transformOrigin: "center",
          }}
          initial={{ opacity: 0.3 }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: index * 0.05,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedDots;
