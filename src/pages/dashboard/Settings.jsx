import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Shield, Mail, Edit2, Check, X, Loader2 } from "lucide-react";
import { subdomainAPI } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; // Assuming sonner is used, typical in shadcn/vite apps, else fallback to alert or custom

export default function Settings() {
    const { user, logout } = useAuth(); // Assuming logout might be useful or refetch user
    const navigate = useNavigate();

    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleEmailUpdate = async () => {
        if (!newEmail || !newEmail.includes('@')) {
            toast.error("Please enter a valid email");
            return;
        }

        if (newEmail.toLowerCase() === user.email.toLowerCase()) {
            setIsEditingEmail(false);
            return;
        }

        try {
            setLoading(true);
            const res = await subdomainAPI.post('/auth/email/change-email', { newEmail });

            if (res.data.success) {
                toast.success(res.data.message);
                // Redirect to verification, or user context update might handle it
                // Ideally, force them to verify page
                window.location.href = `/verify-email?email=${encodeURIComponent(newEmail)}`;
            }
        } catch (error) {
            console.error("Email update failed", error);

            // Handle GitHub re-authentication requirement
            if (error.response?.data?.error === 'github_reauth_required') {
                toast.error("Please re-authenticate with GitHub first");
                // Redirect to GitHub OAuth
                setTimeout(() => {
                    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/auth/github`;
                }, 1500);
                return;
            }

            toast.error(error.response?.data?.error || "Failed to update email");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl">
            <h1 className="text-3xl font-bold text-[#1A1A1A] capitalize mb-10">Settings / Profile</h1>
            {/* User Profile Info */}
            <div className="bg-white border-2 border-[#E5E3DF] rounded-xl p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-sm">
                <img
                    src={user?.avatarUrl || "https://github.com/shadcn.png"}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-[#FFD23F] shadow-[4px_4px_0px_0px_#1A1A1A]"
                />
                <div className="text-center md:text-left flex-1 space-y-4 w-full">
                    <div>
                        <h3 className="text-3xl font-bold text-[#1A1A1A]">{user?.name || "User"}</h3>
                        <p className="text-lg text-[#4A4A4A] font-mono">@{user?.username || user?.email?.split('@')[0]}</p>
                    </div>

                    {user?.bio && <p className="text-[#4A4A4A] italic">"{user.bio}"</p>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-[#4A4A4A] font-medium">
                        {user?.company && <div className="flex items-center gap-2">🏢 {user.company}</div>}
                        {user?.location && <div className="flex items-center gap-2">📍 {user.location}</div>}
                        {user?.blog && <div className="flex items-center gap-2">🔗 <a href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`} target="_blank" rel="noreferrer" className="hover:underline">{user.blog}</a></div>}
                        {user?.twitterUsername && <div className="flex items-center gap-2">🐦 @{user.twitterUsername}</div>}

                        {/* Email Section with Edit Capability */}
                        <div className="flex items-center gap-2 col-span-1 md:col-span-2 mt-2 bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300">
                            <span className="flex-shrink-0">✉️</span>

                            {isEditingEmail ? (
                                <div className="flex items-center gap-2 flex-1">
                                    <input
                                        type="email"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        placeholder="Enter new email"
                                        className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                                        autoFocus
                                    />
                                    <button
                                        onClick={handleEmailUpdate}
                                        disabled={loading}
                                        className="p-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                                        title="Save"
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                    </button>
                                    <button
                                        onClick={() => { setIsEditingEmail(false); setNewEmail(""); }}
                                        className="p-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                        title="Cancel"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 flex-1 group">
                                    <span className="font-mono">{user?.email}</span>
                                    {/* Only show edit for GitHub noreply users */}
                                    {(user?.githubId && user?.email?.includes('noreply.github.com')) && (
                                        <button
                                            onClick={() => { setIsEditingEmail(true); setNewEmail(""); }}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded text-gray-500"
                                            title="Change Email (GitHub noreply)"
                                        >
                                            <Edit2 className="w-3 h-3" />
                                        </button>
                                    )}

                                    {!user?.isEmailVerified && (
                                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Unverified</span>
                                    )}
                                    {user?.email?.includes('noreply.github.com') && (
                                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                            Action Required: Change Email
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            {/* Official Channels Box */}
            <div className="bg-[#FFF8F0] border-2 border-[#E5E3DF] rounded-xl p-8 md:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Shield className="w-32 h-32 text-[#1A1A1A]" />
                </div>

                <h3 className="text-xl font-bold text-[#1A1A1A] mb-6 flex items-center gap-2">
                    <Shield className="w-6 h-6" />
                    Official Communication Channels
                </h3>

                <div className="bg-white p-6 rounded-lg border border-[#E5E3DF] mb-8 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-[#888]" />
                            <span className="font-mono text-[#1A1A1A] font-bold">support@stackryze.com</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-[#888]" />
                            <span className="font-mono text-[#1A1A1A] font-bold">reportabuse@stackryze.com</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-[#888]" />
                            <span className="font-mono text-[#1A1A1A] font-bold">security@stackryze.com</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-[#888]" />
                            <span className="font-mono text-[#1A1A1A] font-bold">no-reply@stackryze.com</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-[#fce8e6] border border-[#f5c2c7] rounded-lg text-[#c5221f]">
                    <Shield className="w-6 h-6 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold text-sm mb-1">Safety Warning</p>
                        <p className="text-sm leading-relaxed opacity-90">
                            We will <strong>NEVER</strong> contact you from any other domain or prefix. If you receive emails claiming to be from us from a @gmail.com or other address, please report it immediately to reportabuse@stackryze.com.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
