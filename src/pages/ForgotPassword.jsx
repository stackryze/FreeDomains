import { useState } from "react";
import { Link } from "react-router-dom";
import { subdomainAPI } from "../lib/api";
import { useToast } from "../hooks/use-toast";
import { Loader2, Mail } from "lucide-react";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Note: Route /auth/email/forgot-password logic needs to be added in backend if not already present
            // For now UI is ready
            await subdomainAPI.post('/auth/email/forgot-password', { email });
            setIsSent(true);
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Error",
                description: err.response?.data?.error || "Failed to send reset email.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isSent) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF8F0] px-4 font-sans">
                <div className="w-full max-w-md bg-white border-2 border-[#E5E3DF] p-8 rounded-xl text-center">
                    <Mail className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Check your inbox</h1>
                    <p className="text-gray-600 mb-6">If an account exists for <strong>{email}</strong>, we have sent password reset instructions.</p>
                    <Link to="/login" className="text-black hover:underline">Back to Login</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF8F0] px-4 font-sans">
            <div className="w-full max-w-md bg-white border-2 border-[#E5E3DF] p-8 rounded-xl text-center">
                <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
                <p className="text-gray-600 mb-6">Enter your email to receive a reset link</p>

                <form onSubmit={handleSubmit} className="text-left space-y-4">
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
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#1A1A1A] text-white py-3 rounded-lg font-bold hover:shadow-md transition-all disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="animate-spin w-4 h-4 mx-auto" /> : "Send Reset Link"}
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <Link to="/login" className="text-sm text-gray-500 hover:underline">Back to Login</Link>
                </div>
            </div>
        </div>
    );
}
