import { ShieldCheck } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { useAuth } from "../context/auth-context";
import { Header } from "../components/header";

export default function Login() {
    const { login } = useAuth();
    const [searchParams] = useSearchParams();
    const error = searchParams.get('error');
    const [dismissedError, setDismissedError] = useState(null);

    const errorBanner = useMemo(() => {
        if (!error || dismissedError === error) return null;
        switch (error) {
            case 'banned':
                return { title: "Account Suspended", description: "Your account has been banned for violating our terms." };
            case 'oidc_failed':
                return { title: "Sign-in Failed", description: "We couldn't complete sign-in with Stackryze. Please try again." };
            case 'server_error':
                return { title: "Server Error", description: "Something went wrong on our end. Please try later." };
            default:
                return { title: "Login Failed", description: error };
        }
    }, [error, dismissedError]);

    const handleLogin = () => login("zitadel");

    return (
        <>
            <Header />
            <div className="min-h-screen flex flex-col items-center justify-center bg-transparent px-4 py-12" style={{ paddingTop: 'calc(4rem + var(--incident-height, 0px) + 2.5rem)' }}>
                <div className="w-full max-w-md bg-card/90 backdrop-blur-xl rounded-3xl border border-border p-8 md:p-10 relative shadow-sm overflow-hidden">
                    <div aria-hidden="true" className="bg-glow-signal pointer-events-none absolute inset-0 opacity-60" />
                    {/* Header */}
                    <div className="relative z-10 mb-8 flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-foreground tracking-[-0.03em] mb-1">Welcome back</h1>
                            <p className="text-muted-foreground text-sm">Sign in to manage your subdomains</p>
                        </div>
                        <Link to="/" className="flex items-center gap-2 shrink-0">
                            <img src="/stackryze_logo_black.png" alt="Stackryze Logo" className="h-7 w-auto dark:hidden" />
                            <img src="/stackryze_logo_white.png" alt="Stackryze Logo" className="h-7 w-auto hidden dark:block" />
                        </Link>
                    </div>

                    {/* Error Banner */}
                    {errorBanner && (
                        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-left">
                            <div className="flex items-start gap-3">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-destructive mb-1 text-sm">{errorBanner.title}</h3>
                                    <p className="text-xs text-foreground/80">{errorBanner.description}</p>
                                </div>
                                <button
                                    onClick={() => setDismissedError(error)}
                                    aria-label="Dismiss error"
                                    className="text-destructive hover:opacity-70 font-bold text-xl leading-none"
                                >×</button>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleLogin}
                        className="w-full flex items-center justify-center gap-2.5 bg-foreground text-background py-3.5 rounded-xl font-semibold text-sm hover:bg-signal hover:text-signal-foreground transition-all duration-200 shadow-sm group"
                    >
                        <ShieldCheck className="w-4 h-4 text-signal group-hover:text-signal-foreground transition-colors" />
                        <span>Continue with Stackryze SSO</span>
                    </button>

                    <p className="mt-6 text-center text-xs text-muted-foreground">
                        You'll be redirected to authenticate securely with Stackryze.
                    </p>
                </div>

                <div className="mt-6 text-center text-xs text-muted-foreground">
                    Need help? <a href="https://discord.gg/wr7s97cfM7" target="_blank" rel="noopener noreferrer" className="text-foreground font-medium hover:text-signal transition-colors underline-offset-4 hover:underline">Join our Discord</a> or email <a href="mailto:support@stackryze.com" className="text-foreground font-medium hover:text-signal transition-colors underline-offset-4 hover:underline">support@stackryze.com</a>
                </div>

                <p className="mt-8 text-xs text-muted-foreground/60">
                    &copy; 2026 Stackryze domains · All rights reserved
                </p>
            </div>
        </>
    );
}
