import { ShieldCheck, Loader2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/auth-context";
import { Header } from "../components/header";

export default function Login() {
    const { login } = useAuth();
    const [searchParams] = useSearchParams();
    const error = searchParams.get('error');
    const [errorBanner, setErrorBanner] = useState(null);

    useEffect(() => {
        if (error) {
            let title = "Login Failed";
            let description = "An unknown error occurred. Please try again.";

            switch (error) {
                case 'banned':
                    title = "Account Suspended";
                    description = "Your account has been banned for violating our terms.";
                    break;
                case 'oidc_failed':
                    title = "Sign-in Failed";
                    description = "We couldn't complete sign-in with Stackryze. Please try again.";
                    break;
                case 'server_error':
                    title = "Server Error";
                    description = "Something went wrong on our end. Please try later.";
                    break;
                default:
                    description = error;
                    break;
            }

            setErrorBanner({ title, description });
        }
    }, [error]);

    const handleLogin = () => login("zitadel");

    return (
        <>
            <Header />
            <div className="min-h-screen flex flex-col items-center justify-center bg-transparent px-4 py-10" style={{ paddingTop: 'calc(4rem + var(--incident-height, 0px) + 2.5rem)' }}>
                <div className="w-full max-w-md bg-white dark:bg-transparent rounded-[24px] border border-slate-200/80 dark:border-white/5 p-8 md:p-10 relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/10"></div>

                    {/* Header */}
                    <div className="mb-8 flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">Welcome back</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Sign in to manage your subdomains</p>
                        </div>
                        <Link to="/" className="flex items-center gap-2 shrink-0">
                            <img src="/stackryze_logo_black.png" alt="Stackryze Logo" className="h-8 w-auto dark:hidden" />
                            <img src="/stackryze_logo_white.png" alt="Stackryze Logo" className="h-8 w-auto hidden dark:block" />
                        </Link>
                    </div>

                    {/* Error Banner */}
                    {errorBanner && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-left">
                            <div className="flex items-start gap-3">
                                <div className="flex-1">
                                    <h3 className="font-bold text-red-900 mb-1 text-sm">{errorBanner.title}</h3>
                                    <p className="text-xs text-red-800">{errorBanner.description}</p>
                                </div>
                                <button
                                    onClick={() => setErrorBanner(null)}
                                    aria-label="Dismiss error"
                                    className="text-red-900 hover:text-red-700 font-bold text-xl leading-none"
                                >×</button>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleLogin}
                        className="w-full flex items-center justify-center gap-3 bg-black text-white dark:bg-white dark:text-black py-3 rounded-xl font-medium text-sm hover:bg-neutral-800 dark:hover:bg-slate-200 transition-all duration-300 shadow-sm"
                    >
                        <ShieldCheck className="w-5 h-5" />
                        Continue with Stackryze
                    </button>

                    <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
                        You'll be redirected to sign in securely.
                    </p>
                </div>

                <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                    Need help? <a href="https://discord.gg/wr7s97cfM7" target="_blank" rel="noopener noreferrer" className="text-slate-900 dark:text-white font-medium hover:underline">Join our Discord</a> or email <a href="mailto:support@stackryze.com" className="text-slate-900 dark:text-white font-medium hover:underline">support@stackryze.com</a>
                </div>

                <p className="mt-8 text-xs text-slate-400">
                    &copy; 2026 Stackryze domains
                </p>
            </div>
        </>
    );
}
