"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { GithubIcon } from "@/components/ui/brand-icons";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="relative py-24 sm:py-32">
      {/* Section ambient signal glow */}
      <div
        aria-hidden
        className="section-bg-cta-glow pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-[400px] -translate-y-1/2"
      />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="grain relative overflow-hidden rounded-3xl border border-border bg-foreground px-6 py-20 text-center text-background sm:px-12 sm:py-28"
        >
          <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-[0.06]" />

          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-background/60">
              Ready to build?
            </p>
            <h2 className="font-display mt-4 text-4xl leading-[1.05] tracking-tight text-balance sm:text-6xl">
              Your project deserves a real domain.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base text-background/70 text-pretty sm:text-lg">
              Join 25,000+ developers shipping with Stackryze. Affordable
              infrastructure, built for everyone.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="group bg-background text-foreground hover:bg-background/90"
              >
                <Link href="#extensions">
                  Get your free domain
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="group border-background/20 bg-transparent text-background hover:bg-background/10 hover:text-background"
              >
                <Link href="#">
                  <GithubIcon className="h-4 w-4" />
                  Star on GitHub
                  <Star className="h-3.5 w-3.5 text-signal" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
