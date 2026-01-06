import { ArrowRight, Loader2, CheckCircle, XCircle, Heart } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export function HeroSection() {
  const [domain, setDomain] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const checkAvailability = async () => {
    const domainLower = domain.toLowerCase().trim();

    // Reset states
    setErrorMsg("");
    setIsAvailable(null);

    // Validation
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
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/subdomains/check/${domainLower}`);

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
    } catch (error) {
      // Network error or other issue
      setErrorMsg("Unable to check availability");
      setIsAvailable(null);
    } finally {
      setIsChecking(false);
    }
  };

  const handleClaimClick = () => {
    if (domain && isAvailable) {
      // Redirect to login with domain pre-filled
      navigate('/login');
    } else {
      checkAvailability();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleClaimClick();
    }
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-center pt-20 pb-12 bg-[#FFF8F0] bg-[url('/pixel_art_large.png')] bg-cover bg-center bg-no-repeat overflow-hidden">
      {/* Darker overlay for white text readability */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      {/* Container with generous padding */}
      <div className="relative z-10 w-full px-6 md:px-12 lg:px-16 flex-1 flex flex-col justify-center">
        {/* Two columns - Constrained slightly to 1600px to avoid massive center gap on ultrawide */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center max-w-[1600px] mx-auto w-full">

          {/* Left: Text */}
          <div className="space-y-8">
            <p className="text-base font-bold uppercase tracking-widest text-[#FF6B35]">
              Free Domains for Developers


            </p>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight text-white tracking-tight">
              A FREE NAME<br />
              <span className="text-[#FF6B35]">FOR EVERYONE.</span>
            </h1>

            <p className="text-lg md:text-xl text-white max-w-3xl">
              Made for <span className="font-bold text-white">the world</span>, by Indians.
              <br className="hidden md:block" />
              100% Open Source and cost-free. No strings attached.
            </p>
          </div>

          {/* Right: Search */}
          <div className="w-full">
            <div className="bg-white border-4 border-[#1A1A1A] p-6 shadow-[8px_8px_0px_0px_#FF6B35] w-full">
              <label className="block text-xs font-bold uppercase mb-4 text-[#1A1A1A]">
                Check Availability
              </label>

              <div className="space-y-3">
                <div className="flex border-2 border-[#1A1A1A] relative">
                  <input
                    type="text"
                    placeholder="yourname"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-3 py-3 text-base md:text-lg font-mono min-w-0"
                  />
                  <span className="px-3 py-3 bg-[#E5E3DF] text-[#6B6B6B] font-mono text-xs md:text-sm whitespace-nowrap flex items-center">
                    .indevs.in
                  </span>
                  {isChecking && (
                    <div className="absolute right-24 top-1/2 -translate-y-1/2">
                      <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                    </div>
                  )}
                </div>

                <button
                  onClick={handleClaimClick}
                  disabled={isChecking || (domain.length > 0 && domain.length < 3)}
                  className="w-full bg-[#FFD23F] text-[#1A1A1A] py-3 px-4 font-bold uppercase text-xs hover:bg-[#1A1A1A] hover:text-[#FFD23F] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isChecking ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Checking...
                    </>
                  ) : isAvailable ? (
                    <>
                      Login to Claim
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Check Availability
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Status Messages */}
                {domain && domain.length > 0 && domain.length < 3 && (
                  <p className="text-xs text-amber-600 flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    Domain must be at least 3 characters
                  </p>
                )}
                {errorMsg && domain.length >= 3 && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    {errorMsg}
                  </p>
                )}
                {isAvailable && !errorMsg && (
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-bold">{domain}.indevs.in</span> is available!
                  </p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t-2 border-[#1A1A1A]/10 text-center">
                <Link to="/donate" className="inline-flex items-center gap-2 text-xs font-bold text-[#FF6B35] hover:text-[#1A1A1A] hover:underline transition-colors">
                  <Heart className="w-3 h-3 fill-[#FF6B35]" />
                  Help us keep this free — Donate
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Scrolling Benefits Ticker - Full Width */}
      <div className="relative z-10 mt-10 md:mt-16 w-full border-t-2 border-b-2 border-[#E5E3DF] bg-white">
        <div className="flex gap-4 md:gap-6 animate-scroll min-w-max py-3 border-x-0">
          {[
            "INSTANT ACTIVATION",
            "FULL DNS CONTROL",
            "NO BILLING DETAILS",
            "MADE FOR INDIA",
            "100% OPEN SOURCE",
            "FREE FOREVER",
            "INSTANT ACTIVATION",
            "FULL DNS CONTROL",
            "NO BILLING DETAILS",
            "MADE FOR INDIA",
            "100% OPEN SOURCE",
            "FREE FOREVER",
          ].map((text, idx) => (
            <div key={idx} className="flex-shrink-0 bg-white px-3 md:px-6 py-2 border-r-2 border-[#E5E3DF] last:border-r-0">
              <span className="font-bold text-[#1A1A1A] tracking-wider text-sm md:text-base whitespace-nowrap">
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </section>
  );
}
