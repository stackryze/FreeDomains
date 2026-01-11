import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "../hooks/use-toast";
import { subdomainAPI } from "../lib/api";
import { Loader2, CheckCircle, Info } from "lucide-react";
import { Turnstile } from '@marsidev/react-turnstile';

export default function Signup() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const message = searchParams.get('message');
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [captchaToken, setCaptchaToken] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (message === 'github_closed') {
            toast({
                title: "GitHub Signups Closed",
                description: "New accounts must use Email/Password. Existing GitHub users can still login.",
            });
        }
    }, [message, toast]);

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!captchaToken) {
            toast({
                variant: "destructive",
                title: "CAPTCHA Required",
                description: "Please complete the verification check. If it's not loading, try refreshing the page.",
            });
            return;
        }

        setIsLoading(true);

        try {
            await subdomainAPI.post('/auth/email/register', {
                name,
                email,
                password,
                captchaToken
            });
            navigate(`/verify-email?email=${encodeURIComponent(email)}`);
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || "Could not create account. Please try again.";

            toast({
                variant: "destructive",
                title: "Registration Failed",
                description: errorMessage,
            });
            setCaptchaToken(null); // Reset captcha on error
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF8F0] px-4 font-sans">
                <div className="w-full max-w-md bg-white border-2 border-[#E5E3DF] p-8 md:p-10 rounded-xl text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">Check your email</h1>
                    <p className="text-[#4A4A4A] mb-6">
                        We've sent a verification link to <strong>{email}</strong>. Please click the link to activate your account.
                    </p>
                    <Link to="/login" className="text-black font-medium hover:underline">
                        Return to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF8F0] px-4 font-sans" style={{ paddingTop: 'var(--incident-height, 0px)' }}>
            <Link to="/" className="mb-8 flex items-center gap-3 group">
                <img src="/stackryze_logo1.png" alt="Stackryze Logo" className="h-12 w-auto" />
                <span className="text-2xl font-bold text-[#1A1A1A] tracking-tight">Stackryze Domains</span>
            </Link>

            <div className="w-full max-w-md bg-white border-2 border-[#E5E3DF] p-8 md:p-10 rounded-xl text-center">
                <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">Create Account</h1>
                <p className="text-[#4A4A4A] mb-8">Sign up to register domains</p>

                <form onSubmit={handleSignup} className="space-y-4 text-left">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="John Doe"
                        />
                    </div>
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
                            minLength={8}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="Minimum 8 characters"
                        />
                    </div>

                    <div className="flex justify-center my-4 min-h-[65px]">
                        <Turnstile
                            siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                            onSuccess={(token) => setCaptchaToken(token)}
                            onError={(error) => {
                                console.error('Turnstile error:', error);
                                toast({
                                    variant: "destructive",
                                    title: "CAPTCHA Error",
                                    description: "Unable to load verification. Please refresh the page or contact support if this persists.",
                                });
                            }}
                            options={{ theme: 'light' }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !captchaToken}
                        className="w-full bg-[#1A1A1A] text-white py-3 rounded-lg font-bold hover:shadow-[4px_4px_0px_0px_#FFD23F] transition-all duration-200 disabled:opacity-50"
                    >
                        {isLoading ? <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin w-4 h-4" /> creating...</span> : "Create Account"}
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-[#E5E3DF]">
                    <p className="text-sm text-[#4A4A4A]">
                        Already have an account?{" "}
                        <Link to="/login" className="font-bold text-[#1A1A1A] hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
