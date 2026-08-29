import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useDashboard } from "@/context/dashboard-context";
import { useToast } from "@/hooks/use-toast";
import { subdomainAPI } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { Globe, CheckCircle, XCircle, AlertCircle, Loader2, Sparkles, Info, Github, Shield, Star } from "lucide-react";
import { Turnstile } from '@marsidev/react-turnstile';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Register() {
    const [domain, setDomain] = useState("");
    const [rootDomain, setRootDomain] = useState("indevs.in");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [isAvailable, setIsAvailable] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [acceptedToS, setAcceptedToS] = useState(false);
    const [captchaToken, setCaptchaToken] = useState(import.meta.env.DEV ? "dev-bypass" : null);
    const captchaRef = useRef(null);

    const availableDomains = ["indevs.in", "sryze.cc", "ryzedns.org", "nx.kg", "ryzn.pro"];

    const { subdomains, refresh } = useDashboard();
    const { user, checkAuth } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    // On mount: handle return from GitHub KYC OAuth + pre-fill domain from URL params
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const kyc = params.get('kyc');
        const returnedDomain = params.get('domain');
        const githubUser = params.get('github');
        const returnedRoot = params.get('root') || 'sryze.cc'; // default to sryze.cc for backwards compat

        if (returnedDomain) {
            setDomain(returnedDomain);
            setRootDomain(returnedRoot);
        }

        if (kyc === 'done') {
            // Refresh user so githubVerified is up-to-date
            checkAuth();
            toast({
                title: `🎉 GitHub Verified! Welcome, @${githubUser || 'you'}`,
                description: 'GitHub verification confirmed! You can now register your sryze.cc, ryzedns.org, nx.kg, or ryzn.pro domain.',
                className: 'bg-green-50 border-green-200 text-green-900'
            });
        } else if (kyc === 'not_starred') {
            toast({
                title: '🛡️ Verification Required',
                description: `@${githubUser || 'You'} haven\'t verified your GitHub account yet. Connect your GitHub to verify and try again!`,
                variant: 'destructive'
            });
        } else if (kyc === 'cancelled') {
            toast({
                title: 'Verification Cancelled',
                description: 'GitHub authorization was cancelled. Try again when ready.',
                variant: 'destructive'
            });
        } else if (kyc === 'already_linked') {
            toast({
                title: '⛔ GitHub Account Already Used',
                description: githubUser
                    ? `The GitHub account @${githubUser} is already linked to another Stackryze account.`
                    : 'This GitHub account is already linked to another Stackryze account.',
                variant: 'destructive'
            });
        } else if (kyc === 'too_new') {
            toast({
                title: 'Account Too New',
                description: githubUser
                    ? `The GitHub account @${githubUser} is too new. Accounts must be at least 1 month old to prevent abuse.`
                    : 'Your GitHub account is too new. Accounts must be at least 1 month old to prevent abuse.',
                variant: 'destructive'
            });
        } else if (kyc === 'error') {
            toast({
                title: 'Verification Error',
                description: 'Something went wrong during GitHub verification. Please try again.',
                variant: 'destructive'
            });
        } else {
            // No KYC param — normal mount, refresh user for latest limits
            checkAuth();
        }

        // Clean up URL params so toasts don't replay on refresh
        if (kyc) {
            navigate(location.pathname, { replace: true });
        }
    }, []);

    // Calculate domain usage based on selected root domain.
    // For indevs.in: unverified users are capped at 1 free domain regardless of stored domainLimit.
    // githubVerified covers BOTH old manually-approved users AND new star-KYC users.
    //
    // IMPORTANT: For ryzedns.org, sryze.cc, nx.kg, and ryzn.pro we count from the actual subdomains list
    // (same source of truth as Domains.jsx) rather than the counter fields (ryzeDnsDomainsCount /
    // sryzeDomainsCount / nxKgDomainsCount / ryznProDomainsCount) which can drift if a DNS failure rollback or timing issue occurs.
    const domainLimit = rootDomain === 'sryze.cc'
        ? (user?.sryzeDomainsLimit || 1)
        : rootDomain === 'ryzedns.org'
            ? (user?.ryzeDnsDomainsLimit || 1)
            : rootDomain === 'nx.kg'
                ? (user?.nxKgDomainsLimit || 1)
                : rootDomain === 'ryzn.pro'
                    ? (user?.ryznProDomainsLimit || 1)
                    : (user?.githubVerified ? (user?.domainLimit || 1) : 1);
    const domainsRegistered = rootDomain === 'sryze.cc'
        ? (subdomains?.filter(s => s.domain === 'sryze.cc' && !s.deletedAt).length || 0)
        : rootDomain === 'ryzedns.org'
            ? (subdomains?.filter(s => s.domain === 'ryzedns.org' && !s.deletedAt).length || 0)
            : rootDomain === 'nx.kg'
                ? (subdomains?.filter(s => s.domain === 'nx.kg' && !s.deletedAt).length || 0)
                : rootDomain === 'ryzn.pro'
                    ? (subdomains?.filter(s => s.domain === 'ryzn.pro' && !s.deletedAt).length || 0)
                    : (user?.domainsCount || 0);
    const canRegisterMore = domainsRegistered < domainLimit;
    const usagePercentage = (domainsRegistered / domainLimit) * 100;


    // Auto-check availability as user types
    const checkAvailability = useCallback(async () => {
        const domainLower = domain.toLowerCase().trim();

        // Validation
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

        // Block Punycode domains (xn-- prefix)
        if (domainLower.startsWith('xn--')) {
            setErrorMsg("Punycode/internationalized domains (starting with 'xn--') are not supported. Please use a standard ASCII domain name.");
            setIsAvailable(false);
            return;
        }

        // Check for non-ASCII characters (Punycode/IDN not supported)
        if (!/^[\x00-\x7F]*$/.test(domainLower)) {
            setErrorMsg("Internationalized domains (non-ASCII characters) are not supported. Please use only English letters, numbers, and hyphens.");
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

        // Check if already owned (on the same root domain)
        const alreadyOwned = subdomains.some(s => s.name === domainLower && (s.domain || 'indevs.in') === rootDomain);
        if (alreadyOwned) {
            setErrorMsg(`You already own this subdomain on ${rootDomain}`);
            setIsAvailable(false);
            return;
        }

        setIsChecking(true);
        try {
            // Updated API call to check specific root domain
            const response = await subdomainAPI.checkAvailability(domainLower, rootDomain);
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
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [domain, rootDomain, checkAvailability]);

    const handleRegister = async () => {
        if (!isAvailable) {
            toast({
                title: "Domain Not Available",
                description: "This domain is already taken or reserved. Please choose a different name and check availability.",
                variant: "destructive"
            });
            return;
        }

        if (!acceptedToS) {
            toast({
                title: "Accept Terms to Continue",
                description: "You must read and accept the Terms of Service and Privacy Policy before registering your domain.",
                variant: "destructive"
            });
            return;
        }

        if (!captchaToken) {
            toast({
                title: "Complete CAPTCHA",
                description: "Please complete the CAPTCHA verification to prove you're human.",
                variant: "destructive"
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const domainLower = domain.toLowerCase().trim();


            await subdomainAPI.create({
                name: domainLower,
                domain: rootDomain,
                captchaToken
            });

            toast({
                title: "Domain Registered Successfully! 🎉",
                description: `${domainLower}.${rootDomain} is now yours for 1 year! You can configure DNS settings from your dashboard.`,
                className: "bg-[#e6f4ea] border-green-200 text-green-900"
            });

            await refresh();
            navigate('/my-domains');
        } catch (error) {
            toast({
                title: "Registration Failed",
                description: error.message || "Unable to register this domain. It may have been taken by someone else. Please refresh and try again.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl">
            {/* Header */}
            <div className="mb-7">
                <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-1">Account</p>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">Register a Domain</h1>
                <p className="text-sm text-slate-900 dark:text-white mt-1">Claim your free subdomain in seconds — valid for 1 year.</p>
            </div>

            {/* Domain Usage Indicator */}
            <div className={`mb-5 border rounded-xl p-4 backdrop-blur-md transition-colors ${!canRegisterMore ? 'bg-red-50/90 dark:bg-red-500/10 border-red-200/50 dark:border-red-500/20' : 'bg-white/60 dark:bg-white/5 border-slate-200/80 dark:border-white/10'
                }`}>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Info className={`w-4 h-4 ${!canRegisterMore ? 'text-red-500 dark:text-red-400' : 'text-slate-900 dark:text-white'}`} />
                        <span className={`font-semibold text-sm ${!canRegisterMore ? 'text-red-900 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                            {rootDomain} Usage: {domainsRegistered} / {domainLimit}
                        </span>
                    </div>
                    {!canRegisterMore && (
                        <span className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase">Limit Reached</span>
                    )}
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-200 dark:bg-white/10 rounded-full h-2.5 mb-2">
                    <div
                        className={`h-2.5 rounded-full transition-all ${usagePercentage >= 100 ? 'bg-red-600 dark:bg-red-500' : usagePercentage >= 80 ? 'bg-amber-500' : 'bg-green-600 dark:bg-green-500'
                            }`}
                        style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                    ></div>
                </div>

                {!canRegisterMore ? (
                    <p className="text-xs text-red-700 dark:text-red-400 font-medium mt-2">
                        0 {rootDomain} domains remaining
                    </p>
                ) : (
                    <p className="text-xs text-blue-700 dark:text-blue-400 font-medium mt-2">
                        {domainLimit - domainsRegistered} {rootDomain} {domainLimit - domainsRegistered === 1 ? 'domain' : 'domains'} remaining
                    </p>
                )}
            </div>

            {/* Registration Card */}
            <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md p-5 md:p-6 rounded-xl border border-slate-200/80 dark:border-white/10">
                {!canRegisterMore && (
                    <div className="mb-5 flex items-start gap-3 p-4 bg-red-50/90 dark:bg-red-500/10 border border-red-200/50 dark:border-red-500/20 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-red-900 dark:text-red-400 mb-1">
                                Registration disabled
                            </p>
                            <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                                You've reached your limit of {domainLimit} {rootDomain} domain{domainLimit === 1 ? '' : 's'}.
                            </p>
                            <p className="text-sm text-red-700 dark:text-red-300 font-medium mt-1">
                                Need more domains?{' '}
                                <a href="https://discord.gg/wr7s97cfM7" target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-red-900 dark:hover:text-red-400">Join our Discord</a>{' '}
                                or <a href="mailto:support@stackryze.com" className="underline font-bold hover:text-red-900 dark:hover:text-red-400">email support</a>{' '}
                                to request a limit increase.
                            </p>
                        </div>
                    </div>
                )}
                {/* Domain Input */}
                <div className="space-y-6">
                    <div>
                        <label className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            Choose Your Domain Name
                        </label>
                        <div className="flex flex-col sm:flex-row items-stretch gap-0">
                            <div className="relative w-full">
                                <Input
                                    type="text"
                                    value={domain}
                                    onChange={(e) => setDomain(e.target.value)}
                                    placeholder="your-awesome-project"
                                    className="font-mono text-sm h-11 pr-10 rounded-t-lg rounded-b-none sm:rounded-l-lg sm:rounded-r-none border-b-0 sm:border-b sm:border-r-0 focus:z-10 w-full bg-white/50 dark:bg-black/40 border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white"
                                />
                                {isChecking && (
                                    <Loader2 className="w-4 h-4 text-slate-400 animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
                                )}
                                {!isChecking && isAvailable === true && (
                                    <CheckCircle className="w-4 h-4 text-green-500 absolute right-3 top-1/2 -translate-y-1/2" />
                                )}
                                {!isChecking && isAvailable === false && domain.length >= 3 && (
                                    <XCircle className="w-4 h-4 text-red-500 absolute right-3 top-1/2 -translate-y-1/2" />
                                )}
                            </div>
                            <div className="relative h-11 -mt-[1px] sm:mt-0 min-w-[130px]">
                                <button
                                    type="button"
                                    onClick={() => setDropdownOpen(o => !o)}
                                    onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
                                    className="w-full h-full flex items-center justify-between gap-2 px-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-sm font-bold focus:outline-none cursor-pointer rounded-b-lg rounded-t-none sm:rounded-r-lg sm:rounded-l-none border border-transparent shadow-sm"
                                >
                                    <span className="font-mono">.{rootDomain}</span>
                                    <svg className={`w-3.5 h-3.5 text-white dark:text-slate-900 flex-shrink-0 transition-transform duration-150 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden shadow-lg bg-white/90 dark:bg-[#1A1A1A]/90 backdrop-blur-xl">
                                        {availableDomains.map(d => (
                                            <button
                                                key={d}
                                                type="button"
                                                onMouseDown={() => { setRootDomain(d); setDropdownOpen(false); }}
                                                className={`w-full text-left px-4 py-3 font-mono font-bold text-sm transition-colors ${d === rootDomain
                                                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                                        : 'bg-transparent text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10'
                                                    }`}
                                            >
                                                .{d}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Status Messages */}
                        {domain.length > 0 && domain.length < 3 && (
                            <div className="mt-4 flex items-start gap-3 p-4 bg-amber-50/90 dark:bg-amber-500/10 border border-amber-200/50 dark:border-amber-500/20 rounded-lg">
                                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                                    Domain name must be at least 3 characters. Keep typing!
                                </p>
                            </div>
                        )}
                        {errorMsg && domain.length >= 3 && (
                            <div className="mt-4 flex items-start gap-3 p-4 bg-red-50/90 dark:bg-red-500/10 border border-red-200/50 dark:border-red-500/20 rounded-lg">
                                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <p className="text-sm font-medium text-red-700 dark:text-red-400">{errorMsg}</p>
                            </div>
                        )}
                        {isAvailable && !errorMsg && (
                            <div className="mt-4 flex items-start gap-3 p-4 bg-green-50/90 dark:bg-green-500/10 border border-green-200/50 dark:border-green-500/20 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-green-800 dark:text-green-400 mb-1">
                                        ✨ {domain}.{rootDomain} is available!
                                    </p>
                                    <p className="text-xs text-green-700 dark:text-green-500 font-medium">
                                        {!user?.githubVerified
                                            ? 'Verify your account with GitHub to unlock this domain.'
                                            : 'This domain is yours for the taking. Accept the terms below to claim it.'
                                        }
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* KYC Gate — shown for:
                        - sryze.cc: always if not verified (immediately, no search needed)
                        - ryzedns.org: always if not verified (immediately, no search needed)
                        - indevs.in: when limit reached and not yet verified */}
                    {(() => {
                        const needsKyc = !user?.githubVerified;
                        if (!needsKyc) return null;

                        const isSryzeOrRyzeDns = rootDomain === 'sryze.cc' || rootDomain === 'ryzedns.org' || rootDomain === 'nx.kg' || rootDomain === 'ryzn.pro';
                        return (
                            <div className="bg-amber-50/50 dark:bg-amber-500/10 border border-amber-200/50 dark:border-amber-500/20 rounded-xl p-4 sm:p-5">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-500/20 border border-amber-200 dark:border-amber-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-slate-900 dark:text-white font-extrabold text-base mb-1">
                                            GitHub Verification Required
                                        </h3>
                                        <p className="text-slate-900 dark:text-white opacity-80 text-xs mb-3">
                                            Star our repo and verify to prevent abuse and keep domains free.
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            {/* Step 1: Star Repo */}
                                            <a
                                                href="https://github.com/stackryze/FreeDomains"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white dark:bg-white/10 text-slate-900 dark:text-white font-bold text-xs border border-slate-200 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/20 shadow-sm transition duration-200 cursor-pointer rounded-lg"
                                            >
                                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                                Star Repo
                                            </a>
                                            {/* Step 2: Verify */}
                                            <a
                                                href={`${API_BASE}/github/kyc/start?domain=${encodeURIComponent(domain)}&root=${encodeURIComponent(rootDomain)}`}
                                                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-xs hover:bg-slate-800 dark:hover:bg-slate-200 shadow-sm transition duration-200 cursor-pointer rounded-lg"
                                            >
                                                <Github className="w-3.5 h-3.5" />
                                                Verify
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}

                    {/* Terms of Service — only shown if not gated by KYC */}
                    {isAvailable &&
                        user?.githubVerified && (
                            <>
                                {/* Registration Period Info */}
                                <div className="bg-slate-50 dark:bg-black/40 border border-slate-200/80 dark:border-white/10 rounded-lg p-3">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-semibold text-slate-900 dark:text-white opacity-80">Registration Period:</span>
                                            <span className="text-xs font-bold text-slate-900 dark:text-white">1 Year (Renewable)</span>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-slate-200 dark:border-white/10 pt-2">
                                            <span className="text-xs font-semibold text-slate-900 dark:text-white opacity-80">Expires On:</span>
                                            <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                                                {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Terms Acceptance */}
                                <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-200/80 dark:border-white/10 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <Checkbox
                                            id="tos"
                                            checked={acceptedToS}
                                            onCheckedChange={(checked) => setAcceptedToS(checked)}
                                            className="mt-0.5 h-4 w-4 bg-white dark:bg-black/40 border-slate-300 dark:border-white/20"
                                        />
                                        <label htmlFor="tos" className="text-xs text-slate-900 dark:text-white leading-tight cursor-pointer flex-1 font-medium opacity-90">
                                            I agree to the{" "}
                                            <a href="/terms" target="_blank" className="font-bold underline hover:text-orange-500 transition-colors">
                                                Terms of Service
                                            </a>
                                            {" "}and{" "}
                                            <a href="/privacy" target="_blank" className="font-bold underline hover:text-orange-500 transition-colors">
                                                Privacy Policy
                                            </a>
                                        </label>
                                    </div>
                                </div>

                                {/* Cloudflare Turnstile */}
                                {!import.meta.env.DEV && (
                                    <div className="flex justify-center my-4 min-h-[65px]">
                                        <Turnstile
                                            siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"}
                                            onSuccess={(token) => setCaptchaToken(token)}
                                            onExpire={() => setCaptchaToken(null)}
                                            onError={() => setCaptchaToken(null)}
                                            options={{
                                                theme: 'light',
                                                size: 'normal',
                                            }}
                                        />
                                    </div>
                                )}
                            </>
                        )}


                    {/* Register Button — disabled when KYC gate is active */}
                    <button
                        onClick={handleRegister}
                        disabled={
                            !isAvailable || !acceptedToS || !captchaToken || isSubmitting || !canRegisterMore ||
                            !user?.githubVerified
                        }
                        className="w-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-extrabold py-3 text-sm rounded-lg shadow-sm hover:bg-slate-800 dark:hover:bg-slate-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Registering Your Domain...
                            </>
                        ) : (
                            <>
                                <Globe className="w-4 h-4 mr-2" />
                                Register Domain
                            </>
                        )}
                    </button>

                    {/* Info Notice */}
                    <div className="bg-blue-50/50 dark:bg-blue-500/10 border border-blue-200/50 dark:border-blue-500/20 p-4 rounded-lg">
                        <div className="flex gap-2">
                            <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                            <div className="text-xs text-blue-700 dark:text-blue-400">
                                <p className="font-bold mb-1">What happens next?</p>
                                <ul className="space-y-0.5 font-medium opacity-90">
                                    <li>• Your domain will be registered instantly</li>
                                    <li>• Configure DNS nameservers from the management page</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}