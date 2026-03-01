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
import { Globe, CheckCircle, XCircle, AlertCircle, Loader2, Sparkles, Info, Github } from "lucide-react";
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
    const [captchaToken, setCaptchaToken] = useState(null);
    const captchaRef = useRef(null);

    const availableDomains = ["indevs.in", "sryze.cc"];

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
                description: 'Star confirmed! You can now register your sryze.cc domain.',
                className: 'bg-green-50 border-green-200 text-green-900'
            });
        } else if (kyc === 'not_starred') {
            toast({
                title: '⭐ Star Required',
                description: `@${githubUser || 'You'} haven\'t starred stackryze/FreeDomains yet. Star it on GitHub and try again!`,
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
                description: `@${githubUser || 'This GitHub account'} is already linked to another Stackryze account. Each GitHub account can only verify one account.`,
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
    const domainLimit = rootDomain === 'sryze.cc'
        ? (user?.sryzeDomainsLimit || 1)
        : (user?.githubVerified ? (user?.domainLimit || 1) : 1);
    const domainsRegistered = rootDomain === 'sryze.cc'
        ? (user?.sryzeDomainsCount || 0)
        : (user?.domainsCount || 0);
    const canRegisterMore = domainsRegistered < domainLimit;
    const usagePercentage = (domainsRegistered / domainLimit) * 100;

    // Auto-check availability as user types
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
        <div className="max-w-3xl mx-auto">
            {/* Hero Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-[#FFD23F] px-4 py-2 rounded-full mb-4">
                    <Sparkles className="w-4 h-4 text-[#1A1A1A]" />
                    <span className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">Free Forever</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-[#1A1A1A] mb-3">
                    Claim Your Domain
                </h1>
                <p className="text-lg text-[#4A4A4A]">
                    Get your unique subdomain in seconds
                </p>
            </div>

            {/* Domain Usage Indicator */}
            <div className={`mb-6 border-2 rounded-xl p-5 ${!canRegisterMore ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'
                }`}>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Info className={`w-5 h-5 ${!canRegisterMore ? 'text-red-600' : 'text-blue-600'}`} />
                        <span className={`font-bold text-sm ${!canRegisterMore ? 'text-red-900' : 'text-blue-900'}`}>
                            {rootDomain} Usage: {domainsRegistered} / {domainLimit}
                        </span>
                    </div>
                    {!canRegisterMore && (
                        <span className="text-xs font-bold text-red-600 uppercase">Limit Reached</span>
                    )}
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-white rounded-full h-2.5 mb-2">
                    <div
                        className={`h-2.5 rounded-full transition-all ${usagePercentage >= 100 ? 'bg-red-600' : usagePercentage >= 80 ? 'bg-amber-500' : 'bg-green-600'
                            }`}
                        style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                    ></div>
                </div>

                {!canRegisterMore ? (
                    <p className="text-xs text-red-800 mt-2">
                        {!user?.githubVerified
                            ? <>
                                ⭐ <a href="https://github.com/stackryze/FreeDomains" target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-red-900">Star our repo</a>, then click "I've starred it — Verify" below to unlock 1 more domain instantly!
                              </>
                            : <>Need more domains?{' '}
                                <a href="https://discord.gg/wr7s97cfM7" target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-red-900">Join our Discord</a>{' '}
                                or <a href="mailto:support@stackryze.com" className="underline font-bold hover:text-red-900">email support</a>{' '}
                                to request a limit increase.
                              </>
                        }
                    </p>
                ) : (
                    <p className="text-xs text-blue-800">
                        {domainLimit - domainsRegistered} {rootDomain} {domainLimit - domainsRegistered === 1 ? 'domain' : 'domains'} remaining
                    </p>
                )}
            </div>

            {/* Registration Card */}
            <div className="bg-white p-8 md:p-10 rounded-2xl border-2 border-[#E5E3DF] shadow-lg">
                {!canRegisterMore && (
                    <Alert className="mb-6 border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800 font-medium">
                            Registration disabled. You've reached your limit of {domainLimit} domain{domainLimit === 1 ? '' : 's'}.
                            {!user?.githubVerified ? (
                                <span className="block mt-1 text-xs">
                                    ⭐ Star our repo &amp; verify below to unlock 1 more domain instantly!
                                </span>
                            ) : (
                                <span className="block mt-1 text-xs">
                                    Need more domains?{' '}
                                    <a href="https://discord.gg/wr7s97cfM7" target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-red-900">Join our Discord</a>{' '}
                                    or <a href="mailto:support@stackryze.com" className="underline font-bold hover:text-red-900">email support</a>{' '}
                                    to request a limit increase.
                                </span>
                            )}
                        </AlertDescription>
                    </Alert>
                )}
                {/* Domain Input */}
                <div className="space-y-6">
                    <div>
                        <label className="text-sm font-bold text-[#1A1A1A] mb-3 block flex items-center gap-2">
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
                                    className="font-mono text-xl h-14 pr-12 rounded-t-lg rounded-b-none sm:rounded-l-lg sm:rounded-r-none border-b-0 sm:border-b sm:border-r-0 focus:z-10 w-full"
                                />
                                {isChecking && (
                                    <Loader2 className="w-5 h-5 text-gray-400 animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
                                )}
                                {!isChecking && isAvailable === true && (
                                    <CheckCircle className="w-5 h-5 text-green-600 absolute right-3 top-1/2 -translate-y-1/2" />
                                )}
                                {!isChecking && isAvailable === false && domain.length >= 3 && (
                                    <XCircle className="w-5 h-5 text-red-600 absolute right-3 top-1/2 -translate-y-1/2" />
                                )}
                            </div>
                            <div className="relative h-12 sm:h-14 -mt-[1px] sm:mt-0 min-w-[155px]">
                                <button
                                    type="button"
                                    onClick={() => setDropdownOpen(o => !o)}
                                    onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
                                    className="w-full h-full flex items-center justify-between gap-2 px-4 bg-[#1A1A1A] text-white text-base font-bold focus:outline-none cursor-pointer border-2 border-[#1A1A1A] rounded-b-lg rounded-t-none sm:rounded-r-lg sm:rounded-l-none border-t sm:border-t sm:border-l-0"
                                >
                                    <span className="font-mono">.{rootDomain}</span>
                                    <svg className={`w-4 h-4 text-white flex-shrink-0 transition-transform duration-150 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 border-2 border-[#1A1A1A] rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_#1A1A1A]">
                                        {availableDomains.map(d => (
                                            <button
                                                key={d}
                                                type="button"
                                                onMouseDown={() => { setRootDomain(d); setDropdownOpen(false); }}
                                                className={`w-full text-left px-4 py-3 font-mono font-bold text-sm transition-colors ${
                                                    d === rootDomain
                                                        ? 'bg-[#1A1A1A] text-white'
                                                        : 'bg-white text-[#1A1A1A] hover:bg-gray-50'
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
                            <div className="mt-4 flex items-start gap-3 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
                                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm font-medium text-amber-800">
                                    Domain name must be at least 3 characters. Keep typing!
                                </p>
                            </div>
                        )}
                        {errorMsg && domain.length >= 3 && (
                            <div className="mt-4 flex items-start gap-3 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm font-medium text-red-800">{errorMsg}</p>
                            </div>
                        )}
                        {isAvailable && !errorMsg && (
                            <div className="mt-4 flex items-start gap-3 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-green-900 mb-1">
                                        ✨ {domain}.{rootDomain} is available!
                                    </p>
                                    <p className="text-xs text-green-700">
                                        {(rootDomain === 'sryze.cc' && !user?.githubVerified) ||
                                         (rootDomain === 'indevs.in' && !canRegisterMore && !user?.githubVerified)
                                            ? 'Star our repo on GitHub to unlock this domain — it takes 2 seconds!'
                                            : 'This domain is yours for the taking. Accept the terms below to claim it.'
                                        }
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* KYC Gate — shown for:
                        - sryze.cc: always if not verified (immediately, no search needed)
                        - indevs.in: when limit reached and not yet verified */}
                    {(() => {
                        const needsKyc =
                            (rootDomain === 'sryze.cc' && !user?.githubVerified) ||
                            (rootDomain === 'indevs.in' && !canRegisterMore && !user?.githubVerified);
                        if (!needsKyc) return null;

                        const isSryze = rootDomain === 'sryze.cc';
                        return (
                            <div className="bg-[#FFF8F0] border-2 border-[#E5E3DF] rounded-xl p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#FFD23F]/20 border-2 border-[#FFD23F] flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xl">⭐</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-[#1A1A1A] font-extrabold text-lg mb-1">
                                            {isSryze ? 'Star Required for sryze.cc Access' : 'Unlock More Domains'}
                                        </h3>
                                        <p className="text-[#4A4A4A] text-sm mb-1">
                                            {isSryze
                                                ? <>Star our repo to get a free <span className="font-mono font-bold text-[#E63946]">sryze.cc</span> domain.</>
                                                : <>You've used your 1 free domain. Star our repo to unlock <span className="font-bold text-[#E63946]">1 more indevs.in domain</span> + <span className="font-mono font-bold text-[#E63946]">sryze.cc</span> access!</>
                                            }
                                        </p>
                                        <p className="text-[#6B6B6B] text-xs mb-4">
                                            ⭐ Starring helps us get discovered, reach more developers, and keeps these domains <span className="font-semibold text-[#1A1A1A]">free for everyone</span>.
                                        </p>
                                        <ol className="text-[#6B6B6B] text-xs space-y-1 mb-5 ml-1">
                                            <li>1. Star our GitHub repo (button below)</li>
                                            <li>2. Click "I've starred it — Verify" to confirm</li>
                                            <li>3. You're instantly unlocked — no admin wait!</li>
                                        </ol>
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            {/* Step 1: Star */}
                                            <a
                                                href="https://github.com/stackryze/FreeDomains"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center gap-2 bg-[#FFD23F] text-[#1A1A1A] px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-[#FFB800] transition-all shadow-[3px_3px_0px_0px_#1A1A1A] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"
                                            >
                                                ⭐ Star the Repo ↗
                                            </a>
                                            {/* Step 2: Verify */}
                                            <a
                                                href={`${API_BASE}/github/kyc/start?domain=${encodeURIComponent(domain)}&root=${encodeURIComponent(rootDomain)}`}
                                                className="inline-flex items-center justify-center gap-2 bg-[#1A1A1A] text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-[#333] transition-all border-2 border-[#1A1A1A]"
                                            >
                                                <Github className="w-4 h-4" />
                                                I've starred it — Verify
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}

                    {/* Terms of Service — only shown if not gated by KYC */}
                    {isAvailable &&
                     !((rootDomain === 'sryze.cc' && !user?.githubVerified) ||
                       (rootDomain === 'indevs.in' && !canRegisterMore && !user?.githubVerified)) && (
                        <>
                            {/* Registration Period Info */}
                            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-blue-900">Registration Period:</span>
                                        <span className="text-sm font-extrabold text-blue-900">1 Year</span>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-blue-200 pt-3">
                                        <span className="text-sm font-bold text-blue-900">Expires On:</span>
                                        <span className="text-sm font-mono font-bold text-blue-900">
                                            {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <div className="border-t border-blue-200 pt-3">
                                        <p className="text-xs text-blue-800">
                                            ✓ Renewable 60 days before expiry • Email reminders included
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Terms Acceptance */}
                            <div className="bg-[#FFF8F0] border-2 border-[#E5E3DF] rounded-xl p-6">
                                <div className="flex items-start gap-4">
                                    <Checkbox
                                        id="tos"
                                        checked={acceptedToS}
                                        onCheckedChange={(checked) => setAcceptedToS(checked)}
                                        className="mt-1 h-5 w-5"
                                    />
                                    <label htmlFor="tos" className="text-sm text-[#1A1A1A] leading-relaxed cursor-pointer flex-1">
                                        I have read and agree to the{" "}
                                        <a href="/terms" target="_blank" className="font-bold underline hover:text-[#FF6B35] transition-colors">
                                            Terms of Service
                                        </a>
                                        {" "}and{" "}
                                        <a href="/privacy" target="_blank" className="font-bold underline hover:text-[#FF6B35] transition-colors">
                                            Privacy Policy
                                        </a>
                                    </label>
                                </div>
                            </div>

                            {/* Cloudflare Turnstile */}
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
                        </>
                    )}


                    {/* Register Button — disabled when KYC gate is active */}
                    <Button
                        onClick={handleRegister}
                        disabled={
                            !isAvailable || !acceptedToS || !captchaToken || isSubmitting || !canRegisterMore ||
                            (rootDomain === 'sryze.cc' && !user?.githubVerified) ||
                            (rootDomain === 'indevs.in' && !canRegisterMore && !user?.githubVerified)
                        }
                        className="w-full bg-[#FFD23F] hover:bg-[#FFB800] text-[#1A1A1A] font-extrabold py-6 text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[4px_4px_0px_0px_#1A1A1A] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] disabled:shadow-none"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Registering Your Domain...
                            </>
                        ) : (
                            <>
                                <Globe className="w-5 h-5 mr-2" />
                                Register Domain
                            </>
                        )}
                    </Button>

                    {/* Info Notice */}
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-5 rounded-r-lg">
                        <div className="flex gap-3">
                            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-900">
                                <p className="font-bold mb-2">What happens next?</p>
                                <ul className="space-y-1 text-blue-800">
                                    <li>• Your domain will be registered instantly</li>
                                    <li>• Configure DNS nameservers from the management page</li>
                                    <li>• Domain is valid for 1 year (renewable 60 days before expiry)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}