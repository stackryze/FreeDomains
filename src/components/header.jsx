import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useAuth } from "../context/auth-context";
import { LayoutDashboard, Sun, Moon, Menu, X, ArrowUpRight } from "lucide-react";
import { useTheme } from "next-themes";
import { Magnetic } from "./magnetic";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "https://dns.stackryze.com", label: "Stackryze DNS", external: true },
  { href: "https://domain-docs.stackryze.com", label: "Docs", external: true },
  { href: "https://status.stackryze.com/", label: "Status", external: true },
  { href: "https://discord.gg/wr7s97cfM7", label: "Discord", external: true },
  { href: "https://github.com/stackryze/FreeDomains", label: "GitHub", external: true },
];

function NavLink({ href, label, external, active }) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`relative text-sm font-medium transition-colors duration-150 ${active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
    >
      {label}
      {active && (
        <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-signal rounded-full" aria-hidden />
      )}
    </a>
  );
}

export function Header() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the mobile menu on route change, and lock body scroll while open.
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Close on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const CTA = user ? (
    <Magnetic strength={10}>
      <a
        href="/overview"
        className="px-4 py-2 sm:px-5 md:px-5 md:py-2.5 rounded-md bg-signal text-signal-foreground font-medium text-sm tracking-tight hover:bg-signal/90 transition-all duration-150 active:scale-[0.97] flex items-center gap-2 whitespace-nowrap"
        title="Dashboard"
      >
        <LayoutDashboard className="w-4 h-4" />
        <span className="hidden sm:inline">Dashboard</span>
      </a>
    </Magnetic>
  ) : (
    <Magnetic strength={10}>
      <a
        href="/login"
        className="px-5 py-2 md:px-6 md:py-2.5 rounded-md bg-signal text-signal-foreground font-medium text-sm tracking-tight hover:bg-signal/90 transition-all duration-150 active:scale-[0.97] flex items-center justify-center whitespace-nowrap"
      >
        Get Started
      </a>
    </Magnetic>
  );

  return (
    <header className={`fixed top-[var(--incident-height,0px)] left-0 right-0 z-50 w-full transition-all duration-300 bg-background/80 backdrop-blur-xl border-b ${isScrolled ? "border-border shadow-sm" : "border-transparent shadow-none"}`}>
      <div className="w-full px-4 sm:px-6 md:px-12 lg:px-16 h-16 flex items-center justify-between">

        {/* Left Side: Logo */}
        <a href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
          <img src="/stackryze_logo_black.png" alt="Stackryze Logo" className="h-8 sm:h-10 md:h-10 w-auto dark:hidden" />
          <img src="/stackryze_logo_white.png" alt="Stackryze Logo" className="h-8 sm:h-10 md:h-10 w-auto hidden dark:block" />
          <span className="text-base sm:text-lg md:text-xl font-semibold text-foreground tracking-tight">Stackryze Domains</span>
        </a>

        {/* Center: Navigation — desktop only */}
        <nav className="hidden lg:flex items-center gap-7 xl:gap-8">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.label} {...link} active={location.pathname === link.href} />
          ))}
        </nav>

        {/* Right Side: Donate + Theme + CTA + mobile trigger */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="/donate"
            className="hidden lg:flex items-center gap-1 text-sm font-semibold text-destructive hover:text-destructive/80 transition-colors duration-150"
          >
            ❤️ Donate
          </a>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-md hover:bg-accent transition-colors hidden sm:inline-flex"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 hidden dark:block text-muted-foreground" />
            <Moon className="h-5 w-5 block dark:hidden text-muted-foreground" />
          </button>

          <div className="hidden sm:block">{CTA}</div>

          {/* Mobile menu trigger — the gap this redesign fixes: nav links
              were previously unreachable below the `lg` breakpoint. */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="lg:hidden p-2 rounded-md hover:bg-accent transition-colors"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden border-t border-border bg-background/95 backdrop-blur-xl"
          >
            <nav className="flex flex-col px-4 sm:px-6 py-4 overscroll-contain max-h-[calc(100dvh-4rem)] overflow-y-auto">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className={`flex items-center justify-between py-3 text-base font-medium border-b border-border last:border-b-0 transition-colors ${location.pathname === link.href ? "text-signal" : "text-foreground"
                    }`}
                >
                  {link.label}
                  {link.external && <ArrowUpRight className="w-4 h-4 text-muted-foreground" />}
                </a>
              ))}
              <a
                href="/donate"
                className="flex items-center gap-1.5 py-3 text-base font-semibold text-destructive"
              >
                ❤️ Donate
              </a>

              <div className="flex items-center justify-between gap-3 pt-3 mt-1 border-t border-border">
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-accent transition-colors text-sm font-medium text-muted-foreground"
                >
                  <Sun className="h-4 w-4 hidden dark:block" />
                  <Moon className="h-4 w-4 block dark:hidden" />
                  Toggle theme
                </button>
                {CTA}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
