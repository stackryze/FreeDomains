import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import { LayoutDashboard, Sun, Moon, Menu, X, Heart, ChevronDown, ArrowUpRight, Network, Globe, Server } from "lucide-react";
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
      className={`fixed top-[var(--incident-height,0px)] left-0 right-0 z-50 w-full transition-all duration-300 bg-background/80 backdrop-blur-xl border-b ${
        isScrolled
          ? "border-border shadow-sm dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          : "border-border/40 shadow-none"
      }`}
    >
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 h-18 sm:h-20 flex items-center justify-between">
        
        {/* Left: Logo */}
        <div className="flex items-center shrink-0">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/stackryze_logo_black.png"
              alt="Stackryze Logo"
              className="h-8 sm:h-9 md:h-10 w-auto dark:hidden"
            />
            <img
              src="/stackryze_logo_white.png"
              alt="Stackryze Logo"
              className="h-8 sm:h-9 md:h-10 w-auto hidden dark:block"
            />
            <span className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">
              Stackryze <span className="text-signal font-black">Domains</span>
            </span>
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          
          {/* Products Dropdown */}
          <div className="relative" ref={productsRef}>
            <button
              onClick={() => setProductsOpen(!productsOpen)}
              className={`flex items-center gap-1.5 text-sm font-bold transition-colors duration-150 ${
                productsOpen ? "text-signal" : "text-foreground/80 hover:text-signal"
              }`}
            >
              <span>Products</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${productsOpen ? "rotate-180" : ""}`} />
            </button>

            {productsOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[380px] rounded-2xl border border-border bg-card/95 backdrop-blur-2xl p-5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="mb-3 pb-3 border-b border-border/60">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                    PRODUCTS
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Infrastructure that ships together. Domains and StackNS are free for everyone. StackHost is on the way.
                  </p>
                </div>

                <div className="flex flex-col divide-y divide-border/40">
                  {PRODUCTS.map((prod) => {
                    const Icon = prod.icon;
                    const content = (
                      <div className="flex items-center justify-between p-2.5 -mx-1.5 rounded-xl hover:bg-secondary/60 transition-colors group">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-secondary border border-border flex items-center justify-center text-foreground shrink-0 group-hover:border-foreground/20">
                            <Icon className="w-4 h-4 text-signal" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-foreground">{prod.name}</span>
                              {prod.active && (
                                <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-signal/10 text-signal border border-signal/20">
                                  Current
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{prod.description}</p>
                          </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
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

          <a
            href="/about"
            className="text-foreground/80 hover:text-signal transition-colors duration-150 font-bold text-sm"
          >
            About
          </a>
          <a
            href="https://domain-docs.stackryze.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/80 hover:text-signal transition-colors duration-150 font-bold text-sm"
          >
            Docs
          </a>
          <Link
            to="/whois"
            className="text-foreground/80 hover:text-signal transition-colors duration-150 font-bold text-sm"
          >
            WHOIS
          </Link>
          <a
            href="https://status.stackryze.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/80 hover:text-signal transition-colors duration-150 font-bold text-sm"
          >
            Status
          </a>
          <a
            href="https://discord.gg/wr7s97cfM7"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/80 hover:text-signal transition-colors duration-150 font-bold text-sm"
          >
            Discord
          </a>
          <a
            href="https://github.com/stackryze/FreeDomains"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/80 hover:text-signal transition-colors duration-150 font-bold text-sm"
          >
            GitHub
          </a>
          <Link
            to="/donate"
            className="text-rose-500 hover:text-rose-400 transition-colors duration-150 font-extrabold text-sm flex items-center gap-1.5"
          >
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            <span>Donate</span>
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2.5 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 hidden dark:block text-slate-200" />
            <Moon className="h-5 w-5 block dark:hidden text-slate-700" />
          </button>

          {/* CTA Button */}
          {user ? (
            <Link
              to="/overview"
              className="px-5 py-2.5 sm:px-6 sm:py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black font-bold text-sm tracking-tight hover:bg-neutral-800 dark:hover:bg-slate-200 transition-all duration-300 shadow-md flex items-center gap-2 cursor-pointer shrink-0"
              title="Dashboard"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="px-6 py-2.5 sm:px-7 sm:py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black font-bold text-sm tracking-tight hover:bg-neutral-800 dark:hover:bg-slate-200 transition-all duration-300 shadow-md flex items-center justify-center cursor-pointer shrink-0"
            >
              Get Started
            </Link>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl text-foreground hover:bg-secondary transition-colors lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-2xl px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200 shadow-2xl">
          <nav className="flex flex-col space-y-3 font-bold text-base text-foreground/85">
            <a
              href="/about"
              onClick={() => setMobileOpen(false)}
              className="py-1 hover:text-signal transition-colors"
            >
              About
            </a>
            <a
              href="https://dns.stackryze.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="py-1 hover:text-signal transition-colors"
            >
              Stackryze DNS
            </a>
            <a
              href="https://domain-docs.stackryze.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="py-1 hover:text-signal transition-colors"
            >
              Docs
            </a>
            <Link
              to="/whois"
              onClick={() => setMobileOpen(false)}
              className="py-1 hover:text-signal transition-colors"
            >
              WHOIS Lookup
            </Link>
            <a
              href="https://status.stackryze.com/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="py-1 hover:text-signal transition-colors"
            >
              Status
            </a>
            <a
              href="https://discord.gg/wr7s97cfM7"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="py-1 hover:text-signal transition-colors"
            >
              Discord Community
            </a>
            <a
              href="https://github.com/stackryze/FreeDomains"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="py-1 hover:text-signal transition-colors"
            >
              GitHub Repository
            </a>
            <Link
              to="/donate"
              onClick={() => setMobileOpen(false)}
              className="py-1 text-rose-500 hover:text-rose-400 font-extrabold flex items-center gap-1.5"
            >
              <Heart className="w-4 h-4 fill-rose-500" />
              <span>Donate &amp; Sponsor</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
