import { useState } from "react";
import { 
    Heart, 
    Github, 
    Star, 
    Share2, 
    Bug, 
    Code2, 
    Sparkles, 
    Check, 
    ArrowUpRight, 
    Copy, 
    Coffee, 
    Zap, 
    Globe, 
    ChevronDown, 
    DollarSign
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
            "GitHub Sponsor badge on your GitHub profile",
            "Supporter role in the Discord community",
            "Listed on official GitHub README Sponsors",
            "Our sincere gratitude as an open-source backer"
        ]
    },
    {
        name: "Infrastructure Backer",
        icon: Zap,
        badge: "Recommended",
        highlight: true,
        monthlyPrice: 10,
        oneTimePrice: 15,
        description: "Directly funds authoritative DNS server hosting and domain registry renewal fees.",
        perks: [
            "Everything in Community Supporter",
            "Early announcements & voting on new domain extensions",
            "Direct feedback channel with core maintainers",
            "Listed prominently on GitHub README Sponsors"
        ]
    },
    {
        name: "Ecosystem Champion",
        icon: Globe,
        badge: "For Teams & Leaders",
        monthlyPrice: 25,
        oneTimePrice: 50,
        description: "For teams, companies, and creators who rely on free domain infrastructure.",
        perks: [
            "Everything in Infrastructure Backer",
            "Company or Project logo featured on README & website",
            "Priority support assistance via Discord",
            "Dedicated sponsor shoutout on Stackryze channels"
        ]
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
        label: "Report Bugs & Feedback",
        desc: "Found an issue with DNS propagation or registration? Let us know.",
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

const faqs = [
    {
        q: "Does GitHub take a cut of my sponsorship?",
        a: "No. GitHub Sponsors charges 0% platform and payment processing fees for individual accounts. 100% of your pledge goes directly into supporting the project."
    },
    {
        q: "Can I cancel or change my monthly pledge anytime?",
        a: "Yes. You have full control from your GitHub Sponsors dashboard and can upgrade, downgrade, or cancel your pledge with a single click whenever you wish."
    },
    {
        q: "Can my company or organization sponsor Stackryze?",
        a: "Yes! GitHub Sponsors supports corporate invoicing, VAT IDs, credit cards, and organization billing. Sponsoring organizations can have their logo and link featured on our website and GitHub repository."
    },
    {
        q: "Where does the money go?",
        a: "100% of contributions go directly toward server hosting, domain registry renewals, and keeping FreeDomains fast, secure, and free for everyone."
    }
];

export function Donate() {
    const { toast } = useToast();
    const [frequency, setFrequency] = useState("recurring"); // "recurring" | "one-time"
    const [customAmount, setCustomAmount] = useState("");
    const [copied, setCopied] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);

    const handleCopyShare = () => {
        navigator.clipboard.writeText("https://domains.stackryze.com");
        setCopied(true);
        toast({
            title: "Link Copied!",
            description: "Thanks for sharing Stackryze Domains with other builders.",
        });
        setTimeout(() => setCopied(false), 2500);
    };

    const getSponsorUrl = (amount) => {
        const amt = amount || (frequency === "recurring" ? 5 : 10);
        return `https://github.com/sponsors/sudheerbhuvana?frequency=${frequency}&amount=${amt}`;
    };

    return (
        <div className="min-h-screen bg-transparent font-sans flex flex-col relative selection:bg-foreground selection:text-background">
            <Header />

            <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 pt-[calc(6rem+var(--incident-height,0px))] pb-24">
                
                {/* ── Hero Header ── */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/80 backdrop-blur-md px-3.5 py-1 text-xs font-mono tracking-wider uppercase">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-signal opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
                        </span>
                        <span>Open Source Sustainability</span>
                    </div>

                    <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-foreground leading-[1.15]">
                        Keeping free domains <span className="italic text-gradient-signal font-normal">free forever.</span>
                    </h1>

                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                        Stackryze FreeDomains provides free developer subdomains and global DNS with zero ads, zero hidden fees, and zero vendor lock-in. Powered by open source passion and funded by the community.
                    </p>
                </div>

                {/* ── Sponsorship Tiers Section ── */}
                <div className="mb-24">
                    <div className="text-center max-w-xl mx-auto mb-8 space-y-3">
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                            Sponsor on GitHub
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            GitHub Sponsors charges 0% fees. 100% of your pledge directly supports project infrastructure.
                        </p>

                        {/* Frequency Switcher */}
                        <div className="inline-flex items-center p-1 rounded-full bg-secondary/80 border border-border mt-3">
                            <button
                                onClick={() => setFrequency("recurring")}
                                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                                    frequency === "recurring"
                                        ? "bg-foreground text-background shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                Monthly Supporter
                            </button>
                            <button
                                onClick={() => setFrequency("one-time")}
                                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                                    frequency === "one-time"
                                        ? "bg-foreground text-background shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                One-Time Tip
                            </button>
                        </div>
                    </div>

                    {/* 3 Tier Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch mb-8">
                        {tiers.map((tier, idx) => {
                            const price = frequency === "recurring" ? tier.monthlyPrice : tier.oneTimePrice;
                            const periodLabel = frequency === "recurring" ? "per month" : "one-time";
                            const sponsorUrl = `https://github.com/sponsors/sudheerbhuvana?frequency=${frequency}&amount=${price}`;
                            const IconComponent = tier.icon;

                            return (
                                <div
                                    key={idx}
                                    className={`relative rounded-2xl border flex flex-col justify-between p-7 transition-all duration-300 ${
                                        tier.highlight
                                            ? "bg-card border-signal/40 shadow-[0_0_35px_rgba(56,182,255,0.08)] ring-1 ring-signal/20"
                                            : "bg-card/70 backdrop-blur-md border-border hover:border-foreground/25"
                                    }`}
                                >
                                    {tier.highlight && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-signal text-signal-foreground shadow-sm">
                                            {tier.badge}
                                        </div>
                                    )}

                                    <div>
                                        {/* Card Header */}
                                        <div className="flex items-start justify-between gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-foreground shrink-0">
                                                <IconComponent className="w-5 h-5 text-signal" />
                                            </div>
                                            {!tier.highlight && (
                                                <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground">
                                                    {tier.badge}
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="font-display text-2xl font-bold text-foreground">{tier.name}</h3>
                                        <p className="text-xs text-muted-foreground mt-1 min-h-[36px] leading-relaxed">{tier.description}</p>

                                        {/* Price block */}
                                        <div className="flex items-baseline gap-1.5 my-6 pb-6 border-b border-border">
                                            <span className="font-mono text-4xl font-bold text-foreground tracking-tight">${price}</span>
                                            <span className="text-xs text-muted-foreground font-mono">/ {periodLabel}</span>
                                        </div>

                                        {/* Perks list */}
                                        <ul className="space-y-3 mb-8">
                                            {tier.perks.map((perk, i) => (
                                                <li key={i} className="flex items-start gap-2.5 text-xs text-foreground/85 leading-relaxed">
                                                    <Check className="w-4 h-4 text-signal shrink-0 mt-0.5" />
                                                    <span>{perk}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* CTA Button */}
                                    <a
                                        href={sponsorUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className={`group flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm active:scale-[0.98] ${
                                            tier.highlight
                                                ? "bg-foreground text-background hover:bg-signal hover:text-signal-foreground"
                                                : "bg-secondary text-foreground hover:bg-foreground hover:text-background border border-border"
                                        }`}
                                    >
                                        <Github className="w-4 h-4" />
                                        <span>Sponsor ${price}</span>
                                        <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 group-hover:scale-110 transition-transform" />
                                    </a>
                                </div>
                            );
                        })}
                    </div>

                    {/* Custom Amount Bar */}
                    <div className="max-w-2xl mx-auto bg-card/60 backdrop-blur-md border border-border rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="w-9 h-9 rounded-xl bg-secondary border border-border flex items-center justify-center text-signal shrink-0">
                                <DollarSign className="w-4 h-4" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-semibold text-foreground">Custom Amount</p>
                                <p className="text-xs text-muted-foreground">Pick any amount on GitHub Sponsors</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <div className="relative flex-1 sm:w-32">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-mono">$</span>
                                <input
                                    type="number"
                                    min="1"
                                    placeholder="50"
                                    value={customAmount}
                                    onChange={(e) => setCustomAmount(e.target.value)}
                                    className="w-full pl-6 pr-3 py-2 bg-secondary border border-border rounded-xl text-xs font-mono text-foreground focus:outline-none focus:border-signal"
                                />
                            </div>
                            <a
                                href={getSponsorUrl(customAmount)}
                                target="_blank"
                                rel="noreferrer"
                                className="px-4 py-2 rounded-xl text-xs font-semibold bg-foreground text-background hover:bg-signal hover:text-signal-foreground transition-all duration-200 shrink-0 shadow-sm flex items-center gap-1.5"
                            >
                                <span>Sponsor</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* ── Non-Financial Ways to Support ── */}
                <div className="mb-24">
                    <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                            Other Ways to Help
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Not in a position to donate? You can still make a huge impact on our open-source platform.
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
                                        <span>{w.isShare && copied ? "Link Copied!" : w.action}</span>
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

                {/* ── FAQ Section ── */}
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-8 space-y-2">
                        <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            Common questions about sponsoring Stackryze FreeDomains.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {faqs.map((faq, idx) => {
                            const isOpen = openFaq === idx;
                            return (
                                <div
                                    key={idx}
                                    className="bg-card/70 backdrop-blur-md border border-border rounded-xl overflow-hidden transition-colors"
                                >
                                    <button
                                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                                        className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-semibold text-sm text-foreground hover:text-signal transition-colors"
                                    >
                                        <span>{faq.q}</span>
                                        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`} />
                                    </button>
                                    {isOpen && (
                                        <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
}
