import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Smartphone, Loader2, ArrowLeft, Shield, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Verify2FA() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const emailParam = searchParams.get("email");
        
        if (!emailParam) {
            toast.error("Invalid 2FA verification link");
            navigate("/login");
            return;
        }
        
        setEmail(emailParam);
    }, [searchParams, navigate]);

    const handleVerify = async (e) => {
        e.preventDefault();
        setError("");
        
        if (!code || code.length < 6) {
            setError("Please enter a valid 6-digit code or backup code");
            return;
        }

        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/auth/2fa/verify`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                setError(data.error || "Invalid verification code. Please try again.");
                return;
            }

            toast.success(data.message || "Logged in successfully");
            
            if (data.usedBackupCode && data.remainingBackupCodes < 3) {
                toast.warning(`Only ${data.remainingBackupCodes} backup codes remaining. Consider regenerating them.`);
            }
            
            window.location.href = "/dashboard";
        } catch (err) {
            setError(err.message || "Verification failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFCF5] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white border-2 border-[#E5E3DF] rounded-2xl p-8 shadow-[4px_4px_0px_0px_#1A1A1A]">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-[#FFF8F0] rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#E5E3DF]">
                            <Shield className="w-8 h-8 text-[#FF6B35]" />
                        </div>
                        <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">Two-Factor Authentication</h1>
                        <p className="text-sm text-[#888]">
                            Enter the code from your authenticator app
                        </p>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border-2 border-red-300 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm text-red-700 font-medium">{error}</p>
                            </div>
                            <button onClick={() => setError("")} className="text-red-500 hover:text-red-700 font-bold">×</button>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleVerify} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-[#4A4A4A] mb-2 uppercase tracking-wider">
                                Verification Code
                            </label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => { setCode(e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8)); setError(""); }}
                                placeholder="Enter 6-digit code or backup code"
                                maxLength={8}
                                autoFocus
                                className={`w-full px-4 py-3 text-lg border-2 ${error ? 'border-red-300' : 'border-[#E5E3DF]'} focus:border-[#1A1A1A] rounded-xl outline-none text-center font-mono tracking-[0.5em] transition-colors`}
                            />
                            <p className="text-xs text-[#888] mt-2 text-center">
                                You can also use a backup code
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || code.length < 6}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-[#1A1A1A] text-white font-bold rounded-xl hover:bg-[#FF6B35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Smartphone className="w-5 h-5" />
                            )}
                            {loading ? "Verifying..." : "Verify"}
                        </button>
                    </form>

                    {/* Back to login */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => navigate("/login")}
                            className="inline-flex items-center gap-2 text-sm text-[#888] hover:text-[#1A1A1A] transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to login
                        </button>
                    </div>
                </div>

                {/* Help text */}
                <p className="text-center text-xs text-[#888] mt-4">
                    Lost access to your authenticator app?{" "}
                    <a href="mailto:support@stackryze.com" className="text-[#FF6B35] hover:underline">
                        Contact support
                    </a>
                </p>
            </div>
        </div>
    );
}
