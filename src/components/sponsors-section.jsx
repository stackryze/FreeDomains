export function SponsorsSection() {
  const sponsors = [
    {
      name: "Cloudflare",
      logo: "/Cloudflare_Logo.svg",
      url: "https://www.cloudflare.com",
    },
    {
      name: "DigitalOcean",
      logo: "/digitalocean_logo.png",
      url: "https://www.digitalocean.com",
    },
    {
      name: "HetrixTools",
      logo: "/hetrixtools.png",
      url: "https://hetrixtools.com",
    },
    {
      name: "1Password",
      logo: "/1password_Logo.png",
      url: "https://1password.com",
    },
  ];

  return (
    <section className="w-full px-6 md:px-12 lg:px-16">
      <div className="max-w-[1600px] mx-auto border-x border-b border-border bg-background">
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border">
          <div className="lg:col-span-3 px-6 py-6 flex items-center justify-center lg:justify-start">
            <p className="text-xs font-mono text-muted-foreground tracking-wide">
              Infrastructure &amp; security partners
            </p>
          </div>

          <div className="lg:col-span-9 grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border">
            {sponsors.map((sponsor) => (
              <a
                key={sponsor.name}
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-6 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-200 grayscale hover:grayscale-0"
                title={sponsor.name}
              >
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  loading="lazy"
                  className="h-6 sm:h-7 w-auto max-w-[120px] object-contain dark:brightness-0 dark:invert"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
