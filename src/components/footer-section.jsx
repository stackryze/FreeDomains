export function Footer() {
    return (
        <footer className="bg-[#1A1A1A] text-white py-8 px-6 border-t border-[#333]">
            <div className="w-full max-w-[1600px] mx-auto">

                <div className="flex flex-col md:flex-row justify-between gap-8 mb-4 md:items-start">

                    {/* Brand Section */}
                    <div>
                        <a href="/" className="flex items-center gap-4 group mb-4">
                            <div className="flex items-center gap-3">
                                <img src="/stackryze_logo_white.png" alt="Stackryze Logo" className="h-12 w-auto" />
                                <span className="text-2xl font-bold text-white tracking-tight">Stackryze Domains</span>
                            </div>
                            <div className="h-8 w-[1px] bg-[#333]"></div>
                            <div className="flex items-baseline gap-0.5">
                                <div className="flex items-center font-extrabold text-3xl tracking-tighter gap-0.5">
                                    <span className="text-[#FF6B35]">IN</span>
                                    <span className="text-white">DE</span>
                                    <span className="text-[#138808]">VS</span>
                                </div>
                                <span className="text-lg font-bold text-white tracking-tight">.in</span>
                            </div>
                        </a>
                        <p className="text-[#E5E3DF] text-sm mb-4 max-w-sm">
                            Free Domains for Developers

                            .<br />
                            Built by developers.
                        </p>

                        <div className="space-y-0.5 mb-2">
                            <h5 className="text-[#FF6B35] font-bold text-sm uppercase tracking-wide mb-1">Verified Emails</h5>
                            <p className="text-[#E5E3DF] text-sm font-mono">support@stackryze.com</p>
                            <p className="text-[#E5E3DF] text-sm font-mono">reportabuse@stackryze.com</p>
                            <p className="text-[#E5E3DF] text-sm font-mono">no-reply@stackryze.com</p>
                            <p className="text-[#6B6B6B] text-xs max-w-sm mt-2 italic leading-relaxed">
                                Note: We don't send any messages from any other domains or prefixes whatsoever.
                            </p>
                        </div>
                    </div>

                    {/* Links Section */}
                    <div className="flex gap-10 md:gap-20 pr-2 md:pr-0">
                        {/* Platform */}
                        <div>
                            <h4 className="font-bold text-base mb-3 text-white">Platform</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="https://domain-docs.stackryze.com" target="_blank" className="text-[#E5E3DF] hover:text-[#FF6B35] transition-colors">Documentation</a></li>

                                <li><a href="/about" className="text-[#E5E3DF] hover:text-[#FF6B35] transition-colors">About</a></li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h4 className="font-bold text-base mb-3 text-white">Legal</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="/terms" className="text-[#E5E3DF] hover:text-[#FF6B35] transition-colors">Terms</a></li>
                                <li><a href="/privacy" className="text-[#E5E3DF] hover:text-[#FF6B35] transition-colors">Privacy</a></li>
                                <li><a href="/aup" className="text-[#E5E3DF] hover:text-[#FF6B35] transition-colors">Usage Policy</a></li>
                                <li><a href="/abuse" className="text-[#E5E3DF] hover:text-[#FF6B35] transition-colors">Report Abuse</a></li>
                            </ul>
                        </div>

                        {/* Connect */}
                        <div>
                            <h4 className="font-bold text-base mb-3 text-white">Connect</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="https://github.com/stackryze/FreeDomains" target="_blank" rel="noreferrer" className="text-[#E5E3DF] hover:text-[#FF6B35] transition-colors">GitHub</a></li>
                                <li><a href="https://github.com/sponsors/sudheerbhuvana" target="_blank" rel="noreferrer" className="text-[#E5E3DF] hover:text-[#FF6B35] transition-colors">Sponsor ❤️</a></li>
                                <li><a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-[#E5E3DF] hover:text-[#FF6B35] transition-colors">Twitter</a></li>
                                <li><a href="https://discord.gg/wr7s97cfM7" target="_blank" rel="noreferrer" className="text-[#E5E3DF] hover:text-[#FF6B35] transition-colors">Discord Community</a></li>
                                <li><a href="mailto:support@stackryze.com" className="text-[#E5E3DF] hover:text-[#FF6B35] transition-colors">Contact</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-4 border-t border-[#333] flex flex-col md:flex-row justify-between items-center gap-2">
                    <p className="text-xs text-[#E5E3DF] text-center md:text-left">
                        © 2025 Indevs. Open source and proud of it.
                    </p>
                    <p className="text-xs text-[#E5E3DF] text-center md:text-right">
                        A project by <a href="https://stackryze.com" target="_blank" rel="noreferrer" className="font-bold text-white hover:text-[#FF6B35] transition-colors">Stackryze</a> (Registered MSME, India)
                    </p>
                </div>

            </div>
        </footer>
    );
}