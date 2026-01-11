import { useLocation } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import { LayoutDashboard } from "lucide-react";

export function Header() {
  const location = useLocation();
  const { user } = useAuth();
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <header className="fixed top-[var(--incident-height,0px)] left-0 right-0 z-50 bg-[#FFF8F0] border-b border-[#E5E3DF] w-full">
      <div className="w-full px-6 md:px-12 lg:px-16 h-16 flex items-center justify-between">

        {/* Left Side: Logo */}
        <div className="flex items-center">
          <a href="/" className="flex items-center gap-2 sm:gap-4 group">
            <div className="flex items-center gap-2 sm:gap-3">
              <img src="/stackryze_logo1.png" alt="Stackryze Logo" className="h-8 sm:h-10 md:h-12 w-auto" />
              <span className="text-sm sm:text-lg md:text-2xl font-bold text-[#1A1A1A] tracking-tight">Stackryze Domains</span>
            </div>
            <div className="h-6 sm:h-8 w-[1px] bg-[#E5E3DF]"></div>
            <div className="flex items-baseline gap-0.5">
              <div className="flex items-center font-extrabold text-xl sm:text-2xl md:text-3xl tracking-tighter gap-0.5 [-webkit-text-stroke:0.5px_#1A1A1A] sm:[-webkit-text-stroke:1px_#1A1A1A]">
                <span className="text-[#FF6B35]">IN</span>
                <span className="text-white">DE</span>
                <span className="text-[#138808]">VS</span>
              </div>
              <span className="text-base sm:text-lg md:text-xl font-bold text-[#1A1A1A] tracking-tight">.in</span>
            </div>
          </a>
        </div>

        {/* Right Side: Nav + CTA */}
        <div className="flex items-center gap-8">
          {/* Navigation - Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/about" className="text-[#1A1A1A] hover:text-[#FF6B35] transition-colors duration-150 font-medium text-sm lg:text-base">
              About
            </a>
            <a href="https://domain-docs.stackryze.com" target="_blank" className="text-[#1A1A1A] hover:text-[#FF6B35] transition-colors duration-150 font-medium text-sm lg:text-base">
              Docs
            </a>
            <a href="https://status.stackryze.com/status/stackryze" target="_blank" className="text-[#1A1A1A] hover:text-[#FF6B35] transition-colors duration-150 font-medium text-sm lg:text-base">
              Status
            </a>
            <a href="https://discord.gg/wr7s97cfM7" target="_blank" className="text-[#1A1A1A] hover:text-[#FF6B35] transition-colors duration-150 font-medium text-sm lg:text-base">
              Discord
            </a>
            <a
              href="https://github.com/stackryze/FreeDomains"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1A1A1A] hover:text-[#FF6B35] transition-colors duration-150 font-medium text-sm lg:text-base"
            >
              GitHub
            </a>
          </div>

          {/* CTA Button */}
          {user ? (
            <a
              href="/overview"
              className="bg-[#1A1A1A] text-white px-4 py-2 md:px-6 md:py-2.5 font-bold uppercase text-xs md:text-sm tracking-widest border-2 border-[#1A1A1A] hover:bg-[#FFD23F] hover:text-[#1A1A1A] transition-all duration-150 shadow-[4px_4px_0px_0px_#1A1A1A] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </a>
          ) : (
            <a
              href="/login"
              className="bg-[#FFD23F] text-[#1A1A1A] px-4 py-2 md:px-6 md:py-2.5 font-bold uppercase text-xs md:text-sm tracking-widest border-2 border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#FFD23F] hover:border-[#1A1A1A] transition-all duration-150 shadow-[4px_4px_0px_0px_#1A1A1A] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
            >
              Get Started
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
