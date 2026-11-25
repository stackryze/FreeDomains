"use client";

import { motion } from "framer-motion";
import {
  Code2,
  Sparkles,
  GraduationCap,
  Rocket,
  Server,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const cases: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: Code2,
    title: "Portfolio & personal sites",
    description:
      "Grab a free subdomain, point it to Vercel or Netlify, and launch your portfolio in under 60 seconds.",
  },
  {
    icon: Sparkles,
    title: "Open source projects",
    description:
      "Give your library or tool a memorable domain with custom DNS — no cost, full credibility.",
  },
  {
    icon: GraduationCap,
    title: "Student projects & hackathons",
    description:
      "Zero budget? Ship with a professional domain. Perfect for school projects, demos, and competitions.",
  },
  {
    icon: Rocket,
    title: "Startup MVPs & landing pages",
    description:
      "Validate ideas fast with a custom domain. Upgrade to a paid TLD later when you're ready to scale.",
  },
  {
    icon: Server,
    title: "Self-hosted services",
    description:
      "Point subdomains to your homelab, VPS, or Raspberry Pi. Full DNS control means full flexibility.",
  },
  {
    icon: Workflow,
    title: "API & microservice routing",
    description:
      "Use DNS records to route traffic across services. SRV, CNAME, and HTTPS records fully supported.",
  },
];

export function UsecasesSection() {
  return (
    <section id="usecases" className="relative py-24 sm:py-32">
      {/* Left-side aurora glow */}
      <div
        aria-hidden
        className="section-bg-aurora-left pointer-events-none absolute inset-0 -z-10 opacity-60"
      />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Built for real projects
          </p>
          <h2 className="font-display mt-3 text-4xl tracking-tight text-balance sm:text-5xl">
            From side projects to production.
          </h2>
          <p className="mt-4 text-muted-foreground text-pretty">
            Developers use Stackryze for everything from hackathons to
            self-hosted infrastructure.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.5,
                  delay: (i % 3) * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative flex flex-col gap-4 bg-card p-8 transition-colors hover:bg-accent/40"
              >
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-muted text-foreground transition-all duration-300 group-hover:scale-110 group-hover:bg-foreground group-hover:text-background">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-xl tracking-tight">
                  {c.title}
                </h3>
                <p className="text-sm text-muted-foreground text-pretty">
                  {c.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
