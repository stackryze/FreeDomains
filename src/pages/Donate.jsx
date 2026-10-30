import { useState } from "react";
import { Heart, Github, Star, Share2, Bug, Code2, Server, ShieldCheck, Sparkles, Check, ArrowUpRight, Copy } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer-section";
import { useToast } from "@/hooks/use-toast";

const tiers = [
    {
        name: "Individual Supporter",
        price: "$2",
        period: "one-time or monthly",
        description: "Helps cover the monthly cost of DNS queries and operational overhead.",
        popular: false,
        perks: [
            "GitHub Sponsor badge on your profile",
            "Discord Community Supporter role",
            "Our eternal gratitude"
        ],
        href: "https://github.com/sponsors/sudheerbhuvana?frequency=one-time&amount=2"
    },
    {
        name: "Infrastructure Backer",
        price: "$5",
        period: "per month",
        description: "Directly funds authoritative DNS server hosting and TLD registry renewal fees.",
        popular: true,
        perks: [
            "Everything in Individual",
            "Name listed on GitHub README Sponsors",
            "Early announcements for new domain extensions",
            "Direct feedback channel with maintainers"
        ],
        href: "https://github.com/sponsors/sudheerbhuvana?frequency=recurring&amount=5"
    },
    {
        name: "Ecosystem Champion",
        price: "$25",
        period: "per month",
        description: "For teams, companies, or developers who rely heavily on free domain infrastructure.",
        popular: false,
        perks: [
            "Everything in Infrastructure Backer",
            "Company / Project logo in README & website",
            "Priority support assistance via Discord"
        ],
        href: "https://github.com/sponsors/sudheerbhuvana?frequency=recurring&amount=25"
    }
];

const ways = [
    {
        icon: Star,
        label: "Star on GitHub",
        desc: "Helps Stackryze get discovered by other developers across the ecosystem.",
        action: "Star repo",
        href: "https://github.com/stackryze/FreeDomains"
    },
    {
        icon: Share2,
        label: "Share with Builders",
        desc: "Tell friends and communities about free subdomains for their next project.",
        action: "Copy link",
        isShare: true
    },
    {
        icon: Bug,
        label: "Report Bugs",
        desc: "Found an issue with DNS propagation or registration? Open a ticket.",
        action: "Open issue",
        href: "https://github.com/stackryze/FreeDomains/issues"
    },
    {
        icon: Code2,
        label: "Contribute Code",
        desc: "Help improve the registry backend, admin portals, or docs via pull requests.",
        action: "Submit PR",
        href: "https://github.com/stackryze/FreeDomains/pulls"
    }
];

