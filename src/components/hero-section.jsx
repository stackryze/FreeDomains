import { ArrowRight, Loader2, CheckCircle, XCircle, Heart, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { NextJSWhiteButton } from "./ui/tailwindcss-buttons";

const DOMAINS = [
  { tld: "indevs.in", label: ".indevs.in" },
  { tld: "sryze.cc", label: ".sryze.cc" },
  { tld: "ryzedns.org", label: ".ryzedns.org" },
  { tld: "nx.kg", label: ".nx.kg" },
  { tld: "ryzn.pro", label: ".ryzn.pro" },
];

export function HeroSection() {
  const [domain, setDomain] = useState("");
  const [selectedTld, setSelectedTld] = useState(DOMAINS[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const checkAvailability = async () => {
    const domainLower = domain.toLowerCase().trim();

    setErrorMsg("");
    setIsAvailable(null);

    if (!domainLower) return;

    if (domainLower.length < 3) {
      setErrorMsg("Domain must be at least 3 characters");
      setIsAvailable(false);
      return;
    }

    if (domainLower.length > 63) {
      setErrorMsg("Domain must be less than 63 characters");
      setIsAvailable(false);
      return;
    }

    if (!/^[a-z0-9-]+$/.test(domainLower)) {
      setErrorMsg("Only lowercase letters, numbers, and hyphens allowed");
      setIsAvailable(false);
      return;
    }

    if (domainLower.startsWith('-') || domainLower.endsWith('-')) {
      setErrorMsg("Domain cannot start or end with a hyphen");
      setIsAvailable(false);
      return;
    }

    setIsChecking(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/subdomains/check/${domainLower}?domain=${selectedTld.tld}`
      );

      if (response.status === 429) {
        setErrorMsg("You are searching too fast! Please wait a minute.");
        setIsAvailable(false);
        return;
      }

      const data = await response.json();
      if (data.available) {
        setIsAvailable(true);
        setErrorMsg("");
      } else {
        setIsAvailable(false);
        setErrorMsg(data.message || "Domain is already taken");
      }
    } catch {
      setErrorMsg("Unable to check availability");
      setIsAvailable(null);
    } finally {
      setIsChecking(false);
    }
  };

  const handleClaimClick = () => {
    if (domain && isAvailable) {
      navigate('/login');
    } else {
      checkAvailability();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleClaimClick();
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-center pt-20 pb-12 bg-[#0A0A0B] bg-[url('/pixel_art_large.png')] bg-cover bg-center bg-no-repeat overflow-hidden">
      {/* Subtle overlay for white text readability */}
      <div className="absolute inset-0 bg-black/50 z-0"></div>

      {/* Container with generous padding */}
      <div className="relative z-10 w-full px-6 md:px-12 lg:px-16 flex-1 flex flex-col justify-center">
        {/* Two columns - Constrained slightly to 1600px to avoid massive center gap on ultrawide */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center max-w-[1600px] mx-auto w-full">

          {/* Left: Text */}
          <div className="space-y-6 lg:pr-8">
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white tracking-tight">
              A NAME FOR EVERYONE <span className="text-gradient-signal italic">ONLINE.</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-200 max-w-2xl leading-relaxed">
              A public namespace for everyone to belong online. Made for the world. 100% free and open-source.
            </p>
          </div>

          {/* Right: Search */}
          <div className="w-full space-y-5" ref={dropdownRef}>

            <label className="block text-xs font-bold uppercase tracking-widest text-white/50">
              Check Availability
            </label>

            <div className="flex border border-white/20 rounded-xl relative z-50 focus-within:ring-2 focus-within:ring-[#4FBE7A]/50 focus-within:border-[#4FBE7A] transition-all bg-[#121214]/70 backdrop-blur-xl">
              <input
                type="text"
                placeholder="yourname"
                value={domain}
                onChange={(e) => { setDomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')); setIsAvailable(null); setErrorMsg(''); }}
                onKeyPress={handleKeyPress}
                className="flex-1 px-5 py-4 text-base md:text-lg font-mono min-w-0 outline-none text-white placeholder:text-white/30 bg-transparent"
              />
              {/* TLD Dropdown */}
              <div className="relative flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="h-full px-4 py-4 text-white/90 font-mono text-sm md:text-base flex items-center gap-2 border-l border-white/20 bg-white/5 hover:bg-white/10 transition-colors whitespace-nowrap rounded-r-xl"
                >
                  {selectedTld.label}
                  <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] bg-[#121214]/90 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden z-50 w-48 origin-top-right animate-in fade-in zoom-in-95 duration-200">
                    <div className="py-1.5 px-1.5 flex flex-col gap-0.5">
                      {DOMAINS.map((d) => (
                        <button
                          key={d.tld}
                          type="button"
                          onClick={() => { setSelectedTld(d); setDropdownOpen(false); setIsAvailable(null); setErrorMsg(''); }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-mono text-sm transition-all duration-200 ${selectedTld.tld === d.tld
                            ? 'text-white bg-white/15 font-semibold shadow-sm'
                            : 'text-white/70 hover:text-white hover:bg-white/10'
                            }`}
                        >
                          {d.label}
                          {selectedTld.tld === d.tld && (
                            <CheckCircle className="w-4 h-4 flex-shrink-0 text-[#4FBE7A]" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {isChecking && (
                <div className="absolute right-44 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-5 h-5 text-[#4FBE7A] animate-spin" />
                </div>
              )}
            </div>

            <NextJSWhiteButton
              onClick={handleClaimClick}
              id="check-availability-btn"
              disabled={isChecking || (domain.length > 0 && domain.length < 3)}
              className="w-full rounded-xl py-4 px-6 font-extrabold uppercase tracking-widest text-sm text-slate-800 hover:text-slate-900 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[0_4px_14px_0_rgb(0,0,0,10%)]"
            >
              {isChecking ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Checking...
                </>
              ) : isAvailable ? (
                <>
                  Login to Claim
                  <ArrowRight className="w-5 h-5" />
                </>
              ) : (
                <>
                  Check Availability
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </NextJSWhiteButton>

            {/* Status Messages */}
            {domain && domain.length > 0 && domain.length < 3 && (
              <p className="text-sm font-medium text-amber-400 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" />
                Domain must be at least 3 characters
              </p>
            )}
            {errorMsg && domain.length >= 3 && (
              <p className="text-sm font-medium text-red-400 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" />
                {errorMsg}
              </p>
            )}
            {isAvailable && !errorMsg && (
              <p className="text-sm font-medium text-emerald-400 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                <span className="font-bold text-white">{domain}{selectedTld.label}</span> is available!
              </p>
            )}

            <div className="pt-4 flex flex-col items-center gap-3 text-center">
              <p className="text-white text-lg">We're a small team of students with a passion for making the internet more open and accessible. Your support helps us keep this project free and continue improving it for everyone.</p>
              <Link to="/donate" className="inline-flex items-center gap-2 text-lg font-bold text-rose-400 hover:text-rose-300 transition-colors group">
                <Heart className="w-5 h-5 fill-rose-400 group-hover:fill-rose-300 transition-all" />
                Support the project
              </Link>
            </div>
          </div>

        </div>

      </div>

 
    </section>
  );
}
