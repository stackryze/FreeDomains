import { Link } from "react-router-dom";

export function Footer() {
    return (
        <footer className="bg-background text-foreground border-t border-border font-sans">
            <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 py-12">
                <div className="flex flex-col md:flex-row justify-between gap-10 md:items-start">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <Link to="/" className="inline-flex items-center gap-3">
                            <div className="flex items-center gap-2.5">
                                <img
                                    src="/stackryze_logo_black.png"
                                    alt="Stackryze Logo"
                                    className="h-7 w-auto dark:hidden"
                                />
                                <img
                                    src="/stackryze_logo_white.png"
                                    alt="Stackryze Logo"
                                    className="h-7 w-auto hidden dark:block"
                                />
                                <span className="text-base font-semibold text-foreground tracking-[-0.02em]">
                                    Stackryze Domains
                                </span>
                            </div>
                            <span className="h-4 w-px bg-border" aria-hidden="true" />
                            <span className="font-mono text-xs font-medium tracking-tight">
                                <span className="text-[#FF9933]">IN</span>
                                <span className="text-foreground">DE</span>
                                <span className="text-[#138808]">VS</span>
                                <span className="text-muted-foreground">.in</span>
                            </span>
                        </Link>

                        <p className="text-muted-foreground text-xs sm:text-sm max-w-sm leading-relaxed">
                            Free subdomains for developers and creators, with authoritative PowerDNS delegation.
                        </p>

                        <div className="space-y-1 pt-1">
                            <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                                Verified Official Emails
                            </p>
                            <div className="flex flex-col gap-0.5 font-mono text-xs text-muted-foreground">
                                <span>support@stackryze.com</span>
                                <span>reportabuse@stackryze.com</span>
                                <span>no-reply@stackryze.com</span>
                            </div>
                        </div>
                    </div>

                    {/* Links Section */}
                    <div className="flex flex-wrap gap-10 sm:gap-16">
                        <div>
                            <h4 className="font-medium text-xs uppercase tracking-wider mb-3 text-foreground">
                                Platform
                            </h4>
                            <ul className="space-y-2 text-xs sm:text-sm">
                                <li>
                                    <a
                                        href="https://docs.stackryze.com"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Documentation
                                    </a>
                                </li>
                                <li>
                                    <Link
                                        to="/whois"
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        WHOIS Lookup
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/about"
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        About
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-medium text-xs uppercase tracking-wider mb-3 text-foreground">
                                Legal
                            </h4>
                            <ul className="space-y-2 text-xs sm:text-sm">
                                <li>
                                    <Link
                                        to="/terms"
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Terms
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/privacy"
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Privacy
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/aup"
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Usage Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/abuse"
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Report Abuse
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-medium text-xs uppercase tracking-wider mb-3 text-foreground">
                                Connect
                            </h4>
                            <ul className="space-y-2 text-xs sm:text-sm">
                                <li>
                                    <a
                                        href="https://github.com/stackryze/FreeDomains"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        GitHub
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://github.com/sponsors/sudheerbhuvana"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Sponsor
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://discord.gg/wr7s97cfM7"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Discord
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="mailto:support@stackryze.com"
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Contact
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-6 mt-10 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
                    <p>© 2026 Stackryze Domains. Open source on GitHub.</p>
                    <p>
                        A project by{" "}
                        <a
                            href="https://stackryze.com"
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium text-foreground hover:underline underline-offset-4"
                        >
                            Stackryze
                        </a>{" "}
                        (Registered MSME, India)
                    </p>
                </div>
            </div>
        </footer>
    );
}
