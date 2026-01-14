import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "../hooks/use-toast";
import { subdomainAPI } from "../lib/api";
import { Loader2, CheckCircle, Info, Check, X, Eye, EyeOff } from "lucide-react";
import { Turnstile } from '@marsidev/react-turnstile';

export default function Signup() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const message = searchParams.get('message');
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [legalName, setLegalName] = useState("");
    const [address, setAddress] = useState({
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: ""
    });
    const [usernameAvailable, setUsernameAvailable] = useState(null);
    const [usernameChecking, setUsernameChecking] = useState(false);
    const [usernameError, setUsernameError] = useState("");
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
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

    // Debounced username availability check
    useEffect(() => {
        if (!username) {
            setUsernameAvailable(null);
            setUsernameError("");
            return;
        }

        // Validate format first
        const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
        if (!usernameRegex.test(username)) {
            setUsernameAvailable(false);
            setUsernameError("Username must be 3-20 characters (letters, numbers, _, -)");
            return;
        }

        setUsernameChecking(true);
        setUsernameError("");

        const timeoutId = setTimeout(async () => {
            try {
                const response = await subdomainAPI.post('/auth/email/check-username', { username });
                setUsernameAvailable(response.data.available);
                if (response.data.error) {
                    setUsernameError(response.data.error);
                }
            } catch (err) {
                console.error('Username check error:', err);
                setUsernameAvailable(null);
            } finally {
                setUsernameChecking(false);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timeoutId);
    }, [username]);

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

        if (!usernameAvailable) {
            toast({
                variant: "destructive",
                title: "Invalid Username",
                description: usernameError || "Please choose an available username.",
            });
            return;
        }

        if (!agreedToTerms) {
            toast({
                variant: "destructive",
                title: "Agreement Required",
                description: "You must agree to the Terms of Service, Privacy Policy, AUP, and confirm your details are correct.",
            });
            return;
        }

        setIsLoading(true);

        try {
            await subdomainAPI.post('/auth/email/register', {
                name,
                email,
                password,
                username,
                legalName,
                address,
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
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF8F0] px-4 py-8 font-sans" style={{ paddingTop: 'var(--incident-height, 0px)' }}>
            <Link to="/" className="mb-6 md:mb-8 flex items-center gap-2 md:gap-3 group">
                <img src="/stackryze_logo1.png" alt="Stackryze Logo" className="h-10 md:h-12 w-auto" />
                <span className="text-xl md:text-2xl font-bold text-[#1A1A1A] tracking-tight">Stackryze Domains</span>
            </Link>

            <div className="w-full max-w-md bg-white border-2 border-[#E5E3DF] p-6 md:p-10 rounded-xl text-center">
                <h1 className="text-xl md:text-2xl font-bold text-[#1A1A1A] mb-2">Create Account</h1>
                <p className="text-sm md:text-base text-[#4A4A4A] mb-6 md:mb-8">Sign up to register domains</p>

                <form onSubmit={handleSignup} className="space-y-4 text-left">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username (Unique Identifier)</label>
                        <div className="relative">
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${usernameError ? 'border-red-500' :
                                    usernameAvailable === true ? 'border-green-500' :
                                        'border-gray-300'
                                    }`}
                                placeholder="johndoe123"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {usernameChecking && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
                                {!usernameChecking && usernameAvailable === true && <Check className="w-4 h-4 text-green-500" />}
                                {!usernameChecking && (usernameAvailable === false || usernameError) && <X className="w-4 h-4 text-red-500" />}
                            </div>
                        </div>
                        {usernameError && <p className="text-xs text-red-500 mt-1">{usernameError}</p>}
                        {usernameAvailable === true && <p className="text-xs text-green-600 mt-1">Username available!</p>}
                        {usernameAvailable === false && !usernameError && <p className="text-xs text-red-500 mt-1">Username already taken</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Legal Name</label>
                        <input
                            type="text"
                            required
                            value={legalName}
                            onChange={(e) => setLegalName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="John Michael Doe"
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
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                minLength={8}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="Minimum 8 characters"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">Full Address</label>
                        <input
                            type="text"
                            required
                            value={address.street}
                            onChange={(e) => setAddress({ ...address, street: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="Street Address"
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="text"
                                required
                                value={address.city}
                                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="City"
                            />
                            <input
                                type="text"
                                required
                                value={address.state}
                                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="State/Province"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="text"
                                required
                                value={address.postalCode}
                                onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="Postal Code"
                            />
                            <input
                                type="text"
                                required
                                value={address.country}
                                onChange={(e) => setAddress({ ...address, country: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="Country"
                            />
                        </div>
                    </div>

                    <div className="flex items-start gap-2 py-3">
                        <input
                            type="checkbox"
                            id="agreedToTerms"
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                            className="mt-1 w-4 h-4 border-gray-300 rounded focus:ring-2 focus:ring-black"
                            required
                        />
                        <label htmlFor="agreedToTerms" className="text-sm text-gray-700">
                            I agree to the{" "}
                            <Link to="/terms" target="_blank" className="text-black font-medium hover:underline">
                                Terms of Service
                            </Link>
                            ,{" "}
                            <Link to="/privacy" target="_blank" className="text-black font-medium hover:underline">
                                Privacy Policy
                            </Link>
                            ,{" "}
                            <Link to="/aup" target="_blank" className="text-black font-medium hover:underline">
                                Acceptable Use Policy
                            </Link>
                            , and I confirm that all the details I have provided are correct and accurate.
                        </label>
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
