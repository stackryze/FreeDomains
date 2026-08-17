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
            <div className="min-h-screen flex flex-col items-center justify-center bg-transparent px-4 py-10" style={{ paddingTop: 'calc(4rem + var(--incident-height, 0px) + 2.5rem)' }}>
                <div className="w-full max-w-md bg-white dark:bg-transparent rounded-[24px] border border-slate-200/80 dark:border-white/5 p-8 md:p-10 relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/10"></div>

                    {/* Header */}
                    <div className="mb-8 flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">Create Account</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Sign up to register your free subdomains</p>
                        </div>
                        <Link to="/" className="flex items-center gap-2 shrink-0">
                            <img src="/stackryze_logo_black.png" alt="Stackryze Logo" className="h-8 w-auto dark:hidden" />
                            <img src="/stackryze_logo_white.png" alt="Stackryze Logo" className="h-8 w-auto hidden dark:block" />
                        </Link>
                    </div>

                    <button
                        onClick={handleSignup}
                        className="w-full flex items-center justify-center gap-3 bg-black text-white dark:bg-white dark:text-black py-3 rounded-xl font-medium text-sm hover:bg-neutral-800 dark:hover:bg-slate-200 transition-all duration-300 shadow-sm"
                    >
                        <ShieldCheck className="w-5 h-5" />
                        Continue with Stackryze
                    </button>

                    <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
                        You'll be redirected to create an account or sign in securely via Stackryze SSO.
                    </p>
                </div>

                <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                    Already have an account? <Link to="/login" className="text-slate-900 dark:text-white font-medium hover:underline">Sign In</Link>
                </div>

                <p className="mt-8 text-xs text-slate-400">
                    &copy; 2026 Stackryze domains
                </p>
            </div>
        </>
    );
}
