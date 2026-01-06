import { Heart, Github } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export function Donate() {
    return (
        <div className="min-h-screen bg-[#1A1A1A] font-sans">
            <Header />

            <main className="pt-24 pb-12 px-4">
                <div className="max-w-3xl mx-auto">
                    {/* Hero + CTA */}
                    <div className="text-center mb-8">
                        <div className="inline-block p-3 bg-[#FF6B35] rounded-xl mb-4 border-3 border-white shadow-[6px_6px_0px_0px_#FFD23F]">
                            <Heart className="w-8 h-8 text-white fill-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
                            SUPPORT US
                        </h1>
                        <p className="text-base md:text-lg text-[#E5E3DF] max-w-xl mx-auto mb-6 leading-relaxed">
                            Students running <span className="text-[#FFD23F] font-bold">free infrastructure</span> for <span className="text-[#FFD23F] font-bold">2800+ (07/01/2026) developers</span> worldwide
                        </p>

                        {/* Main CTA */}
                        <a
                            href="https://github.com/sponsors/sudheerbhuvana"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-3 bg-[#FFD23F] text-[#1A1A1A] px-8 py-4 font-black text-base md:text-lg uppercase tracking-wide border-3 border-white hover:bg-white transition-all duration-150 shadow-[6px_6px_0px_0px_#FF6B35] hover:shadow-[3px_3px_0px_0px_#FF6B35] hover:translate-x-[3px] hover:translate-y-[3px] mb-3"
                        >
                            <Github className="w-5 h-5" />
                            SPONSOR ON GITHUB
                            <Heart className="w-5 h-5" />
                        </a>

                        <p className="text-[#888] text-xs">Even $1 makes a difference ❤️</p>
                    </div>

                    {/* Simple Text Content */}
                    <div className="bg-white p-8 md:p-10 border-3 border-white shadow-[8px_8px_0px_0px_#FFD23F]">
                        <div className="space-y-6 text-[#1A1A1A]">
                            {/* The Reality */}
                            <div>
                                <p className="text-base leading-relaxed">
                                    We're <strong className="text-[#FF6B35]">students</strong> running this service <strong className="text-[#FF6B35]">completely free</strong>.
                                    We maintain nameservers, databases, APIs, this website, and security — all while studying and working.
                                </p>
                            </div>

                            {/* Costs */}
                            <div>
                                <p className="text-base leading-relaxed">
                                    We pay <strong className="text-[#FF6B35] text-xl">~$190/year</strong> out of our pockets
                                    (<strong className="text-[#138808]">$15/month</strong> hosting + <strong className="text-[#138808]">₹833/year</strong> domain registration).
                                    This is ONLY for this domain service.
                                </p>
                            </div>

                            {/* The Ask */}
                            <div>
                                <p className="text-base leading-relaxed">
                                    If just <strong className="text-[#138808]">200 users donate $1 each</strong>, that covers hosting for an entire year.
                                    That's less than a cup of coffee.
                                </p>
                            </div>

                            <hr className="border-[#E5E3DF]" />

                            {/* What We're Building */}
                            <div>
                                <p className="text-base leading-relaxed mb-3">
                                    Beyond this platform, we're building more <strong className="text-[#1A1A1A]">free & open-source tools</strong>:
                                </p>
                                <ul className="space-y-2 text-sm ml-6 list-disc">
                                    <li><strong className="text-[#FF6B35]">Free App Hosting</strong> — Limited hosting for genuine users (in development)</li>
                                    <li><strong className="text-[#138808]">Atom Homepage</strong> — Self-hosted homelab dashboard with SSO for ANY OAuth (BETA LIVE on <a href="https://github.com/stackryze/atom-homepage" target="_blank" rel="noreferrer" className="underline hover:text-[#138808]">GitHub</a>)</li>
                                    <li><strong className="text-blue-600]">Discord Music Bot</strong> — High-quality streaming (served 1.2M users, relaunching)</li>
                                    <li><strong className="text-indigo-600]">More Dev Tools</strong> — APIs, utilities & services</li>
                                </ul>
                                <p className="text-sm text-[#4A4A4A] mt-3 italic">
                                    More projects coming at <a href="https://stackryze.com" target="_blank" rel="noreferrer" className="font-bold text-[#FF6B35] underline hover:text-[#1A1A1A]">stackryze.com</a> & <a href="https://github.com/stackryze" target="_blank" rel="noreferrer" className="font-bold text-[#FF6B35] underline hover:text-[#1A1A1A]">github.com/stackryze</a>
                                </p>
                            </div>

                            <hr className="border-[#E5E3DF]" />

                            {/* Can't Donate */}
                            <div>
                                <p className="text-base leading-relaxed mb-3">
                                    <strong className="text-[#1A1A1A]">Can't donate?</strong> You can still help:
                                </p>
                                <p className="text-sm text-[#4A4A4A]">
                                    ⭐ <a href="https://github.com/sudheerbhuvana/indevs.in" target="_blank" rel="noreferrer" className="font-bold text-[#1A1A1A] underline hover:text-[#FF6B35]">Star us on GitHub</a> •
                                    📢 Share with friends •
                                    🐛 Report bugs •
                                    💻 Contribute code
                                </p>
                            </div>

                            {/* Footer */}
                            <div className="text-center pt-4">
                                <p className="text-sm text-[#888] italic">
                                    Built by Stackryze • 100% Open Source • All for public benefit
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
