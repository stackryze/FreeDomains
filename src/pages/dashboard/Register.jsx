import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useDashboard } from "@/context/dashboard-context";
import { useToast } from "@/hooks/use-toast";
import { subdomainAPI } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { Globe, CheckCircle, XCircle, AlertCircle, Loader2, Sparkles, Info } from "lucide-react";
import { Turnstile } from '@marsidev/react-turnstile';

export default function Register() {
    const [domain, setDomain] = useState("");
    const [isChecking, setIsChecking] = useState(false);
    const [isAvailable, setIsAvailable] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [acceptedToS, setAcceptedToS] = useState(false);
    const [captchaToken, setCaptchaToken] = useState(null);
    const captchaRef = useRef(null);

    const { subdomains, refresh } = useDashboard();
    const { user, checkAuth } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    // Refresh user data on mount to get latest domain limit
    useEffect(() => {
        checkAuth();
    }, []);

    // Calculate domain usage
    const domainLimit = user?.domainLimit || 5;
    const domainsRegistered = subdomains?.length || 0;
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

        // Check if already owned
        const alreadyOwned = subdomains.some(s => s.name === domainLower);
        if (alreadyOwned) {
            setErrorMsg("You already own this domain");
            setIsAvailable(false);
            return;
        }

        setIsChecking(true);
        try {
            const response = await subdomainAPI.checkAvailability(domainLower);
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
    }, [domain, subdomains]);

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
    }, [domain, checkAvailability]);

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
                captchaToken
            });

            toast({
                title: "Domain Registered Successfully! 🎉",
                description: `${domainLower}.indevs.in is now yours for 1 year! You can configure DNS settings from your dashboard.`,
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
                    Get your unique .indevs.in subdomain in seconds
                </p>
            </div>

            {/* Domain Usage Indicator */}
            <div className={`mb-6 border-2 rounded-xl p-5 ${!canRegisterMore ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'
                }`}>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Info className={`w-5 h-5 ${!canRegisterMore ? 'text-red-600' : 'text-blue-600'}`} />
                        <span className={`font-bold text-sm ${!canRegisterMore ? 'text-red-900' : 'text-blue-900'}`}>
                            Domain Usage: {domainsRegistered} / {domainLimit}
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
                        You've reached your registration limit. Please{' '}
                        <a href="mailto:support@stackryze.com" className="underline font-bold hover:text-red-900">
                            contact support
                        </a>{' '}
                        to request a limit increase.
                    </p>
                ) : (
                    <p className="text-xs text-blue-800">
                        {domainLimit - domainsRegistered} {domainLimit - domainsRegistered === 1 ? 'domain' : 'domains'} remaining
                    </p>
                )}
            </div>

            {/* Registration Card */}
            <div className="bg-white p-8 md:p-10 rounded-2xl border-2 border-[#E5E3DF] shadow-lg">
                {!canRegisterMore && (
                    <Alert className="mb-6 border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800 font-medium">
                            Registration disabled. You've reached your limit of {domainLimit} domains.
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
                            <div className="bg-gray-100 border-2 border-t sm:border-t sm:border-l-0 border-[#E5E3DF] rounded-b-lg rounded-t-none sm:rounded-r-lg sm:rounded-l-none px-4 sm:px-6 flex items-center justify-center sm:justify-start h-12 sm:h-14 -mt-[1px] sm:mt-0">
                                <span className="text-xl font-bold text-[#1A1A1A] whitespace-nowrap">.indevs.in</span>
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
                                        ✨ {domain}.indevs.in is available!
                                    </p>
                                    <p className="text-xs text-green-700">
                                        This domain is yours for the taking. Accept the terms below to claim it.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Terms of Service */}
                    {isAvailable && (
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

                    {/* Register Button */}
                    <Button
                        onClick={handleRegister}
                        disabled={!isAvailable || !acceptedToS || !captchaToken || isSubmitting || !canRegisterMore}
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
