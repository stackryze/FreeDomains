import { useState, useEffect } from "react";

import { useAuth } from "../context/auth-context";
import { LayoutDashboard, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export function Header() {

  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-[var(--incident-height,0px)] left-0 right-0 z-50 w-full transition-all duration-300 bg-white/70 dark:bg-white/5 backdrop-blur-xl border-b ${isScrolled ? "border-slate-200 dark:border-white/10 shadow-sm dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)]" : "border-transparent shadow-none"}`}>
      <div className="w-full px-4 sm:px-6 md:px-12 lg:px-16 h-16 flex items-center justify-between">

        {/* Left Side: Logo */}
        <div className="flex items-center">
          <a href="/" className="flex items-center gap-2 sm:gap-3 group">
            <img src="/stackryze_logo_black.png" alt="Stackryze Logo" className="h-8 sm:h-10 md:h-10 w-auto dark:hidden" />
            <img src="/stackryze_logo_white.png" alt="Stackryze Logo" className="h-8 sm:h-10 md:h-10 w-auto hidden dark:block" />
            <span className="text-base sm:text-lg md:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Stackryze Domains</span>
          </a>
        </div>

        {/* Right Side: Nav + CTA */}
        <div className="flex items-center gap-8">
          {/* Navigation - Desktop */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-8">
            <a href="/about" className="text-[#1A1A1A] dark:text-white hover:text-[#FF6B35] transition-colors duration-150 font-bold text-sm lg:text-sm">
              About
            </a>
            <a href="https://dns.stackryze.com" target="_blank" rel="noopener noreferrer" className="text-[#1A1A1A] dark:text-white hover:text-[#FF6B35] transition-colors duration-150 font-bold text-sm lg:text-sm">
              Stackryze DNS
            </a>
            <a href="https://domain-docs.stackryze.com" target="_blank" className="text-[#1A1A1A] dark:text-white hover:text-[#FF6B35] transition-colors duration-150 font-bold text-sm lg:text-sm">
              Docs
            </a>
            <a href="https://status.stackryze.com/" target="_blank" className="text-[#1A1A1A] dark:text-white hover:text-[#FF6B35] transition-colors duration-150 font-bold text-sm lg:text-sm">
              Status
            </a>
            <a href="https://discord.gg/wr7s97cfM7" target="_blank" className="text-[#1A1A1A] dark:text-white hover:text-[#FF6B35] transition-colors duration-150 font-bold text-sm lg:text-sm">
              Discord
            </a>
            <a
              href="https://github.com/stackryze/FreeDomains"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1A1A1A] dark:text-slate-200 hover:text-[#FF6B35] dark:hover:text-[#FF6B35] transition-colors duration-150 font-bold text-sm lg:text-sm"
            >
              GitHub
            </a>
            <a href="/donate" className="text-rose-500 hover:text-rose-600 transition-colors duration-150 font-extrabold text-sm lg:text-sm flex items-center gap-1">
              ❤️ Donate
            </a>
          </div>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 hidden dark:block text-slate-200" />
            <Moon className="h-5 w-5 block dark:hidden text-slate-700" />
          </button>

          {/* CTA Button */}
          {user ? (
            <a
              href="/overview"
              className="px-4 py-2 sm:px-5 sm:py-2 md:px-5 md:py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black font-bold text-sm tracking-tight hover:bg-neutral-800 dark:hover:bg-slate-200 transition-all duration-300 shadow-md flex items-center gap-2 cursor-pointer"
              title="Dashboard"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </a>
          ) : (
            <a
              href="/login"
              className="px-5 py-2 md:px-6 md:py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black font-bold text-sm tracking-tight hover:bg-neutral-800 dark:hover:bg-slate-200 transition-all duration-300 shadow-md flex items-center justify-center cursor-pointer"
            >
              Get Started
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