export function Donate() {
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);

    const handleCopyShare = () => {
        navigator.clipboard.writeText("https://domains.stackryze.com");
        setCopied(true);
        toast({
            title: "Link Copied!",
            description: "Thanks for sharing Stackryze Domains with other builders.",
        });
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <div className="min-h-screen bg-transparent font-sans flex flex-col relative selection:bg-foreground selection:text-background">
            <Header />

            <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 pt-[calc(6rem+var(--incident-height,0px))] pb-24">
                
                {/* Hero Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/80 backdrop-blur-md px-3.5 py-1 text-xs font-mono tracking-wider uppercase">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-signal opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
                        </span>
                        <span>Open Source Sustainability</span>
                    </div>

                    <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-foreground leading-tight">
                        Fueling free infrastructure for <span className="text-gradient-signal">builders.</span>
                    </h1>

                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                        Stackryze FreeDomains is independently maintained and funded out-of-pocket by a student. We are 100% community-driven with zero venture capital, zero advertising, and zero paywalls.
                    </p>
                </div>

                {/* Transparency Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
                    <div className="bg-card/70 backdrop-blur-md border border-border rounded-2xl p-6 flex items-start gap-4 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-signal/10 text-signal border border-signal/20 flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-mono text-xl font-bold text-foreground">100% Free Forever</p>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                No credit cards, trial expirations, or renewal fees for standard developers.
                            </p>
                        </div>
                    </div>

                    <div className="bg-card/70 backdrop-blur-md border border-border rounded-2xl p-6 flex items-start gap-4 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-sky-400/10 text-sky-400 border border-sky-400/20 flex items-center justify-center shrink-0">
                            <Server className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-mono text-xl font-bold text-foreground">Up to $150 / Month Cost</p>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                Covers distributed DNS nodes, database replication, and upstream registry fees — funded out of pocket, without sponsors.
                            </p>
                        </div>
                    </div>

                    <div className="bg-card/70 backdrop-blur-md border border-border rounded-2xl p-6 flex items-start gap-4 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-purple-400/10 text-purple-400 border border-purple-400/20 flex items-center justify-center shrink-0">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-mono text-xl font-bold text-foreground">Direct Impact</p>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                Every dollar offsets server overhead and helps onboard new top-level domain extensions.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sponsorship Tiers */}
                <div className="mb-20">
                    <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                            Sponsor on GitHub
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            GitHub Sponsors charges 0% payment processing fees. 100% of your pledge goes to infrastructure.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                        {tiers.map((tier, idx) => (
                            <div
                                key={idx}
                                className={`relative rounded-3xl border flex flex-col justify-between p-8 transition-all duration-300 ${
                                    tier.popular
                                        ? "bg-card border-signal/40 shadow-lg ring-1 ring-signal/20"
                                        : "bg-card/70 backdrop-blur-md border-border hover:border-foreground/25"
                                }`}
                            >
                                {tier.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-signal text-signal-foreground shadow-sm">
                                        Most Popular
                                    </div>
                                )}

                                <div>
                                    <div className="mb-6">
                                        <h3 className="font-display text-2xl font-bold text-foreground">{tier.name}</h3>
                                        <p className="text-xs text-muted-foreground mt-1 min-h-[32px]">{tier.description}</p>
                                    </div>

                                    <div className="flex items-baseline gap-1.5 mb-6 pb-6 border-b border-border">
                                        <span className="font-mono text-4xl font-bold text-foreground tracking-tight">{tier.price}</span>
                                        <span className="text-xs text-muted-foreground">/ {tier.period}</span>
                                    </div>

                                    <ul className="space-y-3 mb-8">
                                        {tier.perks.map((perk, i) => (
                                            <li key={i} className="flex items-start gap-2.5 text-xs text-foreground/85 leading-relaxed">
                                                <Check className="w-4 h-4 text-signal shrink-0 mt-0.5" />
                                                <span>{perk}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <a
                                    href={tier.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`group flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm active:scale-[0.98] ${
                                        tier.popular
                                            ? "bg-foreground text-background hover:bg-signal hover:text-signal-foreground"
                                            : "bg-secondary text-foreground hover:bg-foreground hover:text-background border border-border"
                                    }`}
                                >
                                    <Github className="w-4 h-4" />
                                    <span>Sponsor {tier.price}</span>
                                    <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 group-hover:scale-110 transition-transform" />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Non-Financial Ways to Support */}
                <div>
                    <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                            Other Ways to Help
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Not able to sponsor financially? You can still make a huge impact on the platform.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {ways.map((w, i) => {
                            const cardContent = (
                                <div className="flex flex-col justify-between h-full space-y-4">
                                    <div className="space-y-3">
                                        <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-foreground group-hover:border-foreground/20 transition-colors">
                                            <w.icon className="w-5 h-5 text-signal" />
                                        </div>
                                        <h3 className="font-bold text-base text-foreground">{w.label}</h3>
                                        <p className="text-xs text-muted-foreground leading-relaxed">{w.desc}</p>
                                    </div>
                                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground group-hover:text-signal transition-colors pt-2">
                                        <span>{w.isShare && copied ? "Copied!" : w.action}</span>
                                        {w.isShare ? (
                                            <Copy className="w-3.5 h-3.5" />
                                        ) : (
                                            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                        )}
                                    </div>
                                </div>
                            );

                            const cardClass = "group bg-card/70 backdrop-blur-md border border-border rounded-2xl p-6 hover:border-foreground/25 hover:bg-card transition-all duration-300 shadow-sm cursor-pointer text-left flex flex-col justify-between";

                            return w.isShare ? (
                                <button key={i} onClick={handleCopyShare} className={cardClass}>
                                    {cardContent}
                                </button>
                            ) : (
                                <a key={i} href={w.href} target="_blank" rel="noreferrer" className={cardClass}>
                                    {cardContent}
                                </a>
                            );
                        })}
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
}
