import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export function LiveStatsSection() {
  const [stats, setStats] = useState({
    activeDomains: "60,000+",
    totalUsers: "36,000+",
    countries: "120+",
    nameservers: "3",
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/public/stats`
        );
        if (response.ok) {
          const data = await response.json();
          setStats((prev) => ({
            ...prev,
            activeDomains:
              data.totalDomains > 60000
                ? `${data.totalDomains.toLocaleString()}+`
                : "60,000+",
            totalUsers:
              data.totalUsers > 36000
                ? `${data.totalUsers.toLocaleString()}+`
                : "36,000+",
          }));
        }
      } catch {
        // Keep baseline telemetry defaults when API is unreachable
      }
    };

    fetchStats();
  }, []);

  const statItems = [
    { label: "Active developers", value: stats.totalUsers, note: "GitHub-verified builders" },
    { label: "Registered domains", value: stats.activeDomains, note: "Across 5 public namespaces" },
    { label: "Countries served", value: stats.countries, note: "Worldwide resolution" },
    { label: "Authoritative PoPs", value: stats.nameservers, note: "US · Frankfurt · Hyderabad" },
  ];

  return (
    <div className="flex flex-col justify-between">
      <div className="p-6 sm:p-10 lg:p-12 pb-6 sm:pb-8 space-y-2">
        <p className="font-mono text-xs text-muted-foreground">Live Telemetry</p>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-foreground">
          Trusted worldwide
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
          Real-time registry totals and authoritative network health across our infrastructure.
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-end">
        <div className="relative border-t border-border">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(167,139,255,0.08),transparent_70%)]"
          />
          <div className="relative z-10 grid grid-cols-2 gap-px bg-border">
            {statItems.map((stat) => (
              <div key={stat.label} className="bg-background p-6 sm:p-8 space-y-1.5">
                <p className="font-mono text-2xl sm:text-4xl font-semibold tabular-nums tracking-[-0.03em] text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs font-medium text-foreground">{stat.label}</p>
                <p className="text-[11px] text-muted-foreground">{stat.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
          <a
            href="https://status.stackryze.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-6 sm:px-8 py-4 hover:bg-secondary/40 text-xs font-mono text-foreground transition-colors"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" aria-hidden="true" />
              <span>All Systems Operational</span>
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
          </a>

          <Link
            to="/whois"
            className="flex items-center justify-between px-6 sm:px-8 py-4 hover:bg-secondary/40 text-xs font-mono text-foreground transition-colors"
          >
            <span>Open WHOIS Lookup</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
