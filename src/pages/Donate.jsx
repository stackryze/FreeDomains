import { useState } from "react";
import {
  Heart,
  Github,
  Star,
  Share2,
  Bug,
  Code2,
  Check,
  ArrowUpRight,
  Copy,
  Coffee,
  Zap,
  Globe,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer-section";
import { useToast } from "@/hooks/use-toast";

const tiers = [
  {
    name: "Community Supporter",
    icon: Coffee,
    badge: "Supporter",
    monthlyPrice: 3,
    oneTimePrice: 3,
    description: "Helps cover monthly server hosting and operational upkeep.",
    perks: [
      "GitHub Sponsor badge on your profile",
      "Supporter role in the Discord community",
      "Listed in official README Sponsors",
    ],
  },
  {
    name: "Infrastructure Backer",
    icon: Zap,
    badge: "Recommended",
    highlight: true,
    monthlyPrice: 10,
    oneTimePrice: 15,
    description:
      "Funds authoritative PowerDNS nodes and annual registry renewals.",
    perks: [
      "Everything in Community Supporter",
      "Vote on upcoming domain extensions",
      "Direct feedback channel with maintainers",
      "Featured on GitHub README Sponsors",
    ],
  },
  {
    name: "Ecosystem Champion",
    icon: Globe,
    badge: "Teams & Leaders",
    monthlyPrice: 25,
    oneTimePrice: 50,
    description:
      "For teams and organizations backing open developer infrastructure.",
    perks: [
      "Everything in Infrastructure Backer",
      "Company or project logo featured on site",
      "Priority Discord support assistance",
      "Dedicated sponsor credit on Stackryze channels",
    ],
  },
];

const ways = [
  {
    icon: Star,
    label: "Star on GitHub",
    desc: "Help other builders discover Stackryze FreeDomains.",
    action: "Star repo",
    href: "https://github.com/stackryze/FreeDomains",
  },
  {
    icon: Share2,
    label: "Share with Builders",
    desc: "Tell friends and communities about free developer subdomains.",
    action: "Copy link",
    isShare: true,
  },
  {
    icon: Bug,
    label: "Report Issues",
    desc: "Flag bugs in DNS propagation or dashboard workflows.",
    action: "Open issue",
    href: "https://github.com/stackryze/FreeDomains/issues",
  },
  {
    icon: Code2,
    label: "Contribute Code",
    desc: "Improve the registry API, portal, or documentation.",
    action: "Submit PR",
    href: "https://github.com/stackryze/FreeDomains/pulls",
  },
];

const faqs = [
  {
    q: "Does GitHub take a cut of my sponsorship?",
    a: "No. GitHub Sponsors charges 0% platform and payment processing fees for personal accounts, so 100% of your pledge supports the project.",
  },
  {
    q: "Can I cancel or change my monthly pledge anytime?",
    a: "Yes. You can upgrade, downgrade, or cancel directly from your GitHub Sponsors settings at any time.",
  },
  {
    q: "Can my company or organization sponsor Stackryze?",
    a: "Yes. GitHub Sponsors supports corporate invoicing, VAT IDs, and organization billing. Sponsors can also feature their logo across the repository and site.",
  },
  {
    q: "Where do contributions go?",
    a: "Every contribution directly funds authoritative PowerDNS infrastructure, root domain renewals, and abuse prevention systems.",
  },
];

export function Donate() {
  const { toast } = useToast();
  const [frequency, setFrequency] = useState("recurring");
  const [customAmount, setCustomAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleCopyShare = () => {
    navigator.clipboard.writeText("https://domain.stackryze.com");
    setCopied(true);
    toast({
      title: "Link Copied",
      description: "Thanks for sharing Stackryze Domains with other builders.",
      variant: "success",
    });
    setTimeout(() => setCopied(false), 2200);
  };

  const getSponsorUrl = (amount) => {
    const amt = amount || (frequency === "recurring" ? 5 : 10);
    return `https://github.com/sponsors/sudheerbhuvana?frequency=${frequency}&amount=${amt}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      <Header />

      <main className="flex-1 w-full px-6 md:px-12 lg:px-16 pt-[calc(4.5rem+var(--incident-height,0px))] sm:pt-[calc(5rem+var(--incident-height,0px))] pb-16">
        <div className="max-w-[1600px] mx-auto border-x border-b border-border bg-background">
          {/* Band 1: Architectural Hero + Frequency Toggle */}
          <section className="relative bg-grid px-6 sm:px-12 lg:px-16 py-16 sm:py-24 border-t border-border overflow-hidden">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 right-0 w-[460px] h-64 bg-[radial-gradient(ellipse_at_top_right,rgba(124,92,255,0.14),transparent_70%)]"
            />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <div className="max-w-2xl space-y-4">
                <p className="font-mono text-xs text-muted-foreground">
                  Open Source Sustainability
                </p>
                <h1 className="text-3xl sm:text-5xl font-semibold tracking-[-0.04em] leading-[1.08] text-foreground text-balance">
                  Keeping free domains{" "}
                  <span className="text-muted-foreground font-medium">
                    free forever.
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  GitHub Sponsors charges 0% fees—100% of every pledge funds PowerDNS nodes and registry renewals.
                </p>
              </div>

              <div
                className="inline-flex items-center p-1 rounded-full bg-secondary/70 border border-border self-start lg:self-end shrink-0"
                role="tablist"
                aria-label="Sponsorship frequency"
              >
                {[
                  { id: "recurring", label: "Monthly" },
                  { id: "one-time", label: "One-Time" },
                ].map((opt) => {
                  const active = frequency === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setFrequency(opt.id)}
                      className={`px-5 py-2 rounded-full text-xs font-medium ${
                        active
                          ? "bg-foreground text-background"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Band 2: 3-Column Flush Hairline Sponsorship Tiers */}
          <section className="grid grid-cols-1 lg:grid-cols-3 border-t border-border divide-y lg:divide-y-0 lg:divide-x divide-border">
            {tiers.map((tier) => {
              const price =
                frequency === "recurring" ? tier.monthlyPrice : tier.oneTimePrice;
              const periodLabel = frequency === "recurring" ? "/ mo" : "one-time";
              const sponsorUrl = `https://github.com/sponsors/sudheerbhuvana?frequency=${frequency}&amount=${price}`;
              const IconComp = tier.icon;

              return (
                <div
                  key={tier.name}
                  className="relative p-6 sm:p-10 flex flex-col justify-between gap-8 bg-background overflow-hidden"
                >
                  {tier.highlight && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-[90%] h-48 bg-[radial-gradient(ellipse_at_top,rgba(124,92,255,0.16),transparent_70%)]"
                    />
                  )}

                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-between gap-3">
                      <IconComp className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                      <span
                        className={`font-mono text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                          tier.highlight
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : "bg-secondary text-muted-foreground border-border"
                        }`}
                      >
                        {tier.badge}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h2 className="text-lg font-semibold tracking-tight text-foreground">
                        {tier.name}
                      </h2>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {tier.description}
                      </p>
                    </div>

                    <div className="pt-2 pb-5 border-b border-border flex items-baseline gap-2">
                      <span className="font-mono text-4xl font-semibold tracking-[-0.03em] tabular-nums text-foreground">
                        ${price}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {periodLabel}
                      </span>
                    </div>

                    <ul className="space-y-2.5">
                      {tier.perks.map((perk) => (
                        <li
                          key={perk}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground"
                        >
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href={sponsorUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={`relative z-10 inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-full text-sm font-medium ${
                      tier.highlight
                        ? "bg-foreground text-background hover:bg-foreground/90"
                        : "border border-border bg-card text-foreground hover:bg-secondary"
                    }`}
                  >
                    <Github className="w-4 h-4" aria-hidden="true" />
                    <span>Sponsor ${price}</span>
                    <Heart className="w-3.5 h-3.5 text-rose-500" aria-hidden="true" />
                  </a>
                </div>
              );
            })}
          </section>

          {/* Custom Amount Flush Strip */}
          <section className="border-t border-border px-6 sm:px-10 py-5 bg-secondary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-foreground">Custom Pledge</p>
              <p className="text-xs text-muted-foreground">
                Pick any custom amount directly on GitHub Sponsors.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="relative w-32">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-mono">
                  $
                </span>
                <input
                  type="number"
                  min="1"
                  placeholder="50"
                  aria-label="Custom pledge amount in USD"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full h-9 pl-7 pr-3 rounded-full border border-border bg-card text-xs font-mono text-foreground focus:outline-none focus:border-foreground/40"
                />
              </div>
              <a
                href={getSponsorUrl(customAmount)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 h-9 px-5 rounded-full bg-foreground text-background text-xs font-medium hover:bg-foreground/90 shrink-0"
              >
                <span>Sponsor</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </section>

          {/* Band 3: 4-Column Other Ways to Help */}
          <section className="border-t border-border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border">
            {ways.map((w) => {
              const IconComp = w.icon;
              const inner = (
                <>
                  <div className="space-y-3">
                    <IconComp className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-foreground">{w.label}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{w.desc}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs text-foreground pt-4">
                    <span>{w.isShare && copied ? "Copied" : w.action}</span>
                    {w.isShare ? (
                      copied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
                      )
                    ) : (
                      <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
                    )}
                  </span>
                </>
              );

              return w.isShare ? (
                <button
                  key={w.label}
                  type="button"
                  onClick={handleCopyShare}
                  className="p-6 sm:p-8 text-left flex flex-col justify-between hover:bg-secondary/35"
                >
                  {inner}
                </button>
              ) : (
                <a
                  key={w.label}
                  href={w.href}
                  target="_blank"
                  rel="noreferrer"
                  className="p-6 sm:p-8 flex flex-col justify-between hover:bg-secondary/35"
                >
                  {inner}
                </a>
              );
            })}
          </section>

          {/* Band 4: Sponsorship FAQ Split */}
          <section className="border-t border-border grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border">
            <div className="lg:col-span-4 p-6 sm:p-10 space-y-2">
              <p className="font-mono text-xs text-muted-foreground">FAQ</p>
              <h2 className="text-xl sm:text-2xl font-semibold tracking-[-0.03em] text-foreground">
                Sponsorship details
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Common questions about how community pledges sustain Stackryze Domains.
              </p>
            </div>

            <div className="lg:col-span-8 divide-y divide-border">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={faq.q}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      className="w-full px-6 sm:px-8 py-4 text-left flex items-center justify-between gap-4 hover:bg-secondary/30"
                    >
                      <span className="text-sm font-medium text-foreground">{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden="true" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden="true" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-6 sm:px-8 pb-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
