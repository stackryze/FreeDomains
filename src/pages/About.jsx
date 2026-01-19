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
        <div className="min-h-screen bg-[#FFF8F0]">
            <Header />

            {/* Hero Section */}
            <section className="pt-[calc(8rem+var(--incident-height,0px))] pb-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-widest mb-6">
                        <Heart className="w-3 h-3 text-[#FF6B35]" />
                        <span>A Stackryze Initiative</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-[#1A1A1A] mb-6 leading-tight">
                        Giving back to the <br className="hidden md:block" />
                        <span className="text-[#FF6B35]">developer community</span>.
                    </h1>
                    <p className="text-xl text-[#4A4A4A] max-w-2xl mx-auto leading-relaxed">
                        Stackryze Domains (Indevs) is our way of empowering builders. Free, open-source, and forever reliable.
                    </p>
                </div>
            </section>

            {/* The Why & Values */}
            <section className="py-16 px-6 border-y border-[#E5E3DF] bg-white">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-[#1A1A1A] mb-6">Why we built this</h2>
                        <p className="text-lg text-[#4A4A4A] mb-6 leading-relaxed">
                            At <strong>Stackryze</strong>, we know the struggle of finding a professional domain for a hackathon project, a portfolio, or a quick demo.
                        </p>
                        <p className="text-lg text-[#4A4A4A] mb-6 leading-relaxed">
                            We believe that cost shouldn't be a barrier to shipping code. That's why we built this platform—to provide free `.indevs.in` subdomains to anyone who needs them. No credit cards, no hidden fees.
                        </p>
                        <a
                            href="https://github.com/stackryze/FreeDomains"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 font-bold text-[#1A1A1A] border-b-2 border-[#1A1A1A] hover:text-[#FF6B35] hover:border-[#FF6B35] transition-colors"
                        >
                            <Github className="w-4 h-4" />
                            Check out the code
                        </a>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-[#FFF8F0] p-6 rounded-xl border-2 border-[#E5E3DF] hover:border-[#1A1A1A] transition-all">
                            <Code className="w-8 h-8 text-[#1A1A1A] mb-4" />
                            <h3 className="font-bold text-[#1A1A1A] mb-2">Open Source</h3>
                            <p className="text-sm text-[#4A4A4A]">Transparent infrastructure. Audit, contribute, or fork it.</p>
                        </div>
                        <div className="bg-[#FFF8F0] p-6 rounded-xl border-2 border-[#E5E3DF] hover:border-[#1A1A1A] transition-all">
                            <Users className="w-8 h-8 text-[#1A1A1A] mb-4" />
                            <h3 className="font-bold text-[#1A1A1A] mb-2">Community</h3>
                            <p className="text-sm text-[#4A4A4A]">Built by developers, for developers. Maintained by volunteers.</p>
                        </div>
                        <div className="bg-[#FFF8F0] p-6 rounded-xl border-2 border-[#E5E3DF] hover:border-[#1A1A1A] transition-all">
                            <Shield className="w-8 h-8 text-[#1A1A1A] mb-4" />
                            <h3 className="font-bold text-[#1A1A1A] mb-2">Secure</h3>
                            <p className="text-sm text-[#4A4A4A]">Zero tolerance for abuse. We keep the namespace clean.</p>
                        </div>
                        <div className="bg-[#FFF8F0] p-6 rounded-xl border-2 border-[#E5E3DF] hover:border-[#1A1A1A] transition-all">
                            <Globe className="w-8 h-8 text-[#1A1A1A] mb-4" />
                            <h3 className="font-bold text-[#1A1A1A] mb-2">Accessible</h3>
                            <p className="text-sm text-[#4A4A4A]">Democratizing web identities for students and creators.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact & Community */}
            <section className="py-20 px-6 border-t border-[#E5E3DF]">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-8">Contact & Community</h2>
                    <p className="text-xl text-[#4A4A4A] mb-10">
                        Have questions, suggestions, or want to collaborate?
                    </p>
                    <div className="flex flex-col md:flex-row justify-center gap-8 mb-16">
                        <a href="mailto:support@stackryze.com" className="flex items-center justify-center gap-4 text-lg font-bold text-[#1A1A1A] bg-white px-8 py-4 border-2 border-[#1A1A1A] rounded-lg hover:shadow-[4px_4px_0px_0px_#FF6B35] transition-all">
                            <Mail className="w-6 h-6" />
                            support@stackryze.com
                        </a>
                        <a href="mailto:reportabuse@stackryze.com" className="flex items-center justify-center gap-4 text-lg font-bold text-[#1A1A1A] bg-white px-8 py-4 border-2 border-[#1A1A1A] rounded-lg hover:shadow-[4px_4px_0px_0px_#FFD23F] transition-all">
                            <Shield className="w-6 h-6" />
                            reportabuse@stackryze.com
                        </a>
                    </div>

                    <div className="bg-[#FFF8F0] border-2 border-[#E5E3DF] rounded-xl p-8 max-w-2xl mx-auto text-center">
                        <h3 className="font-bold text-[#1A1A1A] mb-4 uppercase tracking-widest text-sm">Official Communication Channels</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-md mx-auto mb-6">
                            <div className="font-mono text-[#4A4A4A] text-sm">support@stackryze.com</div>
                            <div className="font-mono text-[#4A4A4A] text-sm">reportabuse@stackryze.com</div>
                            <div className="font-mono text-[#4A4A4A] text-sm">security@stackryze.com</div>
                            <div className="font-mono text-[#4A4A4A] text-sm">no-reply@stackryze.com</div>
                        </div>
                        <p className="text-sm text-[#888] italic">
                            We will never contact you from any other domain or prefix.
                        </p>
                    </div>

                    <p className="text-sm text-[#888] mt-16">
                        Maintained by <a href="https://stackryze.com" target="_blank" rel="noreferrer" className="font-bold text-[#1A1A1A] hover:underline">Stackryze</a>
                    </p>
                </div>
            </section>

            <Footer />
        </div>
    );
}
