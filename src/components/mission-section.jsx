import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check } from "lucide-react";
import { DottedMap } from "./ui/dotted-map";

const DELEGATION_MODES = {
  stackryze: {
    label: "Stackryze DNS",
    summary: "Authoritative PowerDNS (dns.stackryze.com)",
    hosts: ["ns1.stackryze.com", "ns2.stackryze.com", "ns3.stackryze.com"],
  },
  external: {
    label: "External NS",
    summary: "Bring 2–6 nameservers from any DNS provider",
    hosts: ["ns1.your-dns-provider.tld", "ns2.your-dns-provider.tld", "ns3–ns6 optional"],
  },
};

const EDGE_NODES = [
  { id: "ns1", host: "ns1.stackryze.com", city: "New York", lat: 40.7128, lng: -74.006 },
  { id: "ns2", host: "ns2.stackryze.com", city: "Frankfurt", lat: 50.1109, lng: 8.6821 },
  { id: "ns3", host: "ns3.stackryze.com", city: "Hyderabad", lat: 17.385, lng: 78.4867 },
];

function Crosshair({ className }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 15 15"
      className={`w-3.5 h-3.5 text-muted-foreground/70 pointer-events-none ${className}`}
      fill="none"
    >
      <path d="M7.5 0V15M0 7.5H15" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function MissionSection() {
  const [provider, setProvider] = useState("stackryze");
  const [activeNodeId, setActiveNodeId] = useState("ns1");
  const currentMode = DELEGATION_MODES[provider];
  const mapMarkers = EDGE_NODES.map((n) => ({
    lat: n.lat,
    lng: n.lng,
    size: n.id === activeNodeId ? 0.9 : 0.6,
    pulse: n.id === activeNodeId,
    label: n.id,
  }));

  return (
    <section className="w-full px-6 md:px-12 lg:px-16">
      <div className="relative max-w-[1600px] mx-auto border-x border-b border-border bg-background">
        <Crosshair className="absolute -top-[7px] -left-[7px] z-20" />
        <Crosshair className="absolute -top-[7px] -right-[7px] z-20" />

        {/* Architectural Header Banner */}
        <div className="relative bg-grid px-6 sm:px-12 lg:px-16 py-16 sm:py-24 overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-6">
            <h2 className="text-3xl sm:text-5xl lg:text-[52px] font-semibold tracking-[-0.04em] leading-[1.08] text-foreground text-balance">
              Your complete developer namespace.{" "}
              <span className="text-muted-foreground font-medium">
                Real DNS delegation, built for global deployment.
              </span>
            </h2>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
              >
                Register Domain
              </Link>
              <a
                href="https://docs.stackryze.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full border border-border bg-card text-foreground text-sm font-medium hover:bg-secondary transition-colors"
              >
                <span>Documentation</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* 2-Column Edge-Cropped Visual Panels (No nested boxes) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border border-t border-border">
          {/* Left Panel: Authoritative Nameserver Delegation */}
          <div className="relative pt-8 sm:pt-10 px-6 sm:px-10 lg:px-12 overflow-hidden flex flex-col justify-between gap-8 min-h-[380px] bg-background">
            <div className="space-y-2 max-w-md relative z-10">
              <h3 className="text-xl sm:text-2xl font-semibold tracking-[-0.03em] text-foreground">
                Use Stackryze DNS or external nameservers.
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Keep default{" "}
                <span className="font-mono text-foreground">ns1–ns3.stackryze.com</span>{" "}
                delegation with StackNS, or point NS records to any external DNS host.
              </p>
            </div>

            {/* Lit visual stage bleeding into bottom-right edge */}
            <div className="relative flex-1 flex items-end">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-16 left-1/2 -translate-x-1/2 w-[110%] h-56 bg-[radial-gradient(ellipse_at_bottom,rgba(124,92,255,0.22),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_bottom,rgba(167,139,255,0.18),transparent_70%)]"
              />

              <div className="relative z-10 w-full rounded-t-xl border-x border-t border-border bg-card shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between gap-4 px-5 border-b border-border">
                  <span className="font-mono text-xs text-muted-foreground truncate py-3">
                    {currentMode.summary}
                  </span>
                  <div className="flex items-center gap-4 shrink-0 -mb-px" role="tablist" aria-label="Delegation mode">
                    {Object.entries(DELEGATION_MODES).map(([key, item]) => (
                      <button
                        key={key}
                        type="button"
                        role="tab"
                        aria-selected={provider === key}
                        onClick={() => setProvider(key)}
                        className={`py-3 text-xs font-medium border-b-2 transition-colors ${
                          provider === key
                            ? "border-foreground text-foreground"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="divide-y divide-border font-mono text-xs">
                  {currentMode.hosts.map((host, idx) => (
                    <div
                      key={host}
                      className="flex items-center justify-between gap-4 px-5 py-3.5"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <span className="text-muted-foreground w-10 shrink-0 tabular-nums">
                          NS{idx + 1}
                        </span>
                        <span className="text-foreground truncate">{host}</span>
                      </div>
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" aria-hidden="true" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Authoritative Edge Map Bleeding Cleanly to Edges */}
          <div className="relative pt-8 sm:pt-10 px-6 sm:px-10 lg:px-12 overflow-hidden flex flex-col justify-between gap-6 min-h-[380px] bg-background">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 relative z-10">
              <div className="space-y-2 max-w-md">
                <h3 className="text-xl sm:text-2xl font-semibold tracking-[-0.03em] text-foreground">
                  Globally distributed authoritative nodes.
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Powered by PowerDNS across North America, Europe, and India for consistent resolution worldwide.
                </p>
              </div>
            </div>

            {/* Clean interactive node tabs + seamless map */}
            <div className="relative flex-1 flex flex-col justify-end">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-[radial-gradient(ellipse_at_bottom,rgba(167,139,255,0.12),transparent_70%)]"
              />

              <div className="relative z-10 flex flex-wrap items-center gap-2 pb-3">
                {EDGE_NODES.map((node) => {
                  const selected = node.id === activeNodeId;
                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => setActiveNodeId(node.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[11px] border transition-colors ${
                        selected
                          ? "bg-foreground text-background border-foreground font-medium"
                          : "bg-card text-muted-foreground border-border hover:text-foreground"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          selected ? "bg-emerald-500" : "bg-muted-foreground/50"
                        }`}
                        aria-hidden="true"
                      />
                      <span>{node.host}</span>
                      <span className="opacity-65">({node.city})</span>
                    </button>
                  );
                })}
              </div>

              <div className="relative z-10 -mx-2 sm:-mx-4 translate-y-2">
                <DottedMap
                  markers={mapMarkers}
                  markerColor="#A78BFF"
                  pulse={false}
                  height={40}
                  dotRadius={0.21}
                  className="text-zinc-300 dark:text-zinc-800"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
