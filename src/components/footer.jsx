export function Footer() {
    return (
        <footer className="bg-[#1A1A1A] text-white py-8 px-6 border-t border-[#333]">
            <div className="w-full max-w-[1600px] mx-auto">

                <div className="flex flex-col md:flex-row justify-between gap-8 mb-4 md:items-start">

                    {/* Brand Section */}
                    <div>
                        <a href="/" className="flex items-baseline gap-0.5 group mb-4">
                            <div className="flex items-center font-extrabold text-3xl tracking-tighter gap-0.5">
                                <span className="text-[#FF6B35]">IN</span>
                                <span className="text-white">DE</span>
                                <span className="text-[#138808]">VS</span>
                            </div>
                            <span className="text-lg font-bold text-white tracking-tight">.in</span>
                        </a>
                        <p className="text-[#E5E3DF] text-sm mb-4 max-w-sm">
                            Free subdomains for developers.<br />
                            Built by developers.
                        </p>

                        <div className="space-y-0.5 mb-2">
                            <h5 className="text-[#FF6B35] font-bold text-xs uppercase tracking-wide mb-1">Verified Emails</h5>
                            <p className="text-[#E5E3DF] text-xs font-mono">support@admin.indevs.in</p>
                            <p className="text-[#E5E3DF] text-xs font-mono">reportabuse@admin.indevs.in</p>
                            <p className="text-[#E5E3DF] text-xs font-mono">sudheer@indevs.in <span className="text-[#6B6B6B]">(Founder)</span></p>
                            <p className="text-[#E5E3DF] text-xs font-mono">no-reply@admin.indevs.in</p>
                            <p className="text-[#6B6B6B] text-[10px] max-w-sm mt-2 italic leading-relaxed">
                                Note: We don't send any messages from any other domains or prefixes whatsoever.
                            </p>
                        </div>
                    </div>

                    {/* Links Section */}
                    <div className="flex gap-10 md:gap-20 pr-2 md:pr-0">
                        {/* Platform */}
                        <div>
                            <h4 className="font-bold text-sm mb-3 text-white">Platform</h4>
                            <ul className="space-y-2 text-xs">
                                <li><a href="/docs" className="text-[#E5E3DF] hover:text-[#FF6B35] transition-colors">Documentation</a></li>

                                <li><a href="/about" className="text-[#E5E3DF] hover:text-[#FF6B35] transition-colors">About</a></li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h4 className="font-bold text-sm mb-3 text-white">Legal</h4>
                            <ul className="space-y-2 text-xs">
                                <li><a href="/terms" className="text-[#E5E3DF] hover:text-[#FF6B35] transition-colors">Terms</a></li>
                                <li><a href="/privacy" className="text-[#E5E3DF] hover:text-[#FF6B35] transition-colors">Privacy</a></li>
                                <li><a href="/aup" className="text-[#E5E3DF] hover:text-[#FF6B35] transition-colors">Usage Policy</a></li>
                                <li><a href="/abuse" className="text-[#E5E3DF] hover:text-[#FF6B35] transition-colors">Report Abuse</a></li>
                            </ul>
                        </div>

                        {/* Connect */}
                        <div>
                            <h4 className="font-bold text-sm mb-3 text-white">Connect</h4>
                            <ul className="space-y-2 text-xs">
                                <li><a href="https://github.com/sudheerbhuvana/indevs.in" target="_blank" rel="noreferrer" className="text-[#E5E3DF] hover:text-[#FF6B35] transition-colors">GitHub</a></li>
                                <li><a href="https://github.com/sponsors/sudheerbhuvana" target="_blank" rel="noreferrer" className="text-[#E5E3DF] hover:text-[#FF6B35] transition-colors">Sponsor ❤️</a></li>
                                <li><a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-[#E5E3DF] hover:text-[#FF6B35] transition-colors">Twitter</a></li>
                                <li><a href="mailto:support@admin.indevs.in" className="text-[#E5E3DF] hover:text-[#FF6B35] transition-colors">Contact</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-4 border-t border-[#333] flex flex-col md:flex-row justify-between items-center gap-2">
                    <p className="text-[10px] text-[#E5E3DF] text-center md:text-left">
                        © 2025 Indevs. Open source and proud of it.
                    </p>
                    <p className="text-[10px] text-[#E5E3DF] text-center md:text-right">
                        A project by <a href="https://sudheerbhuvana.in" target="_blank" rel="noreferrer" className="font-bold hover:text-[#FF6B35] transition-colors">Sudheer Bhuvana</a>
                    </p>
                </div>

            </div>
        </footer>
    );
}
