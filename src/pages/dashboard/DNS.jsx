import { useState } from "react";
import { Server, ExternalLink, ArrowUpRight, Layers, Check, Copy } from "lucide-react";
import { ConsoleHeader } from "@/components/dashboard/ConsoleHeader";

const delegationSteps = [
  {
    step: "1",
    title: "Register your subdomain",
    desc: "Claim an available name on .indevs.in, .sryze.cc, .ryzedns.org, .nx.kg, or .ryzn.pro.",
  },
  {
    step: "2",
    title: "Choose authoritative nameservers",
    desc: "Keep Stackryze DNS (dns.stackryze.com) or enter 2–6 nameservers from any external DNS provider.",
  },
  {
    step: "3",
    title: "Automatic NS delegation",
    desc: "Your NS records publish immediately in PowerDNS so resolver queries route directly to your provider.",
  },
  {
    step: "4",
    title: "Manage records anywhere",
    desc: "Create A, AAAA, CNAME, TXT, and MX records in your chosen DNS provider with zero lock-in.",
  },
];

const NODES = [
  { id: "NS1", host: "ns1.stackryze.com", region: "New York" },
  { id: "NS2", host: "ns2.stackryze.com", region: "Frankfurt" },
  { id: "NS3", host: "ns3.stackryze.com", region: "Hyderabad" },
];

export default function DNSRecords() {
  const [copiedHost, setCopiedHost] = useState(null);

  const handleCopy = (host) => {
    navigator.clipboard.writeText(host);
    setCopiedHost(host);
    setTimeout(() => setCopiedHost(null), 1400);
  };

  return (
    <div className="space-y-6 w-full">
      <ConsoleHeader
        title="DNS Management"
        description="Use Stackryze Managed DNS or delegate nameservers to any external DNS provider."
        actions={
          <a
            href="https://dns.stackryze.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
          >
            <span>Open StackNS</span>
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        }
      />

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-secondary border border-border flex items-center justify-center shrink-0">
              <Server className="w-4 h-4 text-foreground" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Stackryze Managed DNS
              </h2>
              <p className="text-xs text-muted-foreground">
                Manage A, AAAA, CNAME, MX, TXT, and CAA records on{" "}
                <span className="font-mono text-foreground">dns.stackryze.com</span>
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-500 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            PowerDNS
          </span>
        </div>

        <div className="divide-y divide-border font-mono text-xs">
          {NODES.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => handleCopy(n.host)}
              className="w-full px-6 py-3.5 flex items-center justify-between gap-4 hover:bg-secondary/35 transition-colors text-left"
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="text-muted-foreground w-8 shrink-0">{n.id}</span>
                <span className="text-foreground truncate">{n.host}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-muted-foreground hidden sm:inline">{n.region}</span>
                {copiedHost === n.host ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Layers className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <h2 className="text-sm font-semibold text-foreground">
              Bring Your Own Nameservers
            </h2>
          </div>
          <a
            href="https://docs.stackryze.com/docs/domains/nameserver-delegation"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>Docs</span>
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>

        <div className="divide-y divide-border">
          {delegationSteps.map((item) => (
            <div key={item.step} className="px-6 py-4 flex items-start gap-4">
              <span className="w-6 h-6 rounded-md bg-secondary border border-border font-mono text-xs font-medium text-foreground flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                {item.step}
              </span>
              <div className="space-y-0.5">
                <h3 className="text-sm font-medium text-foreground">{item.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
