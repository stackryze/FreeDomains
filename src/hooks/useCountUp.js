import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Animates a number from 0 to the numeric part of `value` once the element
 * scrolls into view. Preserves any non-numeric prefix/suffix (e.g. "60,000+").
 */
export function useCountUp(value, { duration = 900 } = {}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const match = String(value).match(/^([^\d]*)([\d,]+)(.*)$/);
    if (!match || reduceMotion) {
      setDisplay(value);
      return;
    }
    const [, prefix, numStr, suffix] = match;
    const target = parseInt(numStr.replace(/,/g, ""), 10);
    if (!inView || Number.isNaN(target)) {
      setDisplay(`${prefix}0${suffix}`);
      return;
    }

    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(target * eased);
      setDisplay(`${prefix}${current.toLocaleString()}${suffix}`);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, inView, duration, reduceMotion]);

  return { ref, display };
}
