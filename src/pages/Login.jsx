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
                    title = "Authentication Failed";
                    description = "Could not sign in with GitHub. Please try again.";
                    break;
                case 'server_error':
                    title = "Server Error";
                    description = "Something went wrong on our end. Please try later.";
                    break;
                case 'github_account_too_new':
                    const daysRequired = searchParams.get('days') || '7';
                    title = "GitHub Account Too New";
                    description = `Your GitHub account must be at least 7 days old. Please try again in ${daysRequired} day(s).`;
                    break;
                case 'no_public_email':
                    title = "Public Email Required";
                    description = "We need a public email from your GitHub account to create your account and send important notifications.";
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

                {error === 'no_public_email' && (
                    <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg text-sm">
                        <p className="font-bold mb-2">📧 Public Email Required</p>
                        <p className="mb-3">We need your email to send important account notifications and updates. Please make your email public on GitHub:</p>
                        <ol className="list-decimal list-inside space-y-1 mb-3 text-left">
                            <li>Go to <a href="https://github.com/settings/emails" target="_blank" rel="noopener noreferrer" className="underline font-medium">GitHub Email Settings</a></li>
                            <li>Uncheck "Keep my email addresses private"</li>
                            <li>Come back and try logging in again</li>
                        </ol>
                        <p className="text-xs text-blue-600">💡 <strong>Tip:</strong> Use a separate email for GitHub if you're worried about spam.</p>
                    </div>
                )}

                {error && error !== 'banned' && error !== 'no_public_email' && (
                    <div className="mb-6 bg-red-50 border border-red-100 text-red-600 p-4 rounded-lg text-sm font-medium">
                        Login failed. Please try again.
                    </div>
                )}

                <button
                    onClick={handleGithubLogin}
                    className="w-full flex items-center justify-center gap-3 bg-[#1A1A1A] text-white py-3 rounded-lg font-bold hover:shadow-[4px_4px_0px_0px_#FFD23F] transition-all duration-200"
                >
                    <Github className="w-5 h-5" />
                    Login with GitHub
                </button>

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
