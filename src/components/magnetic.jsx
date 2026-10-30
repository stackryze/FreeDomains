import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Wraps a button/link so it subtly pulls toward the cursor within a small
 * radius. Pointer-type gated: magnetic pull only engages for mouse/trackpad,
 * never fights a touch tap, and is a no-op under reduced motion.
 */
export function Magnetic({ children, strength = 18, className }) {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const reduceMotion = useReducedMotion();

  const handleMouseMove = (e) => {
    if (reduceMotion || e.pointerType === "touch") return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    setOffset({ x: x * strength, y: y * strength });
  };

  const reset = () => setOffset({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMouseMove}
      onPointerLeave={reset}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 200, damping: 15, mass: 0.4 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
