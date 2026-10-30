import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { subdomainAPI } from "../lib/api";
import { useToast } from "../hooks/use-toast";
import { Loader2, MailCheck, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../components/ui/input-otp";
import { Turnstile } from '@marsidev/react-turnstile';

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [captchaToken, setCaptchaToken] = useState(import.meta.env.DEV ? "dev-bypass" : "");
    const { toast } = useToast();
    const navigate = useNavigate();

    // Check if this is a noreply email
    const isNoreplyEmail = email && email.includes('noreply.github.com');

    useEffect(() => {
        if (!email) {
            navigate('/login');
            return;
        }

        const checkStatus = async () => {
            try {
                const res = await subdomainAPI.post('/auth/email/status', { email });
                if (res.exists && res.isVerified) {
                    toast({
                        title: "Already Verified",
                        description: "This email is already verified. Please login.",
                    });
                    navigate('/login');
                }
            } catch (err) {
                console.error('Status check failed:', err);
            }
        };

        checkStatus();
    }, [email, navigate, toast]);

    const handleVerify = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await subdomainAPI.post('/auth/email/verify-email', {
                email,
                otp
            });

            toast({
                title: "Email Verified",
                description: "Logging you in...",
            });

            // Use redirect from response or default to dashboard.
            // Defense-in-depth (2026-10-30 audit): only ever follow a
            // same-origin relative path here, even though the backend
            // currently only ever returns a fixed '/dashboard' value.
            let redirectTo = response.redirect || '/dashboard';
            if (typeof redirectTo !== 'string' || !redirectTo.startsWith('/') || redirectTo.startsWith('//')) {
                redirectTo = '/dashboard';
            }

            // Refresh auth context then navigate
            setTimeout(() => {
                window.location.href = redirectTo;
            }, 500);

        } catch (err) {
            const errorMessage = err.data?.error || err.message || "Invalid code.";

            if (errorMessage.includes('expired')) {
                toast({
                    variant: "destructive",
                    title: "Code Expired",
                    description: "This code has expired. Please request a new one below.",
                });
                return;
            }

            toast({
                variant: "destructive",
                title: "Verification Failed",
                description: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (!captchaToken) {
            toast({
                variant: "destructive",
                title: "Verification Required",
                description: "Please complete the CAPTCHA verification to resend.",
            });
            return;
        }

        setIsResending(true);
        try {
            await subdomainAPI.post('/auth/email/resend-verification', { email, captchaToken });
            toast({
                title: "Code Resent",
                description: "Check your inbox for a new verification code.",
            });
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Failed to Resend",
                description: err.data?.error || "Please try again later.",
            });
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-transparent px-4 font-sans py-12" style={{ paddingTop: 'calc(var(--incident-height, 0px) + 2rem)' }}>
            <Link to="/" className="mb-8 flex items-center gap-3 group">
                <img src="/stackryze_logo_black.png" alt="Stackryze Logo" className="h-9 w-auto dark:hidden" />
                <img src="/stackryze_logo_white.png" alt="Stackryze Logo" className="h-9 w-auto hidden dark:block" />
                <span className="text-xl font-display font-medium text-foreground tracking-tight">Stackryze Domains</span>
            </Link>

            <div className="w-full max-w-md bg-card/80 backdrop-blur-xl border border-border p-8 md:p-10 rounded-2xl shadow-sm text-center">
                {/* NOREPLY EMAIL DETECTION */}
                {isNoreplyEmail ? (
                    <>
                        <MailCheck className="w-12 h-12 text-destructive mx-auto mb-4" />
                        <h1 className="text-3xl font-display font-medium text-foreground mb-2">Cannot Verify This Email</h1>

                        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl text-left mb-6">
                            <div className="flex gap-3 mb-3">
                                <AlertCircle className="w-5 h-5 flex-shrink-0 text-destructive mt-0.5" />
                                <div>
                                    <p className="font-semibold text-sm mb-1">GitHub Noreply Email Detected</p>
                                    <p className="text-xs opacity-90">This address cannot receive external verification emails.</p>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground mb-1.5 font-medium">Your current email is:</p>
                            <p className="font-mono text-xs break-all bg-background/50 p-2 rounded-lg border border-destructive/20 text-foreground">{email}</p>
                        </div>

                        <div className="space-y-3">
                            <a
                                href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/auth/github`}
                                className="block w-full bg-foreground text-background py-3.5 rounded-xl font-semibold text-sm hover:bg-signal hover:text-signal-foreground transition-all duration-200 shadow-sm"
                            >
                                Re-authenticate with GitHub
                            </a>
                            <p className="text-xs text-muted-foreground">
                                You'll be prompted to update your email after login
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <MailCheck className="w-12 h-12 text-signal mx-auto mb-4" />
                        <h1 className="text-3xl font-display font-medium text-foreground mb-2">Check your inbox</h1>
                        <p className="text-sm text-muted-foreground mb-6">
                            We've sent a 6-digit verification code to <br />
                            <strong className="text-foreground font-semibold">{email}</strong>
                        </p>

                        <form onSubmit={handleVerify} className="space-y-5">
                            <div className="flex flex-col items-center">
                                <InputOTP maxLength={6} value={otp} onChange={setOtp} required>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || otp.length < 6}
                                className="w-full bg-foreground text-background py-3.5 rounded-xl font-semibold text-sm hover:bg-signal hover:text-signal-foreground transition-all duration-200 disabled:opacity-50 shadow-sm"
                            >
                                {isLoading ? <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin w-4 h-4" /> Verifying...</span> : "Verify Email"}
                            </button>
                        </form>

                        <div className="mt-6 space-y-4">
                            {!import.meta.env.DEV && (
                                <div className="flex justify-center py-2">
                                    <Turnstile
                                        siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                                        onSuccess={(token) => setCaptchaToken(token)}
                                        onError={(error) => {
                                            console.error('Turnstile error:', error);
                                            toast({ variant: "destructive", title: "CAPTCHA Error", description: "Unable to load verification." });
                                        }}
                                        options={{ theme: 'auto' }}
                                    />
                                </div>
                            )}
                            <p className="text-xs text-muted-foreground">Code expires in 10 minutes.</p>
                            <button
                                onClick={handleResend}
                                disabled={isResending || !captchaToken}
                                className="w-full text-xs font-semibold text-foreground border border-border py-2.5 rounded-xl hover:bg-secondary transition-colors disabled:opacity-50"
                            >
                                {isResending ? "Sending..." : "Didn't receive code? Resend"}
                            </button>
                        </div>
                    </>
                )}
            </div>

            <div className="mt-6 text-center text-xs text-muted-foreground">
                Need help? <a href="https://discord.gg/wr7s97cfM7" target="_blank" rel="noopener noreferrer" className="text-foreground font-medium hover:text-signal transition-colors underline-offset-4 hover:underline">Join our Discord</a> or email <a href="mailto:support@stackryze.com" className="text-foreground font-medium hover:text-signal transition-colors underline-offset-4 hover:underline">support@stackryze.com</a>
            </div>
        </div>
    );
}
