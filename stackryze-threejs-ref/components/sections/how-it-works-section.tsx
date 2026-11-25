"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Settings2, ArrowRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/brand-icons";
import { Button } from "@/components/ui/button";

const steps = [
  {
    n: "01",
    icon: GithubIcon,
    title: "Sign in with GitHub",
    description:
      "One-click authentication. No forms, no email verification, no waiting.",
  },
  {
    n: "02",
    icon: Search,
    title: "Search & register",
    description:
      "Find an available name, pick your extension, and claim it instantly.",
  },
  {
    n: "03",
    icon: Settings2,
    title: "Configure DNS",
    description:
      "Point your domain anywhere — or use our managed DNS for full record control.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="relative border-y border-border/60 py-24 sm:py-32">
      <div
        aria-hidden
        className="section-bg-card-tint-soft pointer-events-none absolute inset-0 -z-10 fade-y-both"
      />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            How it works
          </p>
          <h2 className="font-display mt-3 text-4xl tracking-tight text-balance sm:text-5xl">
            Live in 60 seconds.
          </h2>
          <p className="mt-4 text-muted-foreground text-pretty">
            Three steps from zero to deployed. No credit card required.
          </p>
        </div>

        <div className="relative mt-16">
          {/* Connecting line */}
          <div className="pointer-events-none absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group relative"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative grid h-24 w-24 shrink-0 place-items-center rounded-2xl border border-border bg-background transition-colors group-hover:border-foreground/40">
                      <Icon className="h-7 w-7 text-foreground" />
                      <span className="absolute -top-2 -right-2 grid h-7 w-7 place-items-center rounded-full bg-foreground font-mono text-[10px] text-background">
                        {s.n}
                      </span>
                    </div>
                    <div className="hidden flex-1 items-center text-muted-foreground md:flex">
                      {i < steps.length - 1 && (
                        <ArrowRight className="h-4 w-4 animate-pulse-dot" />
                      )}
                    </div>
                  </div>
                  <h3 className="font-display mt-6 text-2xl tracking-tight">
                    {s.title}
                  </h3>
                  <p className="mt-2 max-w-sm text-sm text-muted-foreground text-pretty">
                    {s.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="group">
            <Link href="#">
              Start now — it's free
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="#">Read the docs</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
