import { Fingerprint, Workflow, Radio } from "lucide-react";
import { RevealGroup, revealItem } from "./reveal";
import { motion } from "framer-motion";

const STAGES = [
  {
    num: "01",
    icon: Fingerprint,
    title: "Claim your name",
    body: "Pick a subdomain across our authoritative TLDs. Availability is checked live, instantly, no waitlist.",
  },
  {
    num: "02",
    icon: Workflow,
    title: "Point your records",
    body: "Add A, AAAA, CNAME, MX or TXT records from the dashboard or the REST API. Validated before they ever propagate.",
  },
  {
    num: "03",
    icon: Radio,
    title: "Resolves everywhere",
    body: "Live on our authoritative nameservers across three continents within seconds — no caching delay to fight.",
  },
];

/**
 * A straightforward, non-pinned 3-step section. An earlier version used a
 * GSAP ScrollTrigger pin to scrub between stages — visually nice while
 * actively scrolling, but it reserves several viewport-heights of empty
 * document space that any static capture (screenshots, print view) renders
 * as a large blank gap, since the "pin" illusion only exists while JS is
 * driving real scroll events. Trading that fragility for a a plain
 * horizontal layout with a connecting line and a staggered reveal.
 */
export function HowItWorksSection() {
  return (
    <section className="relative w-full bg-background overflow-hidden py-16 sm:py-24">
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-50 z-0" />

      <div className="relative z-10 w-full px-6 md:px-12 lg:px-16">
        <div className="max-w-[1600px] mx-auto w-full">
          <div className="mb-10 md:mb-16 max-w-2xl space-y-3">
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">How it works</span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground tracking-tight">
              From name to resolution.
            </h2>
          </div>

          <RevealGroup className="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {/* Connector line spanning the row, under the icons (desktop only) */}
            <div aria-hidden className="hidden md:block absolute top-6 left-[16.6%] right-[16.6%] h-px bg-border" />

            {STAGES.map((stage) => (
              <motion.div key={stage.num} variants={revealItem} className="relative space-y-4">
                <div className="relative z-10 w-12 h-12 rounded-xl bg-background border border-signal/30 ring-4 ring-background flex items-center justify-center text-signal">
                  <stage.icon className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <div className="space-y-1.5">
                  <span className="font-mono text-xs text-muted-foreground">{stage.num}</span>
                  <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground tracking-tight">
                    {stage.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">{stage.body}</p>
                </div>
              </motion.div>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
