import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import {
    Shield, Mail, Loader2, Check, X,
    Edit2, Globe, MapPin, Link2, Twitter,
    Building2, Calendar, User2
} from "lucide-react";
import { subdomainAPI } from "@/lib/api";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Toggle({ enabled, onChange, loading }) {
    return (
        <button
            type="button"
            onClick={() => !loading && onChange(!enabled)}
            disabled={loading}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${enabled ? "bg-slate-900 dark:bg-white" : "bg-slate-200 dark:bg-white/20"} ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-slate-900 shadow transition-transform ${enabled ? "translate-x-6" : "translate-x-1"}`} />
        </button>
    );
}

export default function Settings() {
    const { user } = useAuth();

    // Email
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [emailLoading, setEmailLoading] = useState(false);

    // WHOIS privacy
    const [whoisPrivacy, setWhoisPrivacy] = useState(user?.whoisPrivacy !== false);
    const [privacyLoading, setPrivacyLoading] = useState(false);

    const handleEmailUpdate = async () => {
        if (!newEmail?.includes("@")) return toast.error("Enter a valid email");
        if (newEmail.toLowerCase() === user.email.toLowerCase()) return setIsEditingEmail(false);
        try {
            setEmailLoading(true);
            await subdomainAPI.post("/auth/email/change-email", { newEmail });
            toast.success("Verification email sent");
            window.location.href = `/verify-email?email=${encodeURIComponent(newEmail)}`;
        } catch (err) {
            toast.error(err.data?.error || err.message || "Failed");
        } finally { setEmailLoading(false); }
    };

    const handlePrivacyToggle = async (enabled) => {
        try {
            setPrivacyLoading(true);
            const res = await fetch(`${API_BASE}/subdomains/whois-privacy`, {
                method: "PATCH", credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ enabled }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setWhoisPrivacy(data.whoisPrivacy);
            toast.success(data.message);
        } catch (err) { toast.error(err.message); }
        finally { setPrivacyLoading(false); }
    };

    const memberSince = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short" })
        : null;

    return (
        <div className="max-w-4xl">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Settings & Profile</h1>

            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">

                {/* ── LEFT: Profile sidebar ── */}
                <div className="space-y-4">
                    {/* Avatar + name card */}
                    <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-200/80 dark:border-white/10 rounded-xl p-5 text-center shadow-sm">
                        <div className="relative inline-block mb-3">
                            <img
                                src={user?.avatarUrl || "https://github.com/shadcn.png"}
                                alt="Avatar"
                                className="w-20 h-20 rounded-full border-4 border-white dark:border-slate-800 shadow-md"
                            />
                            {user?.githubVerified && (
                                <span title="GitHub Verified" className="absolute bottom-0 right-0 w-6 h-6 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white dark:border-slate-800">✓</span>
                            )}
                        </div>
                        <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">{user?.name || "User"}</h2>
                        <p className="text-xs text-slate-900 dark:text-white font-mono mt-0.5">@{user?.username || "—"}</p>
                        {user?.bio && <p className="text-xs text-slate-900 dark:text-white italic mt-2 leading-relaxed">"{user.bio}"</p>}
                    </div>

                    {/* Details card */}
                    <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-200/80 dark:border-white/10 rounded-xl p-5 space-y-2.5 shadow-sm">
                        {user?.location && (
                            <div className="flex items-center gap-2 text-sm text-slate-900 dark:text-white font-medium">
                                <MapPin className="w-4 h-4 text-slate-900 dark:text-white shrink-0" />
                                <span>{user.location}</span>
                            </div>
                        )}
                        {user?.company && (
                            <div className="flex items-center gap-2 text-sm text-slate-900 dark:text-white font-medium">
                                <Building2 className="w-4 h-4 text-slate-900 dark:text-white shrink-0" />
                                <span>{user.company}</span>
                            </div>
                        )}
                        {user?.blog && (
                            <div className="flex items-center gap-2 text-sm text-slate-900 dark:text-white font-medium">
                                <Link2 className="w-4 h-4 text-slate-900 dark:text-white shrink-0" />
                                <a href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`} target="_blank" rel="noreferrer" className="hover:text-orange-500 hover:underline truncate">
                                    {user.blog.replace(/^https?:\/\//, "")}
                                </a>
                            </div>
                        )}
                        {user?.twitterUsername && (
                            <div className="flex items-center gap-2 text-sm text-slate-900 dark:text-white font-medium">
                                <Twitter className="w-4 h-4 text-slate-900 dark:text-white shrink-0" />
                                <span>@{user.twitterUsername}</span>
                            </div>
                        )}
                        {memberSince && (
                            <div className="flex items-center gap-2 text-sm text-slate-900 dark:text-white font-medium">
                                <Calendar className="w-4 h-4 text-slate-900 dark:text-white shrink-0" />
                                <span>Joined {memberSince}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-slate-900 dark:text-white font-medium">
                            <User2 className="w-4 h-4 text-slate-900 dark:text-white shrink-0" />
                            <span>Stackryze SSO Account</span>
                        </div>
                    </div>

                    {/* Account stats */}
                    <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-200/80 dark:border-white/10 rounded-xl p-5 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white mb-3">Domain Limits</p>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-medium text-slate-900 dark:text-white">indevs.in</span>
                                <span className="font-bold text-slate-900 dark:text-white">{user?.domainLimit || 1} domain{(user?.domainLimit || 1) > 1 ? "s" : ""}</span>
                            </div>
                            {user?.githubVerified && (
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium text-slate-900 dark:text-white">sryze.cc</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{user?.sryzeDomainsLimit || 1} domain{(user?.sryzeDomainsLimit || 1) > 1 ? "s" : ""}</span>
                                </div>
                            )}
                            {user?.githubVerified && (
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium text-slate-900 dark:text-white">ryzedns.org</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{user?.ryzeDnsDomainsLimit || 1} domain{(user?.ryzeDnsDomainsLimit || 1) > 1 ? "s" : ""}</span>
                                </div>
                            )}
                            {user?.githubVerified && (
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium text-slate-900 dark:text-white">nx.kg</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{user?.nxKgDomainsLimit || 1} domain{(user?.nxKgDomainsLimit || 1) > 1 ? "s" : ""}</span>
                                </div>
                            )}
                            {user?.githubVerified && (
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium text-slate-900 dark:text-white">ryzn.pro</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{user?.ryznProDomainsLimit || 1} domain{(user?.ryznProDomainsLimit || 1) > 1 ? "s" : ""}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── RIGHT: Settings panels ── */}
                <div className="space-y-4">

                    {/* Email */}
                    <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-200/80 dark:border-white/10 rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <Mail className="w-4 h-4 text-orange-500" />
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Email Address</h3>
                        </div>
                        {isEditingEmail ? (
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder="Enter new email"
                                    autoFocus
                                    className="flex-1 px-3 py-2 text-sm border border-slate-200/80 dark:border-white/10 focus:border-slate-900 dark:focus:border-white rounded-lg outline-none bg-white/50 dark:bg-black/40 text-slate-900 dark:text-white"
                                />
                                <button onClick={handleEmailUpdate} disabled={emailLoading} className="px-3 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 transition-colors disabled:opacity-50">
                                    {emailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                </button>
                                <button onClick={() => { setIsEditingEmail(false); setNewEmail(""); }} className="px-3 py-2 bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-white/20 transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className="font-mono text-sm text-slate-900 dark:text-white font-medium truncate">{user?.email}</span>
                                    {!user?.isEmailVerified && <span className="shrink-0 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">Unverified</span>}
                                    {user?.email?.includes("noreply.github.com") && (
                                        <span className="shrink-0 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                            Change required
                                        </span>
                                    )}
                                </div>
                                {user?.githubId && user?.email?.includes("noreply.github.com") && (
                                    <button onClick={() => { setIsEditingEmail(true); setNewEmail(""); }} className="shrink-0 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-white/60 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 rounded-lg transition-colors shadow-sm">
                                        <Edit2 className="w-3 h-3" /> Change
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Centralized Security & Passwords */}
                    <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-200/80 dark:border-white/10 rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <Shield className="w-4 h-4 text-orange-500" />
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Centralized Security &amp; Passwords</h3>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                            Authentication credentials, Passkeys, Multi-Factor Authentication (2FA), and password management are centralized through <strong>Stackryze SSO</strong> at <a href="https://auth.stackryze.com" target="_blank" rel="noreferrer" className="text-orange-500 underline font-medium hover:text-orange-600">auth.stackryze.com</a>.
                        </p>
                    </div>

                    {/* Privacy / WHOIS */}
                    <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-200/80 dark:border-white/10 rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <Globe className="w-4 h-4 text-orange-500" />
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Privacy</h3>
                        </div>

                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">WHOIS Privacy</p>
                                <p className="text-xs font-medium text-slate-900 dark:text-white mt-0.5 leading-relaxed">
                                    Hide your email from public domain WHOIS lookups.
                                </p>
                                <span className={`inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded-full text-xs font-bold ${whoisPrivacy ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${whoisPrivacy ? "bg-green-500" : "bg-amber-400"}`} />
                                    {whoisPrivacy ? "Email hidden" : "Email visible"}
                                </span>
                            </div>
                            <div className="flex flex-col items-end gap-1 mt-0.5">
                                <Toggle enabled={whoisPrivacy} onChange={handlePrivacyToggle} loading={privacyLoading} />
                                {privacyLoading && <span className="text-[10px] font-bold text-slate-900 dark:text-white">Saving…</span>}
                            </div>
                        </div>

                        <p className="mt-3 text-xs font-medium text-slate-900 dark:text-white">Name, address &amp; phone are always redacted regardless of this setting.</p>
                    </div>

                    {/* Official Channels */}
                    <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-200/80 dark:border-white/10 rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <Shield className="w-4 h-4 text-slate-900 dark:text-white" />
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Official Contact Channels</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                            {["support@stackryze.com", "reportabuse@stackryze.com", "security@stackryze.com", "no-reply@stackryze.com"].map(e => (
                                <div key={e} className="flex items-center gap-2 text-xs bg-white/50 dark:bg-black/20 border border-slate-200/80 dark:border-white/10 rounded-lg px-3 py-2">
                                    <Mail className="w-3 h-3 text-slate-900 dark:text-white shrink-0" />
                                    <span className="font-mono font-medium text-slate-900 dark:text-white truncate">{e}</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs font-medium text-slate-900 dark:text-white">We will <strong className="text-red-500">never</strong> contact you from any other domain. Report fakes to <span className="font-mono font-bold">reportabuse@stackryze.com</span>.</p>
                    </div>

                </div>
            </div>
        </div>
    );
}
