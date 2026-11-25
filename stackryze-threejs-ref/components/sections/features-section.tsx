"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Globe,
  Network,
  Code2,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const features: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  href: string;
  visual: React.ReactNode;
}[] = [
  {
    icon: Globe,
    eyebrow: "Free domains",
    title: "A real domain in under a minute.",
    description:
      "Sign in with GitHub, search a name, claim it. No forms, no payment, no email verification.",
    bullets: [
      "Four unique extensions for different communities",
      "One-click GitHub authentication",
      "Point it anywhere or use our DNS",
    ],
    href: "#extensions",
    visual: <DomainSearchMock />,
  },
  {
    icon: Network,
    eyebrow: "Managed DNS",
    title: "Authoritative DNS, the way it should be.",
    description:
      "PowerDNS infrastructure with every record type you'd expect, served from nameservers in NYC and Hyderabad.",
    bullets: [
      "Full record support: A, AAAA, CNAME, MX, SRV, SVCB, HTTPS, TLSA",
      "Global anycast nameservers",
      "A clean dashboard that doesn't get in your way",
    ],
    href: "#",
    visual: <DNSRecordsMock />,
  },
  {
    icon: Code2,
    eyebrow: "Open source",
    title: "Every line of code is public.",
    description:
      "Self-host the entire platform, audit the infrastructure, or contribute features back. There are no private repositories.",
    bullets: [
      "Public GitHub organization",
      "Self-hostable in a single command",
      "Issue-driven roadmap",
    ],
    href: "#",
    visual: <CodeMock />,
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      {/* Subtle aurora glow behind features */}
      <div
        aria-hidden
        className="section-bg-aurora-right pointer-events-none absolute inset-0 -z-10 opacity-60"
      />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="rounded-full px-3 py-1">
            What we build
          </Badge>
          <h2 className="font-display mt-4 text-4xl tracking-tight text-balance sm:text-5xl">
            Everything you need.
            <br />
            <span className="text-muted-foreground">Nothing you don't.</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-pretty">
            Simple, powerful tools for developers who want infrastructure
            without the overhead.
          </p>
        </div>

        <div className="mt-20 space-y-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            const isReversed = i % 2 === 1;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-foreground/20"
              >
                <div
                  className={`grid grid-cols-1 gap-0 lg:grid-cols-2 ${
                    isReversed ? "lg:direction-rtl" : ""
                  }`}
                >
                  <div
                    className={`flex flex-col justify-center p-8 sm:p-12 ${
                      isReversed ? "lg:order-2" : ""
                    }`}
                    dir="ltr"
                  >
                    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      <Icon className="h-3.5 w-3.5" />
                      {f.eyebrow}
                    </div>
                    <h3 className="font-display mt-4 text-3xl tracking-tight text-balance sm:text-4xl">
                      {f.title}
                    </h3>
                    <p className="mt-4 text-muted-foreground text-pretty">
                      {f.description}
                    </p>
                    <ul className="mt-6 space-y-2.5">
                      {f.bullets.map((b) => (
                        <li
                          key={b}
                          className="flex items-start gap-3 text-sm"
                        >
                          <span className="mt-1.5 grid h-1.5 w-1.5 shrink-0 place-items-center rounded-full bg-foreground" />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8">
                      <Link
                        href={f.href}
                        className="group/link inline-flex items-center gap-1.5 text-sm font-medium text-foreground"
                      >
                        Learn more
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                      </Link>
                    </div>
                  </div>

                  <div
                    className={`relative min-h-[320px] overflow-hidden border-t border-border bg-muted/30 lg:border-l lg:border-t-0 ${
                      isReversed ? "lg:order-1 lg:border-l-0 lg:border-r" : ""
                    }`}
                    dir="ltr"
                  >
                    <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-10">
                      {f.visual}
                    </div>
                    {/* Subtle grid */}
                    <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
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

function DomainSearchMock() {
  return (
    <div className="w-full max-w-sm rounded-xl border border-border bg-background p-4 shadow-sm">
      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5">
        <span className="text-sm text-muted-foreground">search</span>
        <span className="font-mono text-sm text-foreground">your-name</span>
        <span className="ml-auto text-xs text-signal">Available</span>
      </div>
      <div className="mt-3 space-y-1.5">
        {[
          { ext: ".indevs.in", free: true },
          { ext: ".sryze.cc", free: true },
          { ext: ".ryzedns.org", free: true },
          { ext: ".nx.kg", free: false },
        ].map((d) => (
          <div
            key={d.ext}
            className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2 text-sm"
          >
            <span className="font-mono text-foreground">{d.ext}</span>
            <span
              className={
                d.free
                  ? "text-xs text-signal"
                  : "text-xs text-muted-foreground"
              }
            >
              {d.free ? "Free" : "Taken"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DNSRecordsMock() {
  const rows = [
    { type: "A", name: "@", value: "192.0.2.1" },
    { type: "CNAME", name: "www", value: "edge.stackryze.dev" },
    { type: "MX", name: "@", value: "10 mail" },
    { type: "TXT", name: "@", value: "v=spf1 -all" },
    { type: "HTTPS", name: "@", value: "1 . alpn=h2" },
  ];
  return (
    <div className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-background shadow-sm">
      <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-foreground/20" />
          <span className="h-2 w-2 rounded-full bg-foreground/20" />
          <span className="h-2 w-2 rounded-full bg-foreground/20" />
        </div>
        <span className="ml-2 font-mono text-xs text-muted-foreground">
          dns.stackryze.com / records
        </span>
      </div>
      <div className="divide-y divide-border">
        {rows.map((r, i) => (
          <div
            key={i}
            className="grid grid-cols-12 items-center px-4 py-2.5 text-xs"
          >
            <span className="col-span-2 font-mono font-medium text-foreground">
              {r.type}
            </span>
            <span className="col-span-2 font-mono text-muted-foreground">
              {r.name}
            </span>
            <span className="col-span-7 truncate font-mono text-muted-foreground">
              {r.value}
            </span>
            <span className="col-span-1 text-right text-signal">●</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CodeMock() {
  return (
    <div className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-foreground text-background shadow-sm">
      <div className="flex items-center gap-2 border-b border-background/10 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-background/30" />
          <span className="h-2 w-2 rounded-full bg-background/30" />
          <span className="h-2 w-2 rounded-full bg-background/30" />
        </div>
        <span className="ml-2 font-mono text-xs text-background/60">
          stackryze/dns — MIT
        </span>
      </div>
      <pre className="overflow-hidden p-4 font-mono text-[11px] leading-relaxed">
        <code>
          <span className="text-background/40">$</span>{" "}
          <span className="text-background">git clone</span>{" "}
          <span className="text-background/70">github.com/stackryze/dns</span>
          {"\n"}
          <span className="text-background/40">$</span>{" "}
          <span className="text-background">cd</span> dns &&{" "}
          <span className="text-background">docker compose up</span>
          {"\n\n"}
          <span className="text-background/40">▸</span>{" "}
          <span className="text-signal">powerdns</span> listening on :53
          {"\n"}
          <span className="text-background/40">▸</span>{" "}
          <span className="text-signal">api</span> listening on :8080
          {"\n"}
          <span className="text-background/40">▸</span>{" "}
          <span className="text-background/60">self-hosted. fully yours.</span>
        </code>
      </pre>
    </div>
  );
}
