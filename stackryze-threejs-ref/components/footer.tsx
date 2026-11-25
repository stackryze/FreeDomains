import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { GithubIcon, TwitterIcon } from "@/components/ui/brand-icons";

const footerLinks = [
  {
    title: "Services",
    items: [
      { label: "Free domains", href: "#extensions" },
      { label: "DNS hosting", href: "#features" },
      { label: "DNS checker", href: "#" },
      { label: "NS propagation", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
  {
    title: "Extensions",
    items: [
      { label: ".indevs.in", href: "#" },
      { label: ".sryze.cc", href: "#" },
      { label: ".ryzedns.org", href: "#" },
      { label: ".nx.kg", href: "#" },
    ],
  },
  {
    title: "Developers",
    items: [
      { label: "Documentation", href: "#" },
      { label: "GitHub", href: "#" },
      { label: "FreeDomains repo", href: "#" },
      { label: "DNS repo", href: "#" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Open source", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border">
      {/* Subtle footer ambient */}
      <div
        aria-hidden
        className="section-bg-footer-tint pointer-events-none absolute inset-0 -z-10"
      />
      <div className="bg-dots pointer-events-none absolute inset-0 -z-10 opacity-20 fade-top" />
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          {/* Brand column */}
          <div className="col-span-2 lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 text-sm font-medium tracking-tight"
            >
              <span className="grid h-7 w-7 place-items-center rounded-md bg-foreground font-display text-base text-background">
                S
              </span>
              <span>Stackryze</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground text-pretty">
              Affordable, reliable infrastructure for the modern web. Made by
              a small team that ships.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {[
                { icon: GithubIcon, label: "GitHub" },
                { icon: TwitterIcon, label: "Twitter" },
                { icon: MessageCircle, label: "Discord" },
              ].map(({ icon: Icon, label }) => (
                <Link
                  key={label}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {group.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-foreground/80 transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Big wordmark / signature */}
        <div className="mt-16 overflow-hidden border-t border-border pt-8">
          <div className="font-display select-none text-[14vw] leading-none tracking-tighter text-foreground/10 sm:text-[10vw]">
            Stackryze
          </div>
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <div>© {new Date().getFullYear()} Stackryze. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-foreground">
              Privacy policy
            </Link>
            <Link href="#" className="hover:text-foreground">
              Terms of service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
