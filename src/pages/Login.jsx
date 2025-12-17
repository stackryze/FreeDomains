import { Github } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "../hooks/use-toast";

import { useAuth } from "../context/auth-context";

export default function Login() {
    const { login } = useAuth();
    const [searchParams] = useSearchParams();
    const error = searchParams.get('error');
    const { toast } = useToast();

    useEffect(() => {
        if (error) {
            let title = "Login Failed";
            let description = "An unknown error occurred.";

            switch (error) {
                case 'banned':
                    title = "Account Suspended";
                    description = "Your account has been banned for violating our terms.";
                    break;
                case 'registration_closed':
                    title = "Registration Closed";
                    description = "New sign-ups are currently disabled by the administrator.";
                    break;
                case 'github_failed':
                case 'google_failed':
                    title = "Authentication Failed";
                    description = "Could not sign in with the provider. Please try again.";
                    break;
                case 'server_error':
                    title = "Server Error";
                    description = "Something went wrong on our end. Please try later.";
                    break;
            }

            toast({
                variant: "destructive",
                title,
                description,
            });
        }
    }, [error, toast]);

    const handleGithubLogin = () => login("github");
    const handleGoogleLogin = () => login("google");

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF8F0] px-4 font-sans">
            {/* Logo */}
            <Link to="/" className="mb-8 flex items-center gap-1 group">
                <div className="flex items-center font-extrabold text-3xl tracking-tighter gap-0.5">
                    <span className="text-[#FF6B35]">IN</span>
                    <span className="text-[#1A1A1A]">DE</span>
                    <span className="text-[#138808]">VS</span>
                </div>
                <span className="text-lg font-bold text-[#1A1A1A] tracking-tight">.in</span>
            </Link>

            {/* Login Card */}
            <div className="w-full max-w-md bg-white border-2 border-[#E5E3DF] p-8 md:p-10 rounded-xl text-center">
                <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">Welcome back</h1>
                <p className="text-[#4A4A4A] mb-8">Sign in to manage your subdomains</p>

                {error === 'banned' && (
                    <div className="mb-6 bg-red-50 border border-red-100 text-red-600 p-4 rounded-lg text-sm font-medium">
                        Your account is banned for violating our terms of use. Please <a href="mailto:support@admin.indevs.in" className="underline">contact support</a> if you think this is a mistake.
                    </div>
                )}

                {error && error !== 'banned' && (
                    <div className="mb-6 bg-red-50 border border-red-100 text-red-600 p-4 rounded-lg text-sm font-medium">
                        Login failed. Please try again.
                    </div>
                )}

                <div className="space-y-4">
                    <button
                        onClick={handleGithubLogin}
                        className="w-full flex items-center justify-center gap-3 bg-[#1A1A1A] text-white py-3 rounded-lg font-bold hover:shadow-[4px_4px_0px_0px_#FFD23F] transition-all duration-200"
                    >
                        <Github className="w-5 h-5" />
                        Login with GitHub
                    </button>

                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 bg-white text-[#1A1A1A] border-2 border-[#E5E3DF] py-3 rounded-lg font-bold hover:border-[#1A1A1A] transition-all duration-200"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Login with Google
                    </button>
                </div>

                <div className="mt-8 pt-6 border-t border-[#E5E3DF]">
                    <p className="text-sm text-[#4A4A4A]">
                        Don't have an account?{" "}
                        <Link to="/signup" className="font-bold text-[#1A1A1A] hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>

            <p className="mt-8 text-xs text-[#888]">
                &copy; 2025 Indevs.in
            </p>
        </div>
    );
}
