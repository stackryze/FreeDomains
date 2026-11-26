import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import {
  LayoutDashboard,
  Sun,
  Moon,
  Menu,
  X,
  Heart,
  ChevronDown,
  ArrowUpRight,
  Network,
  Globe,
  Server,
} from "lucide-react";
import { useTheme } from "next-themes";

const PRODUCTS = [
  {
    name: "StackNS",
    description: "Modern DNS hosting for everyone.",
    href: "https://dns.stackryze.com",
    external: true,
    icon: Network,
  },
  {
    name: "Domains",
    description: "A name for everyone online.",
    href: "/",
    external: false,
    icon: Globe,
    active: true,
  },
  {
    name: "StackHost",
    description: "A game hosting platform for true gamers.",
    href: "https://stackryze.com",
    external: true,
    icon: Server,
  },
];

export function Header() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const productsRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (productsRef.current && !productsRef.current.contains(e.target)) {
        setProductsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`fixed top-[var(--incident-height,0px)] left-0 right-0 z-50 w-full bg-background/85 backdrop-blur-md border-b ${isScrolled ? "border-border" : "border-border/60"
        }`}
    >
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 h-16 flex items-center justify-between">
        {/* Left: Brand */}
        <div className="flex items-center shrink-0">
          <Link to="/" className="flex items-center gap-2.5">
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
            <span className="text-base sm:text-[17px] font-semibold text-foreground tracking-[-0.02em]">
              Stackryze <span className="text-muted-foreground font-normal">Domains</span>
            </span>
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          <div className="relative" ref={productsRef}>
            <button
              type="button"
              onClick={() => setProductsOpen(!productsOpen)}
              className={`flex items-center gap-1 text-sm font-medium transition-colors ${productsOpen
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <span>Products</span>
              <ChevronDown
                className={`w-3.5 h-3.5 ${productsOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>

            {productsOpen && (
              <div className="absolute top-full left-0 mt-2.5 w-96 rounded-lg border border-border bg-popover p-2 shadow-2xl z-50">
                <p className="px-3 pt-2 pb-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Stackryze Products
                </p>

                <div className="flex flex-col gap-0.5">
                  {PRODUCTS.map((prod) => {
                    const Icon = prod.icon;
                    const content = (
                      <div className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-md hover:bg-secondary/80 transition-colors group">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <Icon className="w-4.5 h-4.5 text-muted-foreground group-hover:text-foreground shrink-0" aria-hidden="true" />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-[13px] text-foreground">
                                {prod.name}
                              </span>
                              {prod.active && (
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                  Current
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                              {prod.description}
                            </p>
                          </div>
                        </div>
                        {prod.external && (
                          <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground shrink-0" aria-hidden="true" />
                        )}
                      </div>
                    );

                    return prod.external ? (
                      <a
                        key={prod.name}
                        href={prod.href}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setProductsOpen(false)}
                      >
                        {content}
                      </a>
                    ) : (
                      <Link
                        key={prod.name}
                        to={prod.href}
                        onClick={() => setProductsOpen(false)}
                      >
                        {content}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <Link
            to="/about"
            className="text-muted-foreground hover:text-foreground transition-colors font-medium text-sm"
          >
            About
          </Link>
          <a
            href="https://docs.stackryze.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors font-medium text-sm"
          >
            Docs
          </a>
          <Link
            to="/whois"
            className="text-muted-foreground hover:text-foreground transition-colors font-medium text-sm"
          >
            WHOIS
          </Link>
          <a
            href="https://status.stackryze.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors font-medium text-sm"
          >
            Status
          </a>
          <a
            href="https://discord.gg/wr7s97cfM7"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors font-medium text-sm"
          >
            Discord
          </a>
          <a
            href="https://github.com/stackryze/FreeDomains"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors font-medium text-sm"
          >
            GitHub
          </a>
          <Link
            to="/donate"
            className="text-muted-foreground hover:text-foreground transition-colors font-medium text-sm inline-flex items-center gap-1.5"
          >
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" aria-hidden="true" />
            <span>Sponsor</span>
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 hidden dark:block" aria-hidden="true" />
            <Moon className="h-4 w-4 block dark:hidden" aria-hidden="true" />
          </button>

          {user ? (
            <Link
              to="/overview"
              className="px-4 py-1.5 rounded-full bg-foreground text-background font-medium text-sm hover:bg-foreground/90 transition-colors inline-flex items-center gap-1.5 shrink-0"
              title="Dashboard"
            >
              <LayoutDashboard className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Dashboard</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="px-4 py-1.5 rounded-full bg-foreground text-background font-medium text-sm hover:bg-foreground/90 transition-colors inline-flex items-center justify-center shrink-0"
            >
              Get Started
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-md text-foreground hover:bg-secondary lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background px-6 py-5 space-y-4">
          <nav className="flex flex-col space-y-2.5 font-medium text-sm text-foreground">
            <Link to="/about" onClick={() => setMobileOpen(false)} className="py-1 text-muted-foreground hover:text-foreground">
              About
            </Link>
            <a
              href="https://dns.stackryze.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="py-1 text-muted-foreground hover:text-foreground"
            >
              Stackryze DNS
            </a>
            <a
              href="https://docs.stackryze.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="py-1 text-muted-foreground hover:text-foreground"
            >
              Docs
            </a>
            <Link to="/whois" onClick={() => setMobileOpen(false)} className="py-1 text-muted-foreground hover:text-foreground">
              WHOIS Lookup
            </Link>
            <a
              href="https://status.stackryze.com/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="py-1 text-muted-foreground hover:text-foreground"
            >
              Status
            </a>
            <a
              href="https://discord.gg/wr7s97cfM7"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="py-1 text-muted-foreground hover:text-foreground"
            >
              Discord
            </a>
            <a
              href="https://github.com/stackryze/FreeDomains"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="py-1 text-muted-foreground hover:text-foreground"
            >
              GitHub
            </a>
            <Link
              to="/donate"
              onClick={() => setMobileOpen(false)}
              className="py-1 text-muted-foreground hover:text-foreground flex items-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" aria-hidden="true" />
              <span>Sponsor Project</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
