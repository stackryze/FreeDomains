"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  {
    label: "Platform",
    items: [
      {
        title: "Free Domains",
        href: "#extensions",
        description: "Claim a free subdomain in under a minute.",
      },
      {
        title: "Managed DNS",
        href: "#features",
        description: "PowerDNS with full record coverage.",
      },
      {
        title: "Status & SLAs",
        href: "#stats",
        description: "99.9% uptime, nameservers in NYC & HYD.",
      },
    ],
  },
  {
    label: "Solutions",
    items: [
      {
        title: "For developers",
        href: "#usecases",
        description: "Side projects, MVPs, homelabs and more.",
      },
      {
        title: "For students",
        href: "#usecases",
        description: "Hackathons, course work, demos — zero cost.",
      },
      {
        title: "Self-hosting",
        href: "#features",
        description: "Point subdomains at your own infrastructure.",
      },
    ],
  },
  {
    label: "Resources",
    items: [
      {
        title: "Documentation",
        href: "#",
        description: "Guides, API reference, and recipes.",
      },
      {
        title: "Changelog",
        href: "#",
        description: "What we shipped this week.",
      },
      {
        title: "GitHub",
        href: "#",
        description: "Open source, every line of code is public.",
      },
    ],
  },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-200",
        scrolled
          ? "bg-background/90 border-b border-border/60"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-sm font-medium tracking-tight"
        >
          <span className="relative grid h-7 w-7 place-items-center overflow-hidden rounded-md bg-foreground text-background">
            <span className="font-display text-base leading-none">S</span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </span>
          <span>Stackryze</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV.map((group) => (
            <div key={group.label} className="group relative">
              <button
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                type="button"
              >
                {group.label}
              </button>
              <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                <div className="w-[340px] rounded-xl border border-border bg-popover p-2 shadow-xl shadow-foreground/5">
                  {group.items.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="group/item flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-accent"
                    >
                      <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-md bg-muted text-foreground transition-colors group-hover/item:bg-foreground group-hover/item:text-background">
                        <ArrowUpRight className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {item.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Toggle theme"
            type="button"
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
            Log in
          </Button>
          <Button size="sm" className="hidden sm:inline-flex">
            Get started
          </Button>
          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-md text-foreground md:hidden"
            aria-label="Toggle menu"
            type="button"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border bg-background md:hidden"
          >
            <div className="space-y-4 p-5">
              {NAV.map((group) => (
                <div key={group.label}>
                  <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {group.label}
                  </div>
                  <div className="space-y-1">
                    {group.items.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1">
                  Log in
                </Button>
                <Button className="flex-1">Get started</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
