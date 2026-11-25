export function Footer() {
    return (
        <footer className="bg-card text-foreground border-t border-border">
            <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 py-12">

                <div className="flex flex-col md:flex-row justify-between gap-10 md:items-start">

                    {/* Brand Section */}
                    <div>
                        <a href="/" className="flex items-center gap-4 group mb-5">
                            <div className="flex items-center gap-3">
                                <img src="/stackryze_logo_white.png" alt="Stackryze Logo" className="h-12 w-auto" />
                                <span className="text-2xl font-bold text-foreground tracking-tight">Stackryze Domains</span>
                            </div>
                            <div className="h-8 w-px bg-border"></div>
                            <div className="flex items-baseline gap-0.5">
                                <div className="flex items-center font-extrabold text-3xl tracking-tighter gap-0.5">
                                    <span className="text-[#FF9933]">IN</span>
                                    <span className="text-foreground">DE</span>
                                    <span className="text-[#138808]">VS</span>
                                </div>
                                <span className="text-lg font-bold text-foreground tracking-tight">.in</span>
                            </div>
                        </a>
                        <p className="text-muted-foreground text-sm mb-5 max-w-sm leading-relaxed">
                            Free Domains for Developers. Built by developers.
                        </p>

                        <div className="space-y-0.5 mb-2">
                            <h5 className="text-signal font-bold text-sm uppercase tracking-wide mb-1">Verified Emails</h5>
                            <p className="text-muted-foreground text-sm font-mono">support@stackryze.com</p>
                            <p className="text-muted-foreground text-sm font-mono">reportabuse@stackryze.com</p>
                            <p className="text-muted-foreground text-sm font-mono">no-reply@stackryze.com</p>
                            <p className="text-muted-foreground/70 text-xs max-w-sm mt-2 italic leading-relaxed">
                                Note: We don't send any messages from any other domains or prefixes whatsoever.
                            </p>
                        </div>
                    </div>

                    {/* Links Section */}
                    <div className="flex gap-10 md:gap-20 pr-2 md:pr-0">
                        {/* Platform */}
                        <div>
                            <h4 className="font-bold text-base mb-3 text-foreground">Platform</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="https://domain-docs.stackryze.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-signal transition-colors">Documentation</a></li>
                                <li><a href="/whois" className="text-muted-foreground hover:text-signal transition-colors">WHOIS Lookup</a></li>
                                <li><a href="/about" className="text-muted-foreground hover:text-signal transition-colors">About</a></li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h4 className="font-bold text-base mb-3 text-foreground">Legal</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="/terms" className="text-muted-foreground hover:text-signal transition-colors">Terms</a></li>
                                <li><a href="/privacy" className="text-muted-foreground hover:text-signal transition-colors">Privacy</a></li>
                                <li><a href="/aup" className="text-muted-foreground hover:text-signal transition-colors">Usage Policy</a></li>
                                <li><a href="/abuse" className="text-muted-foreground hover:text-signal transition-colors">Report Abuse</a></li>
                            </ul>
                        </div>

                        {/* Connect */}
                        <div>
                            <h4 className="font-bold text-base mb-3 text-foreground">Connect</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="https://github.com/stackryze/FreeDomains" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-signal transition-colors">GitHub</a></li>
                                <li><a href="https://github.com/sponsors/sudheerbhuvana" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-signal transition-colors">Sponsor ❤️</a></li>
                                <li><a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-signal transition-colors">Twitter</a></li>
                                <li><a href="https://discord.gg/wr7s97cfM7" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-signal transition-colors">Discord Community</a></li>
                                <li><a href="mailto:support@stackryze.com" className="text-muted-foreground hover:text-signal transition-colors">Contact</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-6 mt-10 border-t border-border flex flex-col md:flex-row justify-between items-center gap-3">
                    <p className="text-xs text-muted-foreground text-center md:text-left">
                        © 2026 Stackryze domains. Open source and proud of it.
                    </p>
                    <p className="text-xs text-muted-foreground text-center md:text-right">
                        A project by <a href="https://stackryze.com" target="_blank" rel="noreferrer" className="font-bold text-foreground hover:text-signal transition-colors">Stackryze</a> (Registered MSME, India)
                    </p>
                </div>

            </div>
        </footer>
    );
}