import { useState } from 'react';
import {
    Mail, Shield, Scale, LifeBuoy, AlertTriangle, MessageCircle,
    FileText, ChevronDown, ChevronUp, ExternalLink, Book, Zap,
    Globe, Settings, GitBranch, Search, HelpCircle
} from 'lucide-react';

const DOCS_BASE = "https://domain-docs.stackryze.com";

const docLinks = [
    {
        icon: Zap,
        title: "Getting Started",
        desc: "Register your first domain in under a minute",
        href: `${DOCS_BASE}/getting-started`,
    },
    {
        icon: Globe,
        title: "Managing Domains",
        desc: "View, renew, suspend, and delete domains",
        href: `${DOCS_BASE}/managing-domains`,
    },
    {
        icon: Settings,
        title: "DNS Configuration",
        desc: "Set up A, CNAME, TXT records & NS delegation",
        href: `${DOCS_BASE}/dns-configuration`,
    },
    {
        icon: GitBranch,
        title: "GitHub KYC / Verification",
        desc: "Unlock higher limits and .sryze.cc, .ryzedns.org, .nx.kg & .ryzn.pro domains",
        href: `${DOCS_BASE}/github-kyc`,
    },
    {
        icon: Search,
        title: "Troubleshooting",
        desc: "DNS propagation, login issues, and common errors",
        href: `${DOCS_BASE}/troubleshooting`,
    },
    {
        icon: Book,
        title: "API Reference",
        desc: "Full REST API docs for automating domain management",
        href: `${DOCS_BASE}/api`,
    },
];

const faqs = [
    {
        q: "How do I register a free subdomain?",
        a: "Go to Dashboard → Register Domain. Enter your desired name, choose your suffix (.indevs.in, .sryze.cc, .ryzedns.org, .nx.kg, or .ryzn.pro), and click Register. Activation is instant."
    },
    {
        q: "What is KYC / GitHub verification?",
        a: "Verifying your GitHub account lets us confirm your identity. It unlocks the .sryze.cc, .ryzedns.org, .nx.kg, and .ryzn.pro domain suffixes and higher domain limits. Your data is never stored beyond your profile."
    },
    {
        q: "How many domains can I register?",
        a: "Users get 1 free .indevs.in domain by default. Starring our GitHub repo and verifying unlocks 1 free .sryze.cc domain, 1 free .ryzedns.org domain, 1 free .nx.kg domain, and 1 free .ryzn.pro domain. Further limits can be increased by contacting support via Discord or email and stating your reason."
    },
    {
        q: "Do domains expire?",
        a: "Domains are renewed automatically as long as your account is active. You'll receive a warning if a domain is approaching expiry."
    },
    {
        q: "How do I set up DNS records?",
        a: "Navigate to Dashboard → DNS Configuration. From there you can add A, CNAME, TXT, and other record types, or delegate NS to your own nameservers."
    },
    {
        q: "Can I delete a domain?",
        a: "Yes. Go to My Domains → select a domain → Delete. Deletion is permanent and the name becomes available to others immediately."
    },
];

