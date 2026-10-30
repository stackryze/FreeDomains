export function Footer() {
    return (
        <footer className="bg-[var(--ink)] text-[var(--ink-foreground)] py-8 px-6 border-t border-[var(--ink-border)]">
            <div className="w-full max-w-[1600px] mx-auto">

                <div className="flex flex-col md:flex-row justify-between gap-8 mb-4 md:items-start">

                    {/* Brand Section */}
                    <div>
                        <a href="/" className="flex items-center gap-3 group mb-4">
                            <img src="/stackryze_logo_white.png" alt="Stackryze Logo" className="h-10 w-auto" />
                            <span className="text-xl font-semibold text-[var(--ink-foreground)] tracking-tight">Stackryze Domains</span>
                        </a>
                        <p className="text-[var(--ink-foreground)]/70 text-sm mb-4 max-w-sm">
                            Free subdomains for developers. Built by developers.
                        </p>

                        <div className="space-y-0.5 mb-2">
                            <h5 className="text-signal font-medium text-xs uppercase tracking-wide mb-1 font-mono">Verified senders</h5>
                            <p className="text-[var(--ink-foreground)]/70 text-sm font-mono">support@stackryze.com</p>
                            <p className="text-[var(--ink-foreground)]/70 text-sm font-mono">reportabuse@stackryze.com</p>
                            <p className="text-[var(--ink-foreground)]/70 text-sm font-mono">no-reply@stackryze.com</p>
                            <p className="text-[var(--ink-foreground)]/70 text-xs max-w-sm mt-2 leading-relaxed">
                                We never send mail from any other domain or prefix.
                            </p>
                        </div>
                    </div>

                    {/* Links Section */}
                    <div className="flex gap-10 md:gap-20 pr-2 md:pr-0">
                        {/* Platform */}
                        <div>
                            <h4 className="font-medium text-sm mb-3 text-[var(--ink-foreground)]">Platform</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="https://domain-docs.stackryze.com" target="_blank" className="text-[var(--ink-foreground)]/70 hover:text-signal transition-colors">Documentation</a></li>
                                <li><a href="/whois" className="text-[var(--ink-foreground)]/70 hover:text-signal transition-colors">WHOIS Lookup</a></li>
                                <li><a href="/about" className="text-[var(--ink-foreground)]/70 hover:text-signal transition-colors">About</a></li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h4 className="font-medium text-sm mb-3 text-[var(--ink-foreground)]">Legal</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="/terms" className="text-[var(--ink-foreground)]/70 hover:text-signal transition-colors">Terms</a></li>
                                <li><a href="/privacy" className="text-[var(--ink-foreground)]/70 hover:text-signal transition-colors">Privacy</a></li>
                                <li><a href="/aup" className="text-[var(--ink-foreground)]/70 hover:text-signal transition-colors">Usage Policy</a></li>
                                <li><a href="/abuse" className="text-[var(--ink-foreground)]/70 hover:text-signal transition-colors">Report Abuse</a></li>
                            </ul>
                        </div>

                        {/* Connect */}
                        <div>
                            <h4 className="font-medium text-sm mb-3 text-[var(--ink-foreground)]">Connect</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="https://github.com/stackryze/FreeDomains" target="_blank" rel="noreferrer" className="text-[var(--ink-foreground)]/70 hover:text-signal transition-colors">GitHub</a></li>
                                <li><a href="https://github.com/sponsors/sudheerbhuvana" target="_blank" rel="noreferrer" className="text-[var(--ink-foreground)]/70 hover:text-signal transition-colors">Sponsor ❤️</a></li>
                                <li><a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-[var(--ink-foreground)]/70 hover:text-signal transition-colors">Twitter</a></li>
                                <li><a href="https://discord.gg/wr7s97cfM7" target="_blank" rel="noreferrer" className="text-[var(--ink-foreground)]/70 hover:text-signal transition-colors">Discord Community</a></li>
                                <li><a href="mailto:support@stackryze.com" className="text-[var(--ink-foreground)]/70 hover:text-signal transition-colors">Contact</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-4 border-t border-[var(--ink-border)] flex flex-col md:flex-row justify-between items-center gap-2">
                    <p className="text-xs text-[var(--ink-foreground)]/70 text-center md:text-left">
                        © 2026 Stackryze Domains. Open source and proud of it.
                    </p>
                    <p className="text-xs text-[var(--ink-foreground)]/70 text-center md:text-right">
                        A project by <a href="https://stackryze.com" target="_blank" rel="noreferrer" className="font-medium text-[var(--ink-foreground)] hover:text-signal transition-colors">Stackryze</a> (Registered MSME, India)
                    </p>
                </div>

            </div>
        </footer>
    );
}