import { Server, Settings, ExternalLink, Zap } from "lucide-react";

export default function DNSRecords() {
    return (
        <div className="max-w-4xl space-y-8 relative">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-signal/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
            
            {/* Header */}
            <div>
                <p className="text-sm font-bold uppercase tracking-widest text-signal mb-2 flex items-center gap-2">
                    <Server className="w-4 h-4" />
                    Infrastructure
                </p>
                <h1 className="font-display text-3xl md:text-4xl font-medium text-foreground leading-tight mb-3">DNS Management</h1>
                <p className="text-base text-foreground font-medium max-w-2xl leading-relaxed">
                    Host your domains with absolute freedom. Bring your own nameservers, or manage them directly through Stackryze DNS.
                </p>
            </div>

            {/* Managed DNS CTA - Premium Card */}
            <div className="bg-card/80 backdrop-blur-2xl border border-border rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-signal/5 to-transparent pointer-events-none"></div>
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-signal/30 to-transparent"></div>
                
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between relative z-10">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-signal/10 border border-signal/20 flex items-center justify-center flex-shrink-0 shadow-inner">
                            <Zap className="w-6 h-6 text-signal fill-signal/20" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="font-display text-foreground text-xl font-medium">Managed DNS is Live!</h2>
                                <span className="bg-signal text-signal-foreground px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide animate-pulse shadow-sm shadow-signal/20">New</span>
                            </div>
                            <p className="text-sm font-medium text-foreground leading-relaxed max-w-xl">
                                Host your DNS records directly with <strong className="text-signal">Stackryze DNS</strong> at <span className="font-mono bg-secondary dark:bg-secondary px-1.5 py-0.5 rounded text-foreground text-xs border border-border dark:border-border/60 shadow-sm">dns.stackryze.com</span>. Powered by PowerDNS, globally distributed and lightning fast.
                            </p>
                        </div>
                    </div>
                    <a
                        href="https://dns.stackryze.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-foreground text-background font-bold text-sm rounded-xl shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:scale-[1.02] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] transition-all duration-300 whitespace-nowrap flex-shrink-0 w-full md:w-auto"
                    >
                        Get Started
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            </div>

            {/* How it works (Delegation model) */}
            <div className="bg-card/70 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-foreground flex items-center justify-center shadow-lg">
                        <Settings className="w-6 h-6 text-background" />
                    </div>
                    <div>
                        <h2 className="font-display text-2xl font-medium text-foreground tracking-tight">Bring Your Own DNS</h2>
                        <p className="text-sm font-medium text-foreground opacity-80 mt-0.5">The delegation model explained</p>
                    </div>
                </div>

                <p className="text-base font-medium text-foreground leading-relaxed mb-8 max-w-2xl">
                    Stackryze operates on a strict delegation model. When you register a subdomain (like{" "}
                    <code className="bg-secondary dark:bg-secondary border border-border px-2 py-1 rounded-md font-mono text-sm shadow-sm">you.indevs.in</code>
                    ), you retain full control by providing your own nameservers.
                </p>

                <div className="bg-muted/50 dark:bg-black/20 border border-border/80 dark:border-border/60 rounded-2xl p-6 md:p-8">
                    <div className="space-y-6">
                        {[
                            { title: "Register Domain", desc: "Claim your free subdomain using our seamless registration dashboard." },
                            { title: "Configure Nameservers", desc: "Enter your preferred DNS provider's nameservers (e.g., Cloudflare, Route53, or Stackryze DNS)." },
                            { title: "Automatic Delegation", desc: "We instantly create NS records pointing traffic directly to your chosen nameservers." },
                            { title: "Full Control", desc: "Manage all A, AAAA, CNAME, TXT, and MX records securely from your own DNS provider's dashboard." }
                        ].map((step, i) => (
                            <div key={i} className="flex gap-4 group">
                                <div className="w-8 h-8 rounded-full bg-accent dark:bg-secondary text-foreground group-hover:bg-foreground group-hover:text-background dark:group-hover:bg-background dark:group-hover:text-foreground flex items-center justify-center font-bold text-sm flex-shrink-0 transition-colors mt-0.5 shadow-sm">
                                    {i + 1}
                                </div>
                                <div>
                                    <h3 className="font-display text-foreground text-base font-medium mb-1">{step.title}</h3>
                                    <p className="text-sm font-medium text-foreground opacity-80 leading-relaxed">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
