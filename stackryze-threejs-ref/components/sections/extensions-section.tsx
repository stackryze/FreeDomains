"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const extensions = [
  {
    ext: ".indevs.in",
    blurb: "Developers & communities",
    description:
      "Built for engineers shipping side projects, open source libraries, and developer collectives.",
    accent: "from-foreground/10 to-foreground/0",
  },
  {
    ext: ".sryze.cc",
    blurb: "Creators & digital brands",
    description:
      "For designers, writers, and creators who want a memorable home for their work.",
    accent: "from-foreground/8 to-foreground/0",
  },
  {
    ext: ".ryzedns.org",
    blurb: "Self-hosted & open source",
    description:
      "A home for homelabs, self-hosted services, and infrastructure you run yourself.",
    accent: "from-foreground/6 to-foreground/0",
  },
  {
    ext: ".nx.kg",
    blurb: "Next-gen apps & platforms",
    description:
      "A new namespace for products that are too early for a .com and too serious for a .xyz.",
    accent: "from-foreground/12 to-foreground/0",
  },
];

export function ExtensionsSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      id="extensions"
      className="relative overflow-hidden border-y border-border/60 py-24 sm:py-32"
    >
      {/* Topographic contour — the infrastructure "signature" */}
      <div
        aria-hidden
        className="section-bg-topo pointer-events-none absolute inset-0 -z-10 opacity-[0.35] fade-y-both"
      />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Pick your extension
            </p>
            <h2 className="font-display mt-3 text-5xl leading-[0.95] tracking-tight text-balance sm:text-6xl lg:text-7xl">
              Pick
              <br />
              your
              <br />
              <span className="text-muted-foreground italic">extension.</span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="max-w-md text-lg leading-relaxed text-muted-foreground text-pretty">
              Four unique namespaces for different communities. Each one comes
              with full DNS control, instant setup, and zero cost.
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2">
          {extensions.map((e, i) => (
            <motion.div
              key={e.ext}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                "group relative flex flex-col gap-6 bg-card p-8 transition-colors duration-300 sm:p-10",
                "hover:bg-background",
              )}
            >
              <div
                className={cn(
                  "absolute inset-0 -z-10 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100",
                  e.accent,
                )}
              />

              <div className="flex items-start justify-between">
                <span className="font-mono text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
                  {e.ext}
                </span>
                <ArrowUpRight
                  className={cn(
                    "h-5 w-5 text-muted-foreground transition-all duration-300",
                    hovered === i
                      ? "-translate-y-0.5 translate-x-0.5 text-foreground"
                      : "",
                  )}
                />
              </div>

              <div>
                <div className="text-sm font-medium">{e.blurb}</div>
                <p className="mt-2 text-sm text-muted-foreground text-pretty">
                  {e.description}
                </p>
              </div>

              <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-6 text-xs text-muted-foreground">
                <span className="font-mono">
                  {String(i + 1).padStart(2, "0")} / {extensions.length}
                </span>
                <Link
                  href="#"
                  className="font-medium text-foreground transition-opacity hover:opacity-70"
                >
                  Check availability →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
