import { Github, Loader2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { subdomainAPI } from "../lib/api";
import { useToast } from "../hooks/use-toast";

import { useAuth } from "../context/auth-context";

export default function Login() {
    const { login, checkAuth } = useAuth(); // Assuming checkAuth is exposed, or we reload
    const [activeTab, setActiveTab] = useState('github');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
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
                    description = "Could not sign in with GitHub. Please try again later.";
                    break;
                case 'server_error':
                    title = "Server Error";
                    description = "Something went wrong on our end. Please try later.";
                    break;
                case 'github_account_too_new':
                    const daysRequired = searchParams.get('days') || '7';
                    title = "Account Looks Suspicious";
                    description = `Your GitHub account appears to be recently created. We cannot proceed at this time. Please refrain from using alt or spam accounts. If you believe this is a mistake, please contact support. (Account must be at least 7 days old, ${daysRequired} day(s) remaining)`;
                    break;
                case 'no_public_email':
                    title = "Public Email Required";
                    description = "We need a public email from your GitHub account to create your account and send important notifications.";
                    break;
                case 'registration_closed_use_email':
                    title = "GitHub Signups Paused";
                    description = "New accounts must use Email/Password. Existing users can still login with GitHub.";
                    // Automatically switch to email tab for convenience
                    setActiveTab('email');
                    break;
                default:
                    title = "Login Failed";
                    description = error || "An unknown error occurred. Please try again.";
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

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await subdomainAPI.post('/auth/email/login', { email, password });
            if (res.data.success) {
                // Check auth handles redirect likely, or we do it manually
                // Force a reload or checkAuth to update context
                window.location.href = '/dashboard';
            }
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: err.response?.data?.error || "Invalid credentials",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF8F0] px-4 font-sans">
            {/* Logo */}
            <Link to="/" className="mb-8 flex items-center gap-3 group">
                <img src="/stackryze_logo1.png" alt="Stackryze Logo" className="h-12 w-auto" />
                <span className="text-2xl font-bold text-[#1A1A1A] tracking-tight">Stackryze Domains</span>
            </Link>

            {/* Login Card */}
            <div className="w-full max-w-md bg-white border-2 border-[#E5E3DF] p-8 md:p-10 rounded-xl text-center">
                <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">Welcome back</h1>
                <p className="text-[#4A4A4A] mb-8">Sign in to manage your subdomains</p>

                {error === 'banned' && (
                    <div className="mb-6 bg-red-50 border border-red-100 text-red-600 p-4 rounded-lg text-sm font-medium">
                        Your account is banned for violating our terms of use. Please <a href="mailto:support@stackryze.com" className="underline">contact support</a> if you think this is a mistake.
                    </div>
                )}

                {error === 'github_account_too_new' && (
                    <div className="mb-6 bg-orange-50 border border-orange-200 text-orange-800 p-4 rounded-lg text-sm">
                        <p className="font-bold mb-2">⚠️ Account Looks Suspicious</p>
                        <p className="mb-3">Your GitHub account appears to be recently created. We cannot proceed at this time.</p>
                        <p className="mb-2"><strong>Please refrain from using alt or spam accounts.</strong></p>
                        <p className="text-xs text-orange-600">
                            💡 <strong>Think this is a mistake?</strong> Please <a href="mailto:support@stackryze.com" className="underline font-medium">contact support</a> with your GitHub username.
                        </p>
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

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        className={`flex-1 pb-2 text-sm font-medium ${activeTab === 'github' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-black'}`}
                        onClick={() => setActiveTab('github')}
                    >
                        GitHub
                    </button>
                    <button
                        className={`flex-1 pb-2 text-sm font-medium ${activeTab === 'email' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-black'}`}
                        onClick={() => setActiveTab('email')}
                    >
                        Email
                    </button>
                </div>

                {activeTab === 'github' ? (
                    <button
                        onClick={handleGithubLogin}
                        className="w-full flex items-center justify-center gap-3 bg-[#1A1A1A] text-white py-3 rounded-lg font-bold hover:shadow-[4px_4px_0px_0px_#FFD23F] transition-all duration-200"
                    >
                        <Github className="w-5 h-5" />
                        Login with GitHub
                    </button>
                ) : (
                    <form onSubmit={handleEmailLogin} className="space-y-4 text-left">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="name@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="text-right">
                            <Link to="/forgot-password" class="text-xs text-gray-500 hover:underline">Forgot Password?</Link>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#1A1A1A] text-white py-3 rounded-lg font-bold hover:shadow-[4px_4px_0px_0px_#FFD23F] transition-all duration-200 disabled:opacity-50"
                        >
                            {isLoading ? <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin w-4 h-4" /> Logging in...</span> : "Login"}
                        </button>
                    </form>
                )}

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
