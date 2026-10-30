import { motion, useReducedMotion } from "framer-motion";

/**
 * Scroll-reveal wrapper. Animates once, on first entry into view — never on
 * routine scroll past an already-seen section. Respects reduced motion by
 * falling back to a plain opacity cross-fade with no movement.
 */
export function Reveal({ children, className, delay = 0, y = 16, as = "div" }) {
  const reduceMotion = useReducedMotion();
  const Comp = motion[as] ?? motion.div;

  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: reduceMotion ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  );
}

/**
 * Stagger container — children should be <Reveal> or motion elements with
 * variants="item". Splits entrances ~100ms apart per better-ui guidance.
 */
export function RevealGroup({ children, className, stagger = 0.08 }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: reduceMotion ? 0 : stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

export const revealItem = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};
