import { Globe2, Sparkles, Server, Zap, Shield, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { chipColor } from "@/lib/chips";

export function DomainExtensionsSection() {
  const extensions = [
    {
      ext: ".indevs.in",
      description: "Accessible, secure digital identities for developers and open-source projects.",
      icon: Globe2,
    },
    {
      ext: ".sryze.cc",
      description: "A modern namespace for creators, projects, and digital-first applications.",
      icon: Sparkles,
    },
    {
      ext: ".ryzedns.org",
      description: "Supporting self-hosted infrastructure and open-source network services.",
      icon: Server,
    },
    {
      ext: ".nx.kg",
      description: "A concise namespace built for the next generation of web applications.",
      icon: Zap,
    },
    {
      ext: ".ryzn.pro",
      description: "Pro-grade domain namespace for developer tools and SaaS platforms.",
      icon: Shield,
    }
  ];

  return (
    <div className="w-full flex flex-col justify-start">
      <div className="mb-6 md:mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/80 backdrop-blur-md px-3 py-1 text-xs font-mono tracking-wider uppercase mb-2">
          <Globe2 className="w-3.5 h-3.5 text-signal" />
          <span>Domain Registry</span>
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-tight">
          Available <span className="text-gradient-signal">Namespaces</span>
        </h2>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          Curated extensions powered by Stackryze global authoritative DNS.
        </p>
      </div>

      <div className="flex flex-col gap-2.5 w-full">
        {extensions.map((item, idx) => (
          <Link
            key={idx}
            to="/register"
            className="group flex items-center justify-between gap-4 rounded-2xl bg-card/70 backdrop-blur-md px-4 py-3.5 transition-all duration-150 hover:bg-card shadow-border"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-secondary border border-border shrink-0 transition-colors group-hover:border-foreground/20"
                style={{ color: chipColor(idx) }}
              >
                <item.icon className="w-4 h-4" strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm md:text-base font-bold text-foreground tracking-tight">
                    {item.ext}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-signal bg-signal/10 px-2 py-0.5 rounded-full border border-signal/20 font-medium">
                    Free
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate max-w-[220px] sm:max-w-md">
                  {item.description}
                </p>
              </div>
            </div>
            <div className="w-7 h-7 rounded-lg bg-secondary/60 flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:bg-secondary transition-all shrink-0">
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
