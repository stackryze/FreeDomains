import { Globe, Zap, Users, Code, ShieldCheck, Activity } from "lucide-react";
import { chipColor } from "@/lib/chips";

export function FeatureCards() {
  const features = [
    {
      icon: Globe,
      title: "Free Subdomains",
      description: "Claim up to 5 free subdomains on premium TLDs like .indevs.in, .sryze.cc, and .ryzedns.org with zero subscription fees.",
      badge: "5 Max / User"
    },
    {
      icon: Code,
      title: "Full DNS Control",
      description: "Manage A, AAAA, CNAME, MX, TXT, and SRV records with instant propagation and built-in type validation.",
      badge: "Instant Propagation"
    },
    {
      icon: Zap,
      title: "Developer REST API",
      description: "Automate domain registration, DNS record updates, and webhook callbacks with our developer-friendly API.",
      badge: "REST API"
    },
    {
      icon: ShieldCheck,
      title: "Open Source & Free",
      description: "Transparent, community-driven software hosted on GitHub. Free for developers, students, and open web projects.",
      badge: "100% Free"
    },
    {
      icon: Users,
      title: "Community Powered",
      description: "Join thousands of developers and creators hosting projects on our shared, resilient namespace.",
      badge: "Global Network"
    },
    {
      icon: Activity,
      title: "WHOIS & Resolution Check",
      description: "Verify domain resolution, propagation status, and public record lookup in real time across global resolvers.",
      badge: "Live Status"
    }
  ];

  return (
    <section id="features" className="w-full py-16 sm:py-24 bg-transparent text-foreground">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="mb-16 max-w-2xl">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
            The price of admission <span className="text-gradient-signal">is zero.</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
            Everything you need to claim your name on the web and manage DNS records with zero hidden limits or subscriptions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {features.map((f, idx) => (
            <article
              key={idx}
              className="flex flex-col justify-between rounded-2xl bg-card p-8 shadow-border group"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div
                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-secondary border border-border transition-transform duration-150 group-hover:scale-105"
                    style={{ color: chipColor(idx) }}
                  >
                    <f.icon className="w-6 h-6" strokeWidth={1.75} />
                  </div>
                  <span className="font-mono text-[11px] font-medium text-muted-foreground bg-secondary border border-border px-2.5 py-1 rounded-full">
                    {f.badge}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-2 tracking-tight">
                  {f.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {f.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
