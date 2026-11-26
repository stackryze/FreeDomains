import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import { Header } from "../components/header";

export default function Signup() {
    const { login } = useAuth();

    const handleSignup = () => login("zitadel");

    return (
        <>
            <Header />
            <div className="min-h-screen flex flex-col items-center justify-center bg-transparent px-4 py-12" style={{ paddingTop: 'calc(4rem + var(--incident-height, 0px) + 2.5rem)' }}>
                <div className="w-full max-w-md bg-card/90 backdrop-blur-xl rounded-3xl border border-border p-8 md:p-10 relative shadow-sm overflow-hidden">
                    <div aria-hidden="true" className="bg-glow-signal pointer-events-none absolute inset-0 opacity-60" />
                    {/* Header */}
                    <div className="relative z-10 mb-8 flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-foreground tracking-[-0.03em] mb-1">Create Account</h1>
                            <p className="text-muted-foreground text-sm">Sign up to claim your free subdomains</p>
                        </div>
                        <Link to="/" className="flex items-center gap-2 shrink-0">
                            <img src="/stackryze_logo_black.png" alt="Stackryze Logo" className="h-7 w-auto dark:hidden" />
                            <img src="/stackryze_logo_white.png" alt="Stackryze Logo" className="h-7 w-auto hidden dark:block" />
                        </Link>
                    </div>

                    <button
                        onClick={handleSignup}
                        className="w-full flex items-center justify-center gap-2.5 bg-foreground text-background py-3.5 rounded-xl font-semibold text-sm hover:bg-signal hover:text-signal-foreground transition-all duration-200 shadow-sm group"
                    >
                        <ShieldCheck className="w-4 h-4 text-signal group-hover:text-signal-foreground transition-colors" />
                        <span>Continue with Stackryze SSO</span>
                    </button>

                    <p className="mt-6 text-center text-xs text-muted-foreground">
                        You'll be redirected to create an account or sign in securely via Stackryze SSO.
                    </p>
                </div>

                <div className="mt-6 text-center text-xs text-muted-foreground">
                    Already have an account? <Link to="/login" className="text-foreground font-semibold hover:text-signal transition-colors underline-offset-4 hover:underline">Sign In</Link>
                </div>

                <p className="mt-8 text-xs text-muted-foreground/60">
                    &copy; 2026 Stackryze domains · All rights reserved
                </p>
            </div>
        </>
    );
}