function FAQ({ q, a }) {
    const [open, setOpen] = useState(false);
    return (
        <button
            type="button"
            onClick={() => setOpen(o => !o)}
            className="w-full text-left bg-card/70 backdrop-blur-md border border-border rounded-2xl p-5 hover:bg-muted dark:hover:bg-secondary transition-all group shadow-sm"
        >
            <div className="flex items-center justify-between gap-4">
                <span className="font-bold text-foreground text-base">{q}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${open ? 'bg-foreground text-background' : 'bg-secondary dark:bg-secondary text-foreground group-hover:bg-accent dark:group-hover:bg-background/20'}`}>
                    {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
            </div>
            {open && (
                <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm font-medium text-foreground leading-relaxed">
                        {a}
                    </p>
                </div>
            )}
        </button>
    );
}

const contacts = [
    { icon: LifeBuoy,      title: "General Support",   email: "support@stackryze.com",     desc: "Account issues, registration, billing" },
    { icon: AlertTriangle, title: "Report Abuse",      email: "reportabuse@stackryze.com", desc: "Spam, phishing, policy violations" },
    { icon: Shield,        title: "Security",          email: "security@stackryze.com",    desc: "Vulnerabilities, responsible disclosure" },
    { icon: Scale,         title: "Privacy Inquiries", email: "privacy@stackryze.com",     desc: "Data requests, GDPR, CCPA" },
    { icon: FileText,      title: "Legal Notices",     email: "legal@stackryze.com",       desc: "DMCA, legal correspondence" },
];

export default function Help() {
    return (
        <div className="max-w-4xl space-y-10">

            {/* Header */}
            <div>
                <p className="text-sm font-bold uppercase tracking-widest text-signal mb-2 flex items-center gap-2">
                    <LifeBuoy className="w-4 h-4" />
                    Support
                </p>
                <h1 className="font-display text-3xl md:text-4xl font-medium text-foreground leading-tight mb-3">Help & Contact</h1>
                <p className="text-base font-medium text-foreground leading-relaxed max-w-2xl">
                    Find answers below, browse the comprehensive documentation, or reach out to our team directly.
                </p>
            </div>

            {/* Discord CTA */}
            <div className="bg-card/70 backdrop-blur-xl border border-border rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-signal/5 to-transparent pointer-events-none"></div>
                <div className="flex items-start gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-[#5865F2]/10 border border-[#5865F2]/20 flex items-center justify-center flex-shrink-0 shadow-inner">
                        <MessageCircle className="w-6 h-6 text-[#5865F2] fill-[#5865F2]/20" />
                    </div>
                    <div>
                        <p className="font-extrabold text-foreground text-xl mb-1">Join our Discord</p>
                        <p className="text-sm font-medium text-foreground opacity-80 leading-relaxed max-w-sm">Get real-time help from the community and the Stackryze core team.</p>
                    </div>
                </div>
                <a
                    href="https://discord.gg/wr7s97cfM7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#5865F2] text-white font-bold text-sm rounded-xl hover:scale-[1.02] shadow-[0_4px_14px_0_rgba(88,101,242,0.39)] hover:shadow-[0_6px_20px_rgba(88,101,242,0.23)] transition-all duration-300 whitespace-nowrap flex-shrink-0 w-full md:w-auto relative z-10"
                >
                    <MessageCircle className="w-4 h-4 fill-white/20" />
                    Open Discord
                    <ExternalLink className="w-4 h-4" />
                </a>
            </div>

            {/* Documentation */}
            <div className="bg-card/70 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display text-xl font-medium text-foreground flex items-center gap-2">
                        <Book className="w-5 h-5 text-signal" />
                        Documentation
                    </h2>
                    <a
                        href={DOCS_BASE}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-foreground text-background font-bold text-xs rounded-lg hover:scale-[1.02] transition-transform shadow-sm"
                    >
                        View all docs <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {docLinks.map(({ icon: Icon, title, desc, href }) => (
                        <a
                            key={href}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-5 flex flex-col gap-3 hover:border-border dark:hover:border-foreground/25 hover:scale-[1.02] transition-all group shadow-sm"
                        >
                            <div className="w-10 h-10 rounded-xl bg-secondary dark:bg-secondary flex items-center justify-center flex-shrink-0">
                                <Icon className="w-5 h-5 text-foreground" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="font-bold text-base text-foreground flex items-center gap-1">
                                    {title}
                                    <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </p>
                                <p className="text-sm font-medium text-foreground opacity-80 mt-1 leading-relaxed">{desc}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>

            {/* FAQ */}
            <div className="pt-4">
                <h2 className="font-display text-xl font-medium text-foreground mb-6 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-signal" />
                    Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                    {faqs.map((f, i) => <FAQ key={i} q={f.q} a={f.a} />)}
                </div>
            </div>

            {/* Contact */}
            <div className="pt-4">
                <h2 className="font-display text-xl font-medium text-foreground mb-6 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-signal" />
                    Email Support
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {contacts.map(({ icon: Icon, title, email, desc }) => (
                        <a
                            key={email}
                            href={`mailto:${email}`}
                            className="bg-card/70 backdrop-blur-md border border-border rounded-2xl p-5 flex flex-col gap-3 hover:bg-muted dark:hover:bg-secondary hover:border-border dark:hover:border-foreground/25 transition-all group shadow-sm"
                        >
                            <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center flex-shrink-0">
                                <Icon className="w-5 h-5 text-background" />
                            </div>
                            <div className="min-w-0">
                                <p className="font-bold text-base text-foreground">{title}</p>
                                <p className="text-sm font-medium text-foreground opacity-80 mt-1">{desc}</p>
                                <p className="text-xs font-mono font-bold text-foreground mt-3 px-2 py-1 bg-secondary dark:bg-black/40 rounded border border-border/80 dark:border-border/60 inline-block group-hover:border-border dark:group-hover:border-white/20 transition-colors">{email}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>

        </div>
    );
}
