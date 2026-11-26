import { useState } from "react";
import { ConsoleHeader } from "@/components/dashboard/ConsoleHeader";
import {
  Shield,
  Scale,
  LifeBuoy,
  AlertTriangle,
  MessageCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Book,
  Zap,
  Globe,
  Settings,
  GitBranch,
  Search,
} from "lucide-react";

const DOCS_BASE = "https://docs.stackryze.com";

const docLinks = [
  {
    icon: Zap,
    title: "Getting Started",
    desc: "Sign in with SSO, verify GitHub, and claim your first subdomain",
    href: `${DOCS_BASE}/guides/domains/getting-started`,
  },
  {
    icon: Globe,
    title: "Managing Domains",
    desc: "Edit nameservers, link DNS ownership, renew, or request deletion",
    href: `${DOCS_BASE}/guides/domains/managing-domains`,
  },
  {
    icon: Settings,
    title: "Nameserver Delegation",
    desc: "Use Stackryze DNS or point NS1–NS6 to any external provider",
    href: `${DOCS_BASE}/docs/domains/nameserver-delegation`,
  },
  {
    icon: GitBranch,
    title: "Account & Verification",
    desc: "How Stackryze SSO, GitHub verification, and zone ownership work",
    href: `${DOCS_BASE}/account-verification`,
  },
  {
    icon: Search,
    title: "Troubleshooting",
    desc: "Resolve sign-in, GitHub KYC, nameserver, and renewal issues",
    href: `${DOCS_BASE}/guides/domains/troubleshooting`,
  },
  {
    icon: Book,
    title: "Stackryze DNS API",
    desc: "Manage zones and records programmatically with Bearer tokens",
    href: `${DOCS_BASE}/docs/dns/api`,
  },
];

const faqs = [
  {
    q: "How do I register a free subdomain?",
    a: "Go to Register Domain, enter your desired name, choose an extension (.indevs.in, .sryze.cc, .ryzedns.org, .nx.kg, or .ryzn.pro), accept the terms, and submit. Activation is immediate.",
  },
  {
    q: "Why is GitHub verification required?",
    a: "GitHub verification confirms account authenticity and stops automated abuse across all five domain extensions without charging fees or requiring a credit card.",
  },
  {
    q: "How many domains can I register?",
    a: "Once verified, default quotas allow 1 subdomain per extension (.indevs.in, .sryze.cc, .ryzedns.org, .nx.kg, and .ryzn.pro). Higher limits can be requested via Discord or support@stackryze.com.",
  },
  {
    q: "Do domains expire?",
    a: "Domains are registered for 1 year and renew for free within 60 days of expiry (plus a 15-day post-expiry grace period). Reminder emails are sent 60 and 10 days before expiry.",
  },
  {
    q: "How do I configure DNS records?",
    a: "Open Domains → Manage to set authoritative NS records. Use Stackryze DNS (dns.stackryze.com) or delegate to any external DNS provider.",
  },
  {
    q: "How does domain deletion work?",
    a: "Open Manage → Delete Domain to submit a deletion request. It is reviewed by an administrator and moves to Pending Deletion before permanent release.",
  },
];

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full text-left px-6 py-4 hover:bg-secondary/35 flex items-center justify-between gap-4"
      >
        <span className="font-medium text-sm text-foreground">{q}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden="true" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden="true" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-4 text-sm text-muted-foreground leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}

const contacts = [
  {
    icon: LifeBuoy,
    title: "General Support",
    email: "support@stackryze.com",
    desc: "Account access, registration, and quota requests",
  },
  {
    icon: AlertTriangle,
    title: "Report Abuse",
    email: "reportabuse@stackryze.com",
    desc: "Phishing, malware, spam, or policy violations",
  },
  {
    icon: Shield,
    title: "Security",
    email: "security@stackryze.com",
    desc: "Vulnerability reports and responsible disclosure",
  },
  {
    icon: Scale,
    title: "Privacy Inquiries",
    email: "privacy@stackryze.com",
    desc: "Data requests, GDPR, and WHOIS privacy questions",
  },
  {
    icon: FileText,
    title: "Legal Notices",
    email: "legal@stackryze.com",
    desc: "DMCA and formal legal correspondence",
  },
];

export default function Help() {
  return (
    <div className="space-y-8 w-full">
      <ConsoleHeader
        title="Help & Support"
        description="Browse documentation, review answers, or contact the Stackryze team."
        actions={
          <>
            <a
              href={DOCS_BASE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md border border-border bg-card text-foreground text-sm font-medium hover:bg-secondary"
            >
              <span>Docs</span>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
            </a>
            <a
              href="https://discord.gg/wr7s97cfM7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-foreground text-background text-sm font-medium hover:bg-foreground/90"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>Discord</span>
            </a>
          </>
        }
      />

      <div className="space-y-3">
        <h2 className="text-xs font-medium text-muted-foreground">Documentation</h2>
        <div className="rounded-lg border border-border bg-border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px overflow-hidden">
          {docLinks.map((doc) => {
            const IconComp = doc.icon;
            return (
              <a
                key={doc.href}
                href={doc.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-card hover:bg-secondary/35 p-5 flex flex-col justify-between gap-4 group"
              >
                <div className="flex items-center justify-between">
                  <IconComp className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                  <ExternalLink
                    className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">{doc.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {doc.desc}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xs font-medium text-muted-foreground">
          Frequently Asked Questions
        </h2>
        <div className="rounded-lg border border-border bg-card divide-y divide-border overflow-hidden">
          {faqs.map((f) => (
            <FAQ key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xs font-medium text-muted-foreground">
          Direct Contact Channels
        </h2>
        <div className="rounded-lg border border-border bg-card divide-y divide-border overflow-hidden">
          {contacts.map((contact) => {
            const IconComp = contact.icon;
            return (
              <a
                key={contact.email}
                href={`mailto:${contact.email}`}
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-secondary/35"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <IconComp className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-foreground">{contact.title}</p>
                    <p className="text-xs text-muted-foreground">{contact.desc}</p>
                  </div>
                </div>
                <span className="font-mono text-xs text-foreground shrink-0">
                  {contact.email}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
