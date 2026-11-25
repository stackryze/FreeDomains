"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Activity, Globe2, Users, ShieldCheck } from "lucide-react";

const stats = [
  {
    icon: Globe2,
    value: 46000,
    suffix: "+",
    label: "Active domains",
    note: "Live across the network",
  },
  {
    icon: Users,
    value: 25000,
    suffix: "+",
    label: "Developers & students",
    note: "Shipping every week",
  },
  {
    icon: Activity,
    value: 120,
    suffix: "+",
    label: "Countries reached",
    note: "From Tokyo to Lima",
  },
  {
    icon: ShieldCheck,
    value: 99.9,
    suffix: "%",
    label: "Uptime SLA",
    note: "Backed by a public status page",
    decimals: 1,
  },
];

function CountUp({
  end,
  duration = 1.6,
  decimals = 0,
  suffix = "",
}: {
  end: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
}) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const startTime = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 3);
      const current = start + (end - start) * eased;
      setValue(current);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, end, duration]);

  const display = decimals > 0
    ? value.toFixed(decimals)
    : Math.round(value).toLocaleString();

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section id="stats" className="relative border-y border-border/60 py-24 sm:py-32">
      {/* Soft tinted band — single composited layer */}
      <div
        aria-hidden
        className="section-bg-card-tint pointer-events-none absolute inset-0 -z-10 fade-y-both"
      />
      <div
        aria-hidden
        className="bg-dots pointer-events-none absolute inset-0 -z-10 opacity-30 fade-edges"
      />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            The numbers
          </p>
          <h2 className="font-display mt-3 text-4xl tracking-tight text-balance sm:text-5xl">
            Infrastructure you can count on.
          </h2>
          <p className="mt-4 text-muted-foreground text-pretty">
            Real metrics, no padding. We publish what we ship and how it
            performs.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="group relative flex flex-col gap-6 bg-card p-8 transition-colors hover:bg-accent/40"
              >
                <div className="flex items-center justify-between">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-muted text-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div>
                  <div className="font-display text-5xl tracking-tight">
                    <CountUp
                      end={s.value}
                      decimals={s.decimals ?? 0}
                      suffix={s.suffix}
                    />
                  </div>
                  <div className="mt-2 text-sm font-medium">{s.label}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {s.note}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
