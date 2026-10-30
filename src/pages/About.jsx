import { Header } from "@/components/header";
import { Footer } from "@/components/footer-section";
import {
    Heart,
    Globe,
    Code,
    Github,
    Users,
    Shield,
    Mail
} from "lucide-react";

export function About() {
    return (
        <div className="min-h-screen bg-transparent">
            <Header />

            {/* Hero Section */}
            <section className="pt-[calc(6rem+var(--incident-height,0px))] pb-20 px-6 md:px-12 lg:px-16">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-secondary text-foreground text-xs font-medium uppercase tracking-wider mb-6 border border-border">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-signal opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
                        </span>
                        <span>A Stackryze Initiative</span>
                    </div>
                    <h1 className="font-display text-4xl md:text-6xl font-semibold text-foreground mb-6 leading-tight tracking-tight">
                        Giving back to the <br className="hidden md:block" />
                        <span className="text-gradient-signal">developer community.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Stackryze Domains is our way of empowering builders. Free, open-source, and forever reliable.
                    </p>
                </div>
            </section>

            {/* The Why & Values */}
            <section className="py-16 px-6 md:px-12 lg:px-16 border-y border-border bg-transparent">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="font-display text-3xl font-bold text-foreground mb-6">Why we built this</h2>
                        <p className="text-base md:text-lg text-muted-foreground mb-6 leading-relaxed">
                            At <strong className="text-foreground">Stackryze</strong>, we know the struggle of finding a professional domain for a hackathon project, a portfolio, or a quick demo.
                        </p>
                        <p className="text-base md:text-lg text-muted-foreground mb-6 leading-relaxed">
                            We believe that cost shouldn't be a barrier to shipping code. That's why we built this platform—to provide free <code className="text-foreground bg-secondary px-1.5 py-0.5 rounded font-mono text-sm">.indevs.in</code> subdomains to anyone who needs them. No credit cards, no hidden fees.
                        </p>
                        <a
                            href="https://github.com/stackryze/FreeDomains"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 font-semibold text-foreground border-b-2 border-foreground hover:text-signal hover:border-signal transition-colors"
                        >
                            <Github className="w-4 h-4" />
                            Check out the code
                        </a>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="bg-card p-6 rounded-2xl border border-border hover:border-foreground/20 transition-all">
                            <Code className="w-7 h-7 text-signal mb-4" />
                            <h3 className="text-base font-semibold text-foreground mb-2">Open Source</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">Transparent infrastructure. Audit, contribute, or fork it.</p>
                        </div>
                        <div className="bg-card p-6 rounded-2xl border border-border hover:border-foreground/20 transition-all">
                            <Users className="w-7 h-7 text-signal mb-4" />
                            <h3 className="text-base font-semibold text-foreground mb-2">Community</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">Built by developers, for developers. Maintained by volunteers.</p>
                        </div>
                        <div className="bg-card p-6 rounded-2xl border border-border hover:border-foreground/20 transition-all">
                            <Shield className="w-7 h-7 text-signal mb-4" />
                            <h3 className="text-base font-semibold text-foreground mb-2">Secure</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">Zero tolerance for abuse. We keep the namespace clean.</p>
                        </div>
                        <div className="bg-card p-6 rounded-2xl border border-border hover:border-foreground/20 transition-all">
                            <Globe className="w-7 h-7 text-signal mb-4" />
                            <h3 className="text-base font-semibold text-foreground mb-2">Accessible</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">Democratizing web identities for students and creators.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact & Community */}
            <section className="py-20 px-6 md:px-12 lg:px-16">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Contact & Community</h2>
                    <p className="text-base md:text-lg text-muted-foreground mb-10">
                        Have questions, suggestions, or want to collaborate?
                    </p>
                    <div className="flex flex-col md:flex-row justify-center gap-4 mb-16">
                        <a href="mailto:support@stackryze.com" className="flex items-center justify-center gap-3 text-sm font-medium text-foreground bg-card px-6 py-3.5 border border-border rounded-xl hover:border-foreground/20 transition-all shadow-sm">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            support@stackryze.com
                        </a>
                        <a href="mailto:reportabuse@stackryze.com" className="flex items-center justify-center gap-3 text-sm font-medium text-foreground bg-card px-6 py-3.5 border border-border rounded-xl hover:border-foreground/20 transition-all shadow-sm">
                            <Shield className="w-4 h-4 text-muted-foreground" />
                            reportabuse@stackryze.com
                        </a>
                    </div>

                    <div className="bg-card border border-border rounded-2xl p-8 max-w-xl mx-auto text-center relative overflow-hidden shadow-sm">
                        <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-6">Official Communication Channels</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-sm mx-auto mb-6">
                            <div className="font-mono text-foreground text-xs">support@stackryze.com</div>
                            <div className="font-mono text-foreground text-xs">reportabuse@stackryze.com</div>
                            <div className="font-mono text-foreground text-xs">security@stackryze.com</div>
                            <div className="font-mono text-foreground text-xs">no-reply@stackryze.com</div>
                        </div>
                        <p className="text-xs text-muted-foreground italic">
                            We will never contact you from any other domain or prefix.
                        </p>
                    </div>

                    <p className="text-xs text-muted-foreground mt-12">
                        Maintained by <a href="https://stackryze.com" target="_blank" rel="noreferrer" className="font-medium text-foreground hover:underline">Stackryze</a>
                    </p>
                </div>
            </section>

            <Footer />
        </div>
    );
}
