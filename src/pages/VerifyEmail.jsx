import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { subdomainAPI } from "../lib/api";
import { useToast } from "../hooks/use-toast";
import { Loader2, MailCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

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

            // Use redirect from response or default to dashboard
            const redirectTo = response.redirect || '/dashboard';

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
        setIsResending(true);
        try {
            await subdomainAPI.post('/auth/email/resend-verification', { email });
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
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF8F0] px-4 font-sans" style={{ paddingTop: 'var(--incident-height, 0px)' }}>
            <Link to="/" className="mb-8 flex items-center gap-3 group">
                <img src="/stackryze_logo1.png" alt="Stackryze Logo" className="h-12 w-auto" />
                <span className="text-2xl font-bold text-[#1A1A1A] tracking-tight">Stackryze Domains</span>
            </Link>

            <div className="w-full max-w-md bg-white border-2 border-[#E5E3DF] p-8 md:p-10 rounded-xl text-center">
                <MailCheck className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">Check your inbox</h1>
                <p className="text-[#4A4A4A] mb-6">
                    We've sent a 6-digit verification code to <br />
                    <strong className="text-black">{email}</strong>
                </p>

                <form onSubmit={handleVerify} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            required
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Numeric only
                            className="w-full text-center text-2xl tracking-[0.5em] px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-mono"
                            placeholder="000000"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || otp.length < 6}
                        className="w-full bg-[#1A1A1A] text-white py-3 rounded-lg font-bold hover:shadow-[4px_4px_0px_0px_#FFD23F] transition-all duration-200 disabled:opacity-50"
                    >
                        {isLoading ? <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin w-4 h-4" /> Verifying...</span> : "Verify Email"}
                    </button>
                </form>

                <div className="mt-6 space-y-2">
                    <p className="text-xs text-gray-500">Code expires in 10 minutes.</p>
                    <button
                        onClick={handleResend}
                        disabled={isResending}
                        className="text-sm text-gray-600 hover:text-black hover:underline disabled:opacity-50"
                    >
                        {isResending ? "Sending..." : "Didn't receive code? Resend"}
                    </button>
                </div>
            </div>
        </div>
    );
}
