
export function SponsorsSection() {
    const sponsors = [
        {
            name: "Cloudflare",
            logo: "/Cloudflare_Logo.svg",
            url: "https://www.cloudflare.com",
            description: "Cloudflare provides a global network to make everything you connect to the Internet secure, private, fast, and reliable.",
            color: "#F38020"
        },
        {
            name: "DigitalOcean",
            logo: "/digitalocean_logo.png",
            url: "https://www.digitalocean.com",
            description: "DigitalOcean simplifies cloud computing so developers and businesses can spend more time building software.",
            color: "#008bcf"
        },
        {
            name: "HetrixTools",
            logo: "/hetrixtools.png",
            url: "https://hetrixtools.com",
            description: "HetrixTools provides Uptime Monitoring, Blacklist Monitoring, and Server Resource Monitoring to help webmasters improve efficiency.",
            color: "#FF3D3D"
        },
        {
            name: "1Password",
            logo: "/1password_Logo.png",
            url: "https://1password.com",
            description: "1Password is the easiest way to store and use strong passwords. Log in to sites and fill forms securely with a single click.",
            color: "#0094F5"
        }
    ];

    return (
        <section className="w-full py-10 md:py-14 bg-transparent">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
                <div className="mb-8 text-center">
                    <h2 className="text-xs font-mono font-medium text-muted-foreground tracking-widest uppercase">
                        Supported by industry leaders
                    </h2>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16">
                    {sponsors.map((sponsor, idx) => (
                        <a
                            key={idx}
                            href={sponsor.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-10 opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
                            title={sponsor.name}
                        >
                            <img
                                src={sponsor.logo}
                                alt={sponsor.name}
                                className="h-full w-auto object-contain dark:brightness-0 dark:invert"
                            />
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
