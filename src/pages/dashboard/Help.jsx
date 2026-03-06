import React, { useState } from 'react';
import {
    Mail, Shield, Scale, LifeBuoy, AlertTriangle, MessageCircle,
    FileText, ChevronDown, ChevronUp, ExternalLink, Book, Zap,
    Globe, Settings, GitBranch, Search
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
        desc: "Unlock higher limits and .sryze.cc domains",
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
        a: "Go to Dashboard → Register Domain. Enter your desired name, choose your suffix (.indevs.in or .sryze.cc), and click Register. Activation is instant."
    },
    {
        q: "What is KYC / GitHub verification?",
        a: "Verifying your GitHub account lets us confirm your identity. It unlocks the .sryze.cc domain suffix and higher domain limits. Your data is never stored beyond your profile."
    },
    {
        q: "How many domains can I register?",
        a: "Unverified users get up to 2 domains. After GitHub verification, you get up to 5. Starring our GitHub repo gives you +3 bonus slots."
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
            className="w-full text-left bg-white border-[1px] border-[#D1D5DB] rounded-xl p-4 hover:border-[#9CA3AF] transition-colors group"
        >
            <div className="flex items-center justify-between gap-4">
                <span className="font-semibold text-[#111827] text-sm">{q}</span>
                {open
                    ? <ChevronUp className="w-4 h-4 text-[#6B7280] flex-shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-[#6B7280] flex-shrink-0" />
                }
            </div>
            {open && (
                <p className="mt-3 text-sm text-[#4B5563] leading-relaxed border-t border-[#F3F4F6] pt-3">
                    {a}
                </p>
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
        <div className="max-w-3xl space-y-8">

            {/* Header */}
            <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#FF6B35] mb-1">Support</p>
                <h1 className="text-2xl md:text-3xl font-extrabold text-[#111827] leading-tight">Help & Contact</h1>
                <p className="text-sm text-[#6B7280] mt-1">Find answers below, browse the docs, or reach out directly.</p>
            </div>

            {/* Discord CTA */}
            <div className="bg-white border-[1px] border-[#D1D5DB] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <p className="font-bold text-[#111827] text-base">Join our Discord</p>
                    <p className="text-sm text-[#4B5563] mt-0.5">Get real-time help from the community and the Stackryze team.</p>
                </div>
                <a
                    href="https://discord.gg/wr7s97cfM7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold rounded-lg transition-colors text-sm whitespace-nowrap flex-shrink-0"
                >
                    <MessageCircle className="w-4 h-4" />
                    Open Discord
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
            </div>

            {/* Documentation */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-[#4B5563]">Documentation</h2>
                    <a
                        href={DOCS_BASE}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#FF6B35] hover:text-[#e55a24] transition-colors"
                    >
                        View all docs <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {docLinks.map(({ icon: Icon, title, desc, href }) => (
                        <a
                            key={href}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white border-[1px] border-[#D1D5DB] rounded-xl p-4 flex items-start gap-3 hover:border-[#9CA3AF] transition-colors group"
                        >
                            <div className="w-9 h-9 rounded-lg bg-[#F9FAFB] border-[1px] border-[#E5E7EB] flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Icon className="w-4 h-4 text-[#4B5563]" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="font-semibold text-sm text-[#111827] flex items-center gap-1">
                                    {title}
                                    <ExternalLink className="w-3 h-3 text-[#9CA3AF] opacity-0 group-hover:opacity-100 transition-opacity" />
                                </p>
                                <p className="text-xs text-[#6B7280] mt-0.5">{desc}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>

            {/* FAQ */}
            <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-[#4B5563] mb-3">Frequently Asked Questions</h2>
                <div className="space-y-2">
                    {faqs.map((f, i) => <FAQ key={i} q={f.q} a={f.a} />)}
                </div>
            </div>

            {/* Contact */}
            <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-[#4B5563] mb-3">Email Us</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {contacts.map(({ icon: Icon, title, email, desc }) => (
                        <a
                            key={email}
                            href={`mailto:${email}`}
                            className="bg-white border-[1px] border-[#D1D5DB] rounded-xl p-4 flex items-start gap-3 hover:border-[#9CA3AF] transition-colors group"
                        >
                            <div className="w-9 h-9 rounded-lg bg-[#F9FAFB] border-[1px] border-[#E5E7EB] flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Icon className="w-4 h-4 text-[#4B5563]" />
                            </div>
                            <div className="min-w-0">
                                <p className="font-semibold text-sm text-[#111827]">{title}</p>
                                <p className="text-xs text-[#6B7280] mt-0.5">{desc}</p>
                                <p className="text-xs font-mono text-[#4B5563] mt-1.5 group-hover:text-[#111827] transition-colors">{email}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>

        </div>
    );
}
