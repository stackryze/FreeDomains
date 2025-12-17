import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import SponsorCard from "@/components/sponsor-card";
import {
    Brain,
    Settings,
    Server,
    Shield,
    Users,
    Mail,
    Globe,
    Code,
    Github,
    Heart
} from "lucide-react";

export function About() {
    return (
        <div className="min-h-screen bg-[#FFF8F0]">
            <Header />

            {/* Hero */}
            <section className="pt-32 pb-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-sm font-bold uppercase tracking-widest text-[#FF6B35] mb-6">
                        About Indevs.in
                    </p>
                    <h1 className="text-5xl md:text-6xl font-bold text-[#1A1A1A] mb-8 leading-tight">
                        Empowering developers <br className="hidden md:block" />
                        with free, reliable subdomains.
                    </h1>
                </div>
            </section>

            {/* Mission & Who We Are */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto space-y-24">
                    {/* Mission */}
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-8">Mission Statement</h2>
                        <p className="text-xl text-[#4A4A4A] leading-relaxed">
                            Indevs.in was built with a simple goal — to make it easier for developers, students, and independent creators to put their work online without worrying about domain costs or infrastructure setup.
                        </p>
                        <p className="text-xl text-[#4A4A4A] leading-relaxed mt-4">
                            We believe every developer deserves an identity on the web — whether it’s a project demo, portfolio, documentation, or an experimental build. Indevs helps you claim that identity instantly with a clean, professional subdomain.
                        </p>
                    </div>

                    {/* Who We Are */}
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-8">Who We Are</h2>
                        <p className="text-xl text-[#4A4A4A] leading-relaxed mb-10">
                            Indevs.in is a student-run initiative maintained by passionate developers who wanted to build an open and developer-friendly web.
                        </p>

                        {/* Founder Block */}
                        <div className="flex flex-col sm:flex-row items-center gap-6 bg-white p-8 rounded-xl border-2 border-[#E5E3DF] w-full transform hover:-translate-y-1 transition-all duration-300 text-left hover:border-[#1A1A1A] hover:shadow-lg">
                            <div className="w-20 h-20 bg-[#1A1A1A] rounded-full flex items-center justify-center text-white font-bold text-3xl flex-shrink-0 shadow-lg">
                                SB
                            </div>
                            <div className="text-center sm:text-left flex-1">
                                <p className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A] mb-1">
                                    Founder
                                </p>
                                <h3 className="text-2xl font-bold text-[#1A1A1A]">
                                    Sudheer Bhuvana
                                </h3>
                                <p className="text-[#4A4A4A] font-medium text-lg mt-1 italic mb-4">
                                    "Building for the builders."
                                </p>
                                <a
                                    href="https://sudheerbhuvana.in"
                                    className="inline-flex items-center gap-2 text-sm font-bold text-[#1A1A1A] border-2 border-[#E5E3DF] px-4 py-2 rounded bg-[#FFF8F0] hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A] transition-all"
                                >
                                    <Globe className="w-4 h-4" />
                                    Portfolio
                                </a>
                            </div>
                        </div>

                        <p className="text-xl text-[#4A4A4A] leading-relaxed mt-10">
                            The platform is operated voluntarily by students and contributors who maintain the infrastructure, verify requests, and handle DNS configurations. Though small in scale, we’re committed to transparency, uptime, and community trust.
                        </p>
                    </div>

                    {/* How It Works */}
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-8 text-center">How It Works</h2>
                        <div className="max-w-3xl mx-auto text-center bg-[#FFF8F0] border-2 border-[#E5E3DF] rounded-xl p-8 md:p-10 hover:border-[#1A1A1A] transition-colors duration-300">
                            <p className="text-xl text-[#4A4A4A] mb-6 leading-relaxed">
                                Currently, we operate on a <strong>"Bring Your Own DNS"</strong> model. When you claim a subdomain (e.g. <em>yourname.indevs.in</em>), you provide your own Nameservers (NS records).
                            </p>
                            <p className="text-xl text-[#4A4A4A] mb-8 leading-relaxed">
                                This gives you full control to manage your DNS records at your preferred provider (like Cloudflare), while we handle the delegation.
                            </p>
                            <div className="bg-white p-6 border-l-4 border-[#FF6B35] rounded-r-lg text-left mt-10 border-y border-r border-[#E5E3DF]">
                                <p className="font-bold text-[#1A1A1A] text-lg mb-2 flex items-center gap-2">
                                    <span className="text-xl">🚀</span> Coming Soon: Managed DNS
                                </p>
                                <p className="text-base text-[#4A4A4A]">
                                    We are building a native DNS manager! Soon, you will be able to add and edit A, CNAME, and TXT records directly from your Indevs dashboard, no external provider needed.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-24 px-6 bg-white border-y border-[#E5E3DF]">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-[#1A1A1A]">Our Values</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Value 1 */}
                        <div className="flex flex-col items-center text-center gap-4 bg-[#FFF8F0] border-2 border-[#E5E3DF] p-8 rounded-xl hover:border-[#1A1A1A] transition-all duration-300">
                            <div className="w-16 h-16 bg-white border-2 border-[#E5E3DF] flex items-center justify-center rounded-full flex-shrink-0 mb-2">
                                <Brain className="w-8 h-8 text-[#1A1A1A]" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Open Access</h3>
                                <p className="text-base text-[#4A4A4A] leading-relaxed">Everyone deserves a place on the web, regardless of budget.</p>
                            </div>
                        </div>

                        {/* Value 2 */}
                        <div className="flex flex-col items-center text-center gap-4 bg-[#FFF8F0] border-2 border-[#E5E3DF] p-8 rounded-xl hover:border-[#1A1A1A] transition-all duration-300">
                            <div className="w-16 h-16 bg-white border-2 border-[#E5E3DF] flex items-center justify-center rounded-full flex-shrink-0 mb-2">
                                <Settings className="w-8 h-8 text-[#1A1A1A]" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Transparency</h3>
                                <p className="text-base text-[#4A4A4A] leading-relaxed">No hidden tracking, fees, or ads. What you see is what you get.</p>
                            </div>
                        </div>

                        {/* Value 3 */}
                        <div className="flex flex-col items-center text-center gap-4 bg-[#FFF8F0] border-2 border-[#E5E3DF] p-8 rounded-xl hover:border-[#1A1A1A] transition-all duration-300">
                            <div className="w-16 h-16 bg-white border-2 border-[#E5E3DF] flex items-center justify-center rounded-full flex-shrink-0 mb-2">
                                <Server className="w-8 h-8 text-[#1A1A1A]" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Reliability</h3>
                                <p className="text-base text-[#4A4A4A] leading-relaxed">Built with industry-grade infrastructure for maximum uptime.</p>
                            </div>
                        </div>

                        {/* Value 4 */}
                        <div className="flex flex-col items-center text-center gap-4 bg-[#FFF8F0] border-2 border-[#E5E3DF] p-8 rounded-xl hover:border-[#1A1A1A] transition-all duration-300">
                            <div className="w-16 h-16 bg-white border-2 border-[#E5E3DF] flex items-center justify-center rounded-full flex-shrink-0 mb-2">
                                <Shield className="w-8 h-8 text-[#1A1A1A]" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Security</h3>
                                <p className="text-base text-[#4A4A4A] leading-relaxed">Zero-tolerance for abuse or misuse to keep the platform safe.</p>
                            </div>
                        </div>

                        {/* Value 5 */}
                        <div className="flex flex-col items-center text-center gap-4 md:col-span-2 md:w-2/3 md:mx-auto bg-[#FFF8F0] border-2 border-[#E5E3DF] p-8 rounded-xl hover:border-[#1A1A1A] transition-all duration-300">
                            <div className="w-16 h-16 bg-white border-2 border-[#E5E3DF] flex items-center justify-center rounded-full flex-shrink-0 mb-2">
                                <Users className="w-8 h-8 text-[#1A1A1A]" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Community</h3>
                                <p className="text-base text-[#4A4A4A] leading-relaxed">Created by students, for students and developers worldwide.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Open Source Banner */}
            <section className="py-24 px-6 bg-[#FFF8F0]">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="flex justify-center mb-6">
                        <Code className="w-16 h-16 text-[#1A1A1A]" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#1A1A1A]">Entirely Open Source</h2>
                    <p className="text-xl text-[#4A4A4A] leading-relaxed mb-10">
                        Transparency is our core. Indevs.in is 100% open source. You can view our code, contribute to the project, or audit our security directly on GitHub.
                    </p>
                    <a
                        href="https://github.com/sudheerbhuvana/indevs.in"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-3 bg-[#1A1A1A] text-white px-8 py-4 rounded-lg font-bold text-lg hover:shadow-[4px_4px_0px_0px_#FFD23F] transition-all"
                    >
                        <Github className="w-6 h-6" />
                        View Source Code
                    </a>
                </div>
            </section>

            {/* Support/Sponsor Section */}
            <section className="py-24 px-6 bg-white border-y border-[#E5E3DF]">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="flex justify-center mb-6">
                        <Heart className="w-16 h-16 text-[#FF6B35]" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#1A1A1A]">Support Indevs</h2>
                    <p className="text-xl text-[#4A4A4A] leading-relaxed mb-10">
                        Indevs is free and open source, maintained by volunteers. Your support helps us keep the infrastructure running and improve the platform for everyone.
                    </p>
                    <SponsorCard />
                </div>
            </section>

            {/* Future & Contact */}
            <section className="py-24 px-6">
                <div className="max-w-3xl mx-auto space-y-20">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-8 text-center">The Future</h2>
                        <p className="text-xl text-[#4A4A4A] leading-relaxed text-center">
                            Our vision is to grow Indevs into a trusted, developer-friendly namespace — one that reflects creativity, innovation, and openness.
                        </p>
                        <p className="text-xl text-[#4A4A4A] leading-relaxed mt-4 text-center">
                            In the future, we plan to integrate custom dashboards, improved DNS management, and documentation to make the experience even smoother.
                        </p>
                    </div>

                    <div className="border-t-2 border-[#E5E3DF] pt-16 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-8">Contact & Community</h2>
                        <p className="text-xl text-[#4A4A4A] mb-10">
                            Have questions, suggestions, or want to collaborate?
                        </p>
                        <div className="flex flex-col md:flex-row justify-center gap-8 mb-16">
                            <a href="mailto:support@admin.indevs.in" className="flex items-center justify-center gap-4 text-lg font-bold text-[#1A1A1A] bg-white px-8 py-4 border-2 border-[#1A1A1A] rounded-lg hover:shadow-[4px_4px_0px_0px_#FF6B35] transition-all">
                                <Mail className="w-6 h-6" />
                                support@admin.indevs.in
                            </a>
                            <a href="mailto:reportabuse@admin.indevs.in" className="flex items-center justify-center gap-4 text-lg font-bold text-[#1A1A1A] bg-white px-8 py-4 border-2 border-[#1A1A1A] rounded-lg hover:shadow-[4px_4px_0px_0px_#FFD23F] transition-all">
                                <Shield className="w-6 h-6" />
                                reportabuse@admin.indevs.in
                            </a>
                        </div>

                        <div className="bg-[#FFF8F0] border-2 border-[#E5E3DF] rounded-xl p-8 max-w-2xl mx-auto text-center">
                            <h3 className="font-bold text-[#1A1A1A] mb-4 uppercase tracking-widest text-sm">Official Communication Channels</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-md mx-auto mb-6">
                                <div className="font-mono text-[#4A4A4A] text-sm">support@admin.indevs.in</div>
                                <div className="font-mono text-[#4A4A4A] text-sm">reportabuse@admin.indevs.in</div>
                                <div className="font-mono text-[#4A4A4A] text-sm">security@admin.indevs.in</div>
                                <div className="font-mono text-[#4A4A4A] text-sm">sudheer@indevs.in</div>
                                <div className="font-mono text-[#4A4A4A] text-sm">no-reply@admin.indevs.in</div>
                            </div>
                            <p className="text-sm text-[#888] italic">
                                We will never contact you from any other domain or prefix.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
