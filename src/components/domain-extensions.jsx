import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const extensions = [
  {
    tld: "indevs.in",
    sample: "yourapp",
    description: "Primary namespace for developers, portfolios, and open-source tools.",
  },
  {
    tld: "sryze.cc",
    sample: "api",
    description: "Short, modern namespace for creators, services, and web applications.",
  },
  {
    tld: "ryzedns.org",
    sample: "homelab",
    description: "Dedicated to self-hosted infrastructure and open-source network utilities.",
  },
  {
    tld: "nx.kg",
    sample: "go",
    description: "Concise two-letter namespace for fast links and edge deployments.",
  },
  {
    tld: "ryzn.pro",
    sample: "studio",
    description: "Structured namespace for production developer tools and SaaS demos.",
  },
];

export function DomainExtensionsSection() {
  return (
    <div className="flex flex-col justify-start">
      <div className="p-6 sm:p-10 lg:p-12 pb-6 sm:pb-8 space-y-2">
        <p className="font-mono text-xs text-muted-foreground">Public Registry</p>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-foreground">
          Available namespaces
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
          Five curated root domains with instant NS delegation and free annual renewals.
        </p>
      </div>

      <div className="border-t border-border divide-y divide-border">
        {extensions.map((item) => (
          <Link
            key={item.tld}
            to={`/register?root=${encodeURIComponent(item.tld)}`}
            className="group flex items-center justify-between gap-4 px-6 sm:px-10 lg:px-12 py-4 hover:bg-secondary/40 transition-colors duration-150"
          >
            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-mono text-sm font-medium tracking-tight">
                  <span className="text-muted-foreground">{item.sample}</span>
                  <span className="text-foreground font-semibold">.{item.tld}</span>
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground border border-border px-1.5 py-0.5 rounded">
                  Free · Renewable
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {item.description}
              </p>
            </div>

            <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors shrink-0">
              <span>Claim</span>
              <ArrowUpRight
                className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
