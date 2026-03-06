import { Heart, Github, Star, Share2, Bug, Code2 } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer-section";

const ways = [
    { icon: Star,    label: "Star on GitHub",    href: "https://github.com/stackryze/FreeDomains", desc: "Helps us get discovered" },
    { icon: Share2,  label: "Share with friends", href: null,                                        desc: "Spread the word" },
    { icon: Bug,     label: "Report bugs",        href: "https://github.com/stackryze/FreeDomains/issues", desc: "Improve the platform" },
    { icon: Code2,   label: "Contribute code",    href: "https://github.com/stackryze/FreeDomains", desc: "Open source PRs welcome" },
];

export function Donate() {
    return (
        <div className="min-h-screen bg-white font-sans flex flex-col">
            <Header />

            <main className="flex-1 flex items-center justify-center px-4 pt-[calc(6rem+var(--incident-height,0px))] pb-16">
                <div className="w-full max-w-md space-y-6">

                    {/* Icon + heading */}
                    <div className="text-center space-y-2">
                        <div className="w-14 h-14 rounded-2xl bg-[#FFF0EB] border-[1px] border-[#FDDDD3] flex items-center justify-center mx-auto">
                            <Heart className="w-7 h-7 text-[#FF6B35] fill-[#FF6B35]" />
                        </div>
                        <h1 className="text-2xl font-extrabold text-[#111827]">Support Stackryze</h1>
                        <p className="text-sm text-[#6B7280] max-w-xs mx-auto leading-relaxed">
                            It costs ~$20/month to keep this running — funded personally by a student. Your support keeps it free for everyone.
                        </p>
                    </div>

                    {/* Primary: GitHub Sponsors */}
                    <a
                        href="https://github.com/sponsors/sudheerbhuvana"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-3 w-full bg-[#111827] text-white font-bold text-sm py-3.5 rounded-xl hover:bg-[#1f2937] transition-colors"
                    >
                        <Github className="w-5 h-5" />
                        Sponsor on GitHub
                        <Heart className="w-4 h-4 fill-[#FF6B35] text-[#FF6B35]" />
                    </a>

                    <p className="text-center text-xs text-[#9CA3AF]">Even $1 makes a real difference ❤️</p>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-[#E5E7EB]" />
                        <span className="text-xs text-[#9CA3AF] font-medium">Can't donate? Still help us</span>
                        <div className="flex-1 h-px bg-[#E5E7EB]" />
                    </div>

                    {/* Secondary ways to help */}
                    <div className="grid grid-cols-2 gap-3">
                        {ways.map(({ icon: Icon, label, href, desc }) => {
                            const cls = "bg-white border-[1px] border-[#D1D5DB] rounded-xl p-4 flex flex-col gap-2 hover:border-[#9CA3AF] transition-colors text-left";
                            const inner = (
                                <>
                                    <div className="w-8 h-8 rounded-lg bg-[#F9FAFB] border-[1px] border-[#E5E7EB] flex items-center justify-center">
                                        <Icon className="w-4 h-4 text-[#4B5563]" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-[#111827]">{label}</p>
                                        <p className="text-xs text-[#6B7280] mt-0.5">{desc}</p>
                                    </div>
                                </>
                            );
                            return href
                                ? <a key={label} href={href} target="_blank" rel="noreferrer" className={cls}>{inner}</a>
                                : <div key={label} className={cls}>{inner}</div>;
                        })}
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
