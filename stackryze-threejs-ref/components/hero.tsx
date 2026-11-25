"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GithubIcon } from "@/components/ui/brand-icons";

const OrbitalScene = dynamic(
  () =>
    import("@/components/three/orbital-scene").then(
      (mod) => mod.OrbitalScene,
    ),
  {
    ssr: false,
    loading: () => null,
  },
);

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.06,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Background atmosphere — single composited layer */}
      <div
        aria-hidden
        className="bg-glow-signal pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] fade-bottom"
      />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Copy column */}
          <div className="lg:col-span-7">
            <motion.div
              initial="hidden"
              animate="visible"
              custom={0}
              variants={fadeUp}
            >
              <Badge variant="outline" className="gap-1.5 rounded-full px-3 py-1">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-signal opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
                </span>
                <Sparkles className="h-3 w-3" />
                Affordable infrastructure
              </Badge>
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="visible"
              custom={1}
              variants={fadeUp}
              className="font-display mt-6 text-5xl leading-[0.95] tracking-tight text-balance sm:text-6xl lg:text-7xl"
            >
              Domains & DNS,
              <br />
              built for{" "}
              <span className="text-gradient-signal italic">
                everyone
              </span>{" "}
              shipping online.
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="visible"
              custom={2}
              variants={fadeUp}
              className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty"
            >
              Stackryze is a small, focused company on a mission to make
              reliable internet infrastructure affordable. We build the
              platforms developers reach for first — and we make them
              accessible to anyone who needs them.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="visible"
              custom={3}
              variants={fadeUp}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Button asChild size="lg" className="group">
                <Link href="#extensions">
                  Claim your free domain
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="group">
                <Link href="#features">
                  <GithubIcon className="h-4 w-4" />
                  Explore the platform
                </Link>
              </Button>
            </motion.div>

            <motion.dl
              initial="hidden"
              animate="visible"
              custom={4}
              variants={fadeUp}
              className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-border/60 pt-8"
            >
              {[
                { k: "46,000+", v: "domains live" },
                { k: "25,000+", v: "developers" },
                { k: "120+", v: "countries" },
              ].map((s) => (
                <div key={s.v}>
                  <dt className="font-display text-2xl tracking-tight">
                    {s.k}
                  </dt>
                  <dd className="mt-0.5 text-xs uppercase tracking-wider text-muted-foreground">
                    {s.v}
                  </dd>
                </div>
              ))}
            </motion.dl>
          </div>

          {/* Visual column */}
          <div className="relative lg:col-span-5">
            <div className="relative aspect-square w-full">
              <OrbitalScene className="absolute inset-0 h-full w-full" />
              {/* Floating domain chips around the scene */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute left-2 top-6 hidden rounded-full border border-border bg-background/80 px-3 py-1.5 font-mono text-[11px] text-muted-foreground backdrop-blur-md sm:block"
              >
                <span className="text-foreground">alex</span>.indevs.in
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute right-2 top-16 hidden rounded-full border border-border bg-background/80 px-3 py-1.5 font-mono text-[11px] text-muted-foreground backdrop-blur-md sm:block"
              >
                <span className="text-foreground">ship</span>.sryze.cc
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-8 left-6 hidden rounded-full border border-border bg-background/80 px-3 py-1.5 font-mono text-[11px] text-muted-foreground backdrop-blur-md sm:block"
              >
                <span className="text-foreground">ns1</span>.ryzedns.org
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-2 right-4 hidden rounded-full border border-border bg-background/80 px-3 py-1.5 font-mono text-[11px] text-muted-foreground backdrop-blur-md sm:block"
              >
                <span className="text-foreground">app</span>.nx.kg
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
