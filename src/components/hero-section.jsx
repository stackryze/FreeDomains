import { ArrowRight, Loader2, CheckCircle, XCircle, Heart, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

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
  const sectionRef = useRef(null);
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  // Parallax: the grid drifts slower than scroll — a quiet depth cue, not a
  // gimmick. Disabled entirely under prefers-reduced-motion.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const gridY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 60]);

  // Cursor-aware spotlight — follows the pointer over the hero, a quiet
  // "this surface is alive" cue common to modern dev-tool sites.
  const [spotlight, setSpotlight] = useState({ x: 50, y: 0 });
  const handleMouseMove = (e) => {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setSpotlight({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

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
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative w-full flex flex-col pt-16 pb-20 md:pt-20 md:pb-24 bg-background overflow-hidden"
    >
      {/* Signature surface: a circuit grid, drifting slightly on scroll */}
      <motion.div aria-hidden className="bg-grid pointer-events-none absolute inset-0 z-0" style={{ y: gridY }} />

      {/* Cursor-aware spotlight — quiet, follows the pointer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(500px circle at ${spotlight.x}% ${spotlight.y}%, color-mix(in oklab, var(--signal) 8%, transparent), transparent 70%)`,
        }}
      />

      {/* Container with generous padding */}
      <div className="relative z-10 w-full px-6 md:px-12 lg:px-16">
        {/* Two columns - Constrained slightly to 1600px to avoid massive center gap on ultrawide */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center max-w-[1600px] mx-auto w-full">

          {/* Left: Text — staggers in once on load, not on every scroll */}
          <motion.div
            className="space-y-6 lg:pr-8"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-signal opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-signal" />
              </span>
              resolvers online, zero cost
            </span>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] text-foreground tracking-tight">
              A name on the web for <span className="text-gradient-signal">everyone.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Claim a free subdomain, point your own DNS records, and ship. No subscriptions, no limits that matter — built and run by developers.
            </p>
          </motion.div>

          {/* Right: Search */}
          <motion.div
            className="w-full space-y-5"
            ref={dropdownRef}
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >

            <label className="block text-xs font-medium text-muted-foreground font-mono">
              check availability
            </label>

            <div className="flex border border-border rounded-xl relative z-50 focus-within:ring-2 focus-within:ring-signal/40 focus-within:border-signal transition-all bg-card">
              <input
                type="text"
                placeholder="yourname"
                value={domain}
                onChange={(e) => { setDomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')); setIsAvailable(null); setErrorMsg(''); }}
                onKeyPress={handleKeyPress}
                className="flex-1 px-5 py-4 text-base md:text-lg font-mono min-w-0 outline-none text-foreground placeholder:text-muted-foreground/60 bg-transparent"
              />
              {/* TLD Dropdown */}
              <div className="relative flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="h-full px-4 py-4 text-foreground font-mono text-sm md:text-base flex items-center gap-2 border-l border-border bg-secondary/60 hover:bg-secondary transition-colors whitespace-nowrap rounded-r-xl"
                >
                  {selectedTld.label}
                  <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] bg-popover border border-border rounded-xl overflow-hidden z-50 w-48 origin-top-right animate-in fade-in zoom-in-95 duration-150">
                    <div className="py-1.5 px-1.5 flex flex-col gap-0.5">
                      {DOMAINS.map((d) => (
                        <button
                          key={d.tld}
                          type="button"
                          onClick={() => { setSelectedTld(d); setDropdownOpen(false); setIsAvailable(null); setErrorMsg(''); }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-mono text-sm transition-colors duration-150 ${selectedTld.tld === d.tld
                            ? 'text-popover-foreground bg-accent font-medium'
                            : 'text-muted-foreground hover:text-popover-foreground hover:bg-accent/60'
                            }`}
                        >
                          {d.label}
                          {selectedTld.tld === d.tld && (
                            <CheckCircle className="w-4 h-4 flex-shrink-0 text-signal" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {isChecking && (
                <div className="absolute right-44 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-5 h-5 text-signal animate-spin" />
                </div>
              )}
            </div>

            <button
              onClick={handleClaimClick}
              id="check-availability-btn"
              disabled={isChecking || (domain.length > 0 && domain.length < 3)}
              className="w-full rounded-xl py-4 px-6 font-medium text-sm bg-signal text-signal-foreground hover:bg-signal/90 shadow-signal transition-all duration-150 active:scale-[0.97] flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100"
            >
              {isChecking ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Checking...
                </>
              ) : isAvailable ? (
                <>
                  Log in to claim
                  <ArrowRight className="w-5 h-5" />
                </>
              ) : (
                <>
                  Check availability
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Status Messages */}
            {domain && domain.length > 0 && domain.length < 3 && (
              <p className="text-sm font-medium text-warning flex items-center gap-1.5">
                <XCircle className="w-4 h-4" />
                Domain must be at least 3 characters
              </p>
            )}
            {errorMsg && domain.length >= 3 && (
              <p className="text-sm font-medium text-destructive flex items-center gap-1.5">
                <XCircle className="w-4 h-4" />
                {errorMsg}
              </p>
            )}
            {isAvailable && !errorMsg && (
              <p className="text-sm font-medium text-signal flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                <span className="font-semibold text-foreground">{domain}{selectedTld.label}</span> is available
              </p>
            )}

            <div className="signal-trace my-2" aria-hidden />

            <div className="pt-2 flex flex-col items-center gap-3 text-center">
              <p className="text-muted-foreground text-base">We're a small team of students keeping the internet open. Your support keeps this free for everyone.</p>
              <Link to="/donate" className="inline-flex items-center gap-2 text-base font-medium text-destructive hover:text-destructive/80 transition-colors group">
                <Heart className="w-4 h-4 fill-destructive group-hover:fill-destructive/80 transition-all" />
                Support the project
              </Link>
            </div>
          </motion.div>

        </div>

      </div>

    </section>
  );
}
