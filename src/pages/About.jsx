import { Link } from "react-router-dom";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer-section";
import {
  Globe,
  Code,
  Github,
  Users,
  Shield,
  ArrowUpRight,
} from "lucide-react";

const pillars = [
  {
    icon: Code,
    title: "Open Source",
    description:
      "Transparent infrastructure across frontend, API, and DNS tooling.",
  },
  {
    icon: Users,
    title: "Developer Community",
    description:
      "Built for students, maintainers, and indie builders shipping worldwide.",
  },
  {
    icon: Shield,
    title: "Abuse Protected",
    description:
      "GitHub verification and active monitoring keep the registry safe.",
  },
  {
    icon: Globe,
    title: "Full Delegation",
    description:
      "Use Stackryze DNS or point NS records to any external provider.",
  },
];

const channels = [
  { label: "Support", address: "support@stackryze.com" },
  { label: "Abuse", address: "reportabuse@stackryze.com" },
  { label: "Security", address: "security@stackryze.com" },
];

export function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <Header />

      <main className="flex-1 w-full px-6 md:px-12 lg:px-16 pt-[calc(4.5rem+var(--incident-height,0px))] sm:pt-[calc(5rem+var(--incident-height,0px))] pb-16">
        <div className="max-w-[1600px] mx-auto border-x border-b border-border bg-background">
          {/* Concise Architectural Header */}
          <section className="relative bg-grid px-6 sm:px-12 lg:px-16 py-16 sm:py-20 border-t border-border overflow-hidden">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 right-0 w-[440px] h-64 bg-[radial-gradient(ellipse_at_top_right,rgba(124,92,255,0.14),transparent_70%)]"
            />
            <div className="relative z-10 max-w-3xl space-y-5">
              <p className="font-mono text-xs text-muted-foreground">
                About Stackryze Domains
              </p>
              <h1 className="text-3xl sm:text-5xl font-semibold tracking-[-0.04em] leading-[1.08] text-foreground text-balance">
                A free, open namespace built for developers.
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
                Stackryze provides free subdomains with instant PowerDNS delegation across{" "}
                <span className="font-mono text-xs text-foreground">
                  .indevs.in · .sryze.cc · .ryzedns.org · .nx.kg · .ryzn.pro
                </span>{" "}
                so builders can ship projects without credit cards or paywalls.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
                >
                  Register Domain
                </Link>
                <a
                  href="https://github.com/stackryze/FreeDomains"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-border bg-card text-foreground text-sm font-medium hover:bg-secondary transition-colors"
                >
                  <Github className="w-4 h-4" aria-hidden="true" />
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </section>

          {/* 4-Column Hairline Principles Strip */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-border divide-y sm:divide-y-0 sm:divide-x divide-border">
            {pillars.map((pillar) => {
              const IconComp = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="p-6 sm:p-8 flex flex-col justify-between gap-4 bg-background"
                >
                  <IconComp className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                  <div className="space-y-1">
                    <h2 className="text-sm font-semibold text-foreground tracking-tight">
                      {pillar.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Clean Bottom Channels & Links Bar */}
          <section className="border-t border-border grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border">
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
              {channels.map((ch) => (
                <a
                  key={ch.address}
                  href={`mailto:${ch.address}`}
                  className="px-6 py-4 hover:bg-secondary/40 transition-colors flex flex-col gap-0.5"
                >
                  <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
                    {ch.label}
                  </span>
                  <span className="font-mono text-xs sm:text-sm text-foreground truncate">
                    {ch.address}
                  </span>
                </a>
              ))}
            </div>

            <div className="lg:col-span-4 grid grid-cols-2 divide-x divide-border">
              <a
                href="https://docs.stackryze.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 flex items-center justify-between text-xs font-mono text-foreground hover:bg-secondary/40 transition-colors"
              >
                <span>Documentation</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
              </a>
              <a
                href="https://discord.gg/wr7s97cfM7"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 flex items-center justify-between text-xs font-mono text-foreground hover:bg-secondary/40 transition-colors"
              >
                <span>Discord</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
