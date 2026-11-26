import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { useDashboard } from "@/context/dashboard-context";
import { useToast } from "@/hooks/use-toast";
import { subdomainAPI } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { ConsoleHeader } from "@/components/dashboard/ConsoleHeader";
import {
  Globe,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Github,
  Shield,
  Star,
  Lock,
} from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const AVAILABLE_DOMAINS = [
  { tld: "indevs.in", limitField: "domainLimit" },
  { tld: "sryze.cc", limitField: "sryzeDomainsLimit" },
  { tld: "ryzedns.org", limitField: "ryzeDnsDomainsLimit" },
  { tld: "nx.kg", limitField: "nxKgDomainsLimit" },
  { tld: "ryzn.pro", limitField: "ryznProDomainsLimit" },
];

export default function Register() {
  const [domain, setDomain] = useState("");
  const [rootDomain, setRootDomain] = useState("indevs.in");
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptedToS, setAcceptedToS] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(
    import.meta.env.DEV ? "dev-bypass" : null
  );

  const { subdomains, refresh } = useDashboard();
  const { user, checkAuth } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const kyc = params.get("kyc");
    const returnedDomain = params.get("domain");
    const githubUser = params.get("github");
    const returnedRoot = params.get("root");

    if (returnedRoot && AVAILABLE_DOMAINS.some((d) => d.tld === returnedRoot)) {
      setRootDomain(returnedRoot);
    } else if (kyc && !returnedRoot) {
      setRootDomain("sryze.cc");
    }

    if (returnedDomain) {
      setDomain(returnedDomain);
    }

    if (kyc === "done") {
      checkAuth();
      toast({
        title: `GitHub Verified — Welcome, @${githubUser || "you"}`,
        description:
          "You can now register free domains across all five Stackryze extensions.",
      });
    } else if (kyc === "not_starred") {
      toast({
        title: "Verification Required",
        description: `@${githubUser || "You"
          } must complete GitHub verification before registering.`,
        variant: "destructive",
      });
    } else if (kyc === "cancelled") {
      toast({
        title: "Verification Cancelled",
        description: "GitHub authorization was cancelled. Try again when ready.",
        variant: "destructive",
      });
    } else if (kyc === "already_linked") {
      toast({
        title: "GitHub Account Already Linked",
        description: githubUser
          ? `The GitHub account @${githubUser} is already linked to another Stackryze account.`
          : "This GitHub account is already linked to another Stackryze account.",
        variant: "destructive",
      });
    } else if (kyc === "too_new") {
      toast({
        title: "Account Too New",
        description: githubUser
          ? `The GitHub account @${githubUser} must be at least 1 month old.`
          : "Your GitHub account must be at least 1 month old to register.",
        variant: "destructive",
      });
    } else if (kyc === "error") {
      toast({
        title: "Verification Error",
        description: "Something went wrong during GitHub verification.",
        variant: "destructive",
      });
    } else {
      checkAuth();
    }

    if (kyc) {
      navigate(location.pathname, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUsage = useCallback(
    (tld, limitField) => {
      const used =
        subdomains?.filter(
          (s) => (s.domain || "indevs.in") === tld && !s.deletedAt
        ).length || 0;
      const limit = user?.[limitField] || 1;
      return { used, limit };
    },
    [subdomains, user]
  );

  const selectedMeta =
    AVAILABLE_DOMAINS.find((d) => d.tld === rootDomain) || AVAILABLE_DOMAINS[0];
  const { used: domainsRegistered, limit: domainLimit } = getUsage(
    selectedMeta.tld,
    selectedMeta.limitField
  );
  const canRegisterMore = domainsRegistered < domainLimit;

  const checkAvailability = useCallback(async () => {
    const domainLower = domain.toLowerCase().trim();

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

    if (domainLower.startsWith("xn--")) {
      setErrorMsg("Punycode domains (starting with 'xn--') are not supported.");
      setIsAvailable(false);
      return;
    }

    if (/[^\u0020-\u007E]/.test(domainLower)) {
      setErrorMsg(
        "Non-ASCII characters are not supported. Use lowercase letters, numbers, and hyphens."
      );
      setIsAvailable(false);
      return;
    }

    if (!/^[a-z0-9-]+$/.test(domainLower)) {
      setErrorMsg("Only lowercase letters, numbers, and hyphens allowed");
      setIsAvailable(false);
      return;
    }

    if (domainLower.startsWith("-") || domainLower.endsWith("-")) {
      setErrorMsg("Domain cannot start or end with a hyphen");
      setIsAvailable(false);
      return;
    }

    const alreadyOwned = subdomains.some(
      (s) => s.name === domainLower && (s.domain || "indevs.in") === rootDomain
    );
    if (alreadyOwned) {
      setErrorMsg(`You already own this subdomain on ${rootDomain}`);
      setIsAvailable(false);
      return;
    }

    setIsChecking(true);
    try {
      const response = await subdomainAPI.checkAvailability(
        domainLower,
        rootDomain
      );
      if (response.available) {
        setIsAvailable(true);
        setErrorMsg("");
      } else {
        setIsAvailable(false);
        setErrorMsg(response.message || "Domain is already taken");
      }
    } catch (error) {
      setErrorMsg(error.message || "Failed to check availability");
      setIsAvailable(false);
    } finally {
      setIsChecking(false);
    }
  }, [domain, rootDomain, subdomains]);

  useEffect(() => {
    if (!domain || domain.length < 3) {
      setIsAvailable(null);
      setErrorMsg("");
      return;
    }

    const timeoutId = setTimeout(() => {
      checkAvailability();
    }, 450);

    return () => clearTimeout(timeoutId);
  }, [domain, rootDomain, checkAvailability]);

  const handleRegister = async () => {
    if (!isAvailable) {
      toast({
        title: "Domain Not Available",
        description: "Choose a different available subdomain before registering.",
        variant: "destructive",
      });
      return;
    }

    if (!acceptedToS) {
      toast({
        title: "Accept Terms to Continue",
        description:
          "Read and accept the Terms of Service and Privacy Policy before registering.",
        variant: "destructive",
      });
      return;
    }

    if (!captchaToken) {
      toast({
        title: "Complete Verification",
        description: "Complete the CAPTCHA verification to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const domainLower = domain.toLowerCase().trim();
      await subdomainAPI.create({
        name: domainLower,
        domain: rootDomain,
        captchaToken,
      });

      toast({
        title: "Domain Registered",
        description: `${domainLower}.${rootDomain} is now active with free annual renewals.`,
        variant: "success",
      });

      await refresh();
      navigate("/my-domains");
    } catch (error) {
      toast({
        title: "Registration Failed",
        description:
          error.message ||
          "Unable to register this domain. Please refresh and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <ConsoleHeader
        eyebrow="New Allocation"
        title="Register Domain"
        description="Select a root namespace and claim a free subdomain with instant PowerDNS delegation."
      />

      {/* Flush 5-Column Segmented Namespace Strip */}
      <div
        className="grid grid-cols-2 sm:grid-cols-5 gap-px bg-border border-b border-border"
        role="tablist"
        aria-label="Choose root domain namespace"
      >
        {AVAILABLE_DOMAINS.map(({ tld, limitField }) => {
          const selected = rootDomain === tld;
          const { used, limit } = getUsage(tld, limitField);

          return (
            <button
              key={tld}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setRootDomain(tld)}
              className={`relative px-5 py-4 text-left flex items-center justify-between gap-2 ${selected
                ? "bg-secondary/70 text-foreground"
                : "bg-background text-muted-foreground hover:text-foreground hover:bg-secondary/25"
                }`}
            >
              <span className="font-mono text-xs sm:text-sm font-medium">
                .{tld}
              </span>
              <span
                className={`font-mono text-[11px] tabular-nums px-1.5 py-0.5 rounded border ${selected
                  ? "bg-card text-foreground border-border"
                  : "bg-secondary/50 text-muted-foreground border-border"
                  }`}
              >
                {used}/{limit}
              </span>
              {selected && (
                <span
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-foreground"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex-1 p-6 sm:p-10">
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-6 sm:p-8 space-y-6">
            {!canRegisterMore && (
              <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/25 rounded-lg">
                <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" aria-hidden="true" />
                <div className="space-y-1 text-xs sm:text-sm">
                  <p className="font-semibold text-destructive">Registration Limit Reached</p>
                  <p className="text-muted-foreground">
                    Limit of {domainLimit} .{rootDomain} domain{domainLimit === 1 ? "" : "s"} reached.{" "}
                    <a
                      href="https://discord.gg/wr7s97cfM7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground underline"
                    >
                      Join Discord
                    </a>{" "}
                    or{" "}
                    <a
                      href="mailto:support@stackryze.com"
                      className="text-foreground underline"
                    >
                      email support
                    </a>{" "}
                    to request an increase.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="register-domain-input"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Subdomain Name
                </label>
                <span className="font-mono text-xs text-muted-foreground tabular-nums">
                  {domainsRegistered} of {domainLimit} used on .{rootDomain}
                </span>
              </div>

              <div className="flex items-stretch">
                <div className="relative flex-1 min-w-0">
                  <Globe
                    className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    id="register-domain-input"
                    type="text"
                    value={domain}
                    onChange={(e) =>
                      setDomain(
                        e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
                      )
                    }
                    placeholder="your-project"
                    spellCheck={false}
                    autoComplete="off"
                    className="w-full h-11 pl-10 pr-10 rounded-l-lg border border-r-0 border-border bg-background font-mono text-sm sm:text-base text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/50"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isChecking && (
                      <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" aria-hidden="true" />
                    )}
                    {!isChecking && isAvailable === true && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" aria-hidden="true" />
                    )}
                    {!isChecking && isAvailable === false && domain.length >= 3 && (
                      <XCircle className="w-4 h-4 text-destructive" aria-hidden="true" />
                    )}
                  </div>
                </div>

                <div className="h-11 px-4 flex items-center bg-secondary border border-border rounded-r-lg font-mono text-sm text-foreground shrink-0 select-none">
                  .{rootDomain}
                </div>
              </div>

              {domain.length > 0 && domain.length < 3 && (
                <p className="text-xs text-amber-500 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Domain name must be at least 3 characters.</span>
                </p>
              )}

              {errorMsg && domain.length >= 3 && (
                <p className="text-xs text-destructive flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{errorMsg}</span>
                </p>
              )}

              {isAvailable && !errorMsg && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/25">
                  <div className="flex items-center gap-2 text-xs font-mono text-foreground">
                    <Lock className="w-3.5 h-3.5 text-emerald-500 shrink-0" aria-hidden="true" />
                    <span>
                      https://<strong>{domain}.{rootDomain}</strong>
                    </span>
                  </div>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    Available — ready to delegate
                  </span>
                </div>
              )}
            </div>

            {!user?.githubVerified && (
              <div className="bg-amber-500/10 border border-amber-500/25 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-semibold text-foreground">
                      GitHub Verification Required
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Star the Stackryze repository and verify your GitHub account to claim subdomains.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  <a
                    href="https://github.com/stackryze/FreeDomains"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-card text-foreground font-medium text-xs border border-border hover:bg-secondary rounded-full"
                  >
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" aria-hidden="true" />
                    <span>Star Repo</span>
                  </a>
                  <a
                    href={`${API_BASE}/github/kyc/start?domain=${encodeURIComponent(
                      domain
                    )}&root=${encodeURIComponent(rootDomain)}`}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-foreground text-background font-medium text-xs hover:bg-foreground/90 rounded-full"
                  >
                    <Github className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Verify GitHub</span>
                  </a>
                </div>
              </div>
            )}

            {isAvailable && user?.githubVerified && (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4 rounded-lg bg-secondary/35 border border-border px-4 py-3.5">
                  <div className="space-y-0.5">
                    <label htmlFor="tos" className="text-sm font-medium text-foreground block cursor-pointer">
                      Accept Registry Policies
                    </label>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      I agree to the{" "}
                      <a
                        href="/terms"
                        target="_blank"
                        rel="noreferrer"
                        className="text-foreground underline underline-offset-4"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="/privacy"
                        target="_blank"
                        rel="noreferrer"
                        className="text-foreground underline underline-offset-4"
                      >
                        Privacy Policy
                      </a>
                      .
                    </p>
                  </div>
                  <Switch
                    id="tos"
                    checked={acceptedToS}
                    onCheckedChange={(checked) => setAcceptedToS(Boolean(checked))}
                  />
                </div>

                {!import.meta.env.DEV && (
                  <div className="flex justify-center pt-1 min-h-[65px]">
                    <Turnstile
                      siteKey={
                        import.meta.env.VITE_TURNSTILE_SITE_KEY ||
                        "1x00000000000000000000AA"
                      }
                      onSuccess={(token) => setCaptchaToken(token)}
                      onExpire={() => setCaptchaToken(null)}
                      onError={() => setCaptchaToken(null)}
                      options={{
                        theme: "auto",
                        size: "normal",
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="px-6 sm:px-8 py-4 border-t border-border bg-secondary/25 flex flex-wrap items-center justify-end gap-4">
            <button
              type="button"
              onClick={handleRegister}
              disabled={
                !isAvailable ||
                !acceptedToS ||
                !captchaToken ||
                isSubmitting ||
                !canRegisterMore ||
                !user?.githubVerified
              }
              className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-foreground text-background font-medium text-sm hover:bg-foreground/90 disabled:opacity-40"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span>Registering…</span>
                </>
              ) : (
                <span>
                  {domain && isAvailable
                    ? `Register ${domain}.${rootDomain}`
                    : "Register Domain"}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
