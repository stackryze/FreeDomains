
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
        <section className="w-full py-16 bg-[#FFF8F0] border-b-2 border-[#E5E7EB]">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-[#1A1A1A] mb-4">
                        Sponsored <span className="text-[#FF6B35]">By</span>
                    </h2>
                    <p className="max-w-2xl mx-auto text-base md:text-lg text-[#6B6B6B] leading-relaxed">
                        These industry leaders help us keep Indevs free, open-source, and accessible to everyone.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {sponsors.map((sponsor, idx) => (
                        <div
                            key={idx}
                            className="bg-white border-4 border-[#1A1A1A] p-6 rounded-2xl hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-150 flex flex-col items-center text-center h-full"
                            style={{
                                boxShadow: `8px 8px 0px 0px ${sponsor.color}`
                            }}
                        >
                            <a
                                href={sponsor.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mb-6 h-12 flex items-center justify-center w-full"
                            >
                                <img
                                    src={sponsor.logo}
                                    alt={sponsor.name}
                                    className="h-full w-auto object-contain max-w-[140px]"
                                />
                            </a>

                            <p className="text-sm text-[#1A1A1A]/80 leading-relaxed font-medium">
                                <a
                                    href={sponsor.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-bold hover:underline"
                                    style={{ color: sponsor.color }}
                                >
                                    {sponsor.name}
                                </a>
                                {' '}{sponsor.description.replace(sponsor.name + ' ', '')}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
