import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { subdomainAPI } from "../lib/api";
import { useToast } from "../hooks/use-toast";
import { Loader2, KeyRound } from "lucide-react";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleReset = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast({
                variant: "destructive",
                title: "Passwords Don't Match",
                description: "Please ensure both password fields match.",
            });
            return;
        }

        if (newPassword.length < 8) {
            toast({
                variant: "destructive",
                title: "Weak Password",
                description: "Password must be at least 8 characters.",
            });
            return;
        }

        setIsLoading(true);

        try {
            await subdomainAPI.post('/auth/email/reset-password', {
                email,
                otp,
                newPassword
            });

            toast({
                title: "Password Reset",
                description: "Your password has been reset successfully.",
            });

            navigate('/login');

        } catch (err) {
            console.error('Reset password error:', err);
            const errorMessage = err.response?.data?.error || err.message || "Failed to reset password.";

            toast({
                variant: "destructive",
                title: "Reset Failed",
                description: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF8F0] px-4 font-sans" style={{ paddingTop: 'var(--incident-height, 0px)' }}>
            <Link to="/" className="mb-8 flex items-center gap-3 group">
                <img src="/stackryze_logo1.png" alt="Stackryze Logo" className="h-12 w-auto" />
                <span className="text-2xl font-bold text-[#1A1A1A] tracking-tight">Stackryze Domains</span>
            </Link>

            <div className="w-full max-w-md bg-white border-2 border-[#E5E3DF] p-8 md:p-10 rounded-xl text-center">
                <KeyRound className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">Enter Reset Code</h1>
                <p className="text-[#4A4A4A] mb-6">
                    We sent a 6-digit code to <strong>{email}</strong>
                </p>

                <form onSubmit={handleReset} className="space-y-4 text-left">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reset Code</label>
                        <input
                            type="text"
                            required
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            className="w-full text-center text-2xl tracking-[0.5em] px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-mono"
                            placeholder="000000"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                            type="password"
                            required
                            minLength={8}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="Minimum 8 characters"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            required
                            minLength={8}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="Confirm password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || otp.length < 6}
                        className="w-full bg-[#1A1A1A] text-white py-3 rounded-lg font-bold hover:shadow-[4px_4px_0px_0px_#FFD23F] transition-all duration-200 disabled:opacity-50"
                    >
                        {isLoading ? <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin w-4 h-4" /> Resetting...</span> : "Reset Password"}
                    </button>
                </form>

                <div className="mt-6">
                    <p className="text-xs text-gray-500">Code expires in 10 minutes.</p>
                    <Link to="/login" className="text-sm text-gray-600 hover:underline mt-2 inline-block">Back to Login</Link>
                </div>
            </div>
        </div>
    );
}
