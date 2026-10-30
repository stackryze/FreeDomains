import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import {
    Shield, Mail, Loader2, Check, X,
    Edit2, Globe, MapPin, Link2, Twitter,
    Building2, Calendar, User2
} from "lucide-react";
import { subdomainAPI } from "@/lib/api";
import { toast } from "sonner";

function Toggle({ enabled, onChange, loading }) {
    return (
        <button
            type="button"
            onClick={() => !loading && onChange(!enabled)}
            disabled={loading}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${enabled ? "bg-foreground" : "bg-accent dark:bg-accent"} ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-foreground shadow transition-transform ${enabled ? "translate-x-6" : "translate-x-1"}`} />
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
            // Routed through subdomainAPI (not a raw fetch) so the CSRF
            // header and shared error handling are applied consistently
            // (2026-10-30 security audit fix).
            const data = await subdomainAPI.patch("/subdomains/whois-privacy", { enabled });
            setWhoisPrivacy(data.whoisPrivacy);
            toast.success(data.message);
        } catch (err) { toast.error(err.data?.error || err.message); }
        finally { setPrivacyLoading(false); }
    };

    const memberSince = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short" })
        : null;

    return (
        <div className="max-w-4xl">
            <h1 className="font-display text-2xl md:text-3xl font-medium text-foreground mb-6">Settings & Profile</h1>

            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">

                {/* ── LEFT: Profile sidebar ── */}
                <div className="space-y-4">
                    {/* Avatar + name card */}
                    <div className="bg-card/70 backdrop-blur-md border border-border rounded-xl p-5 text-center shadow-sm">
                        <div className="relative inline-block mb-3">
                            <img
                                src={user?.avatarUrl || "https://github.com/shadcn.png"}
                                alt="Avatar"
                                className="w-20 h-20 rounded-full border-4 border-white dark:border-border shadow-md"
                            />
                            {user?.githubVerified && (
                                <span title="GitHub Verified" className="absolute bottom-0 right-0 w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center text-xs font-bold border-2 border-white dark:border-border">✓</span>
                            )}
                        </div>
                        <h2 className="font-display text-base font-medium text-foreground leading-tight">{user?.name || "User"}</h2>
                        <p className="text-xs text-foreground font-mono mt-0.5">@{user?.username || "—"}</p>
                        {user?.bio && <p className="text-xs text-foreground italic mt-2 leading-relaxed">"{user.bio}"</p>}
                    </div>

                    {/* Details card */}
                    <div className="bg-card/70 backdrop-blur-md border border-border rounded-xl p-5 space-y-2.5 shadow-sm">
                        {user?.location && (
                            <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                                <MapPin className="w-4 h-4 text-foreground shrink-0" />
                                <span>{user.location}</span>
                            </div>
                        )}
                        {user?.company && (
                            <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                                <Building2 className="w-4 h-4 text-foreground shrink-0" />
                                <span>{user.company}</span>
                            </div>
                        )}
                        {user?.blog && (
                            <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                                <Link2 className="w-4 h-4 text-foreground shrink-0" />
                                <a href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`} target="_blank" rel="noreferrer" className="hover:text-signal/80 hover:underline truncate">
                                    {user.blog.replace(/^https?:\/\//, "")}
                                </a>
                            </div>
                        )}
                        {user?.twitterUsername && (
                            <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                                <Twitter className="w-4 h-4 text-foreground shrink-0" />
                                <span>@{user.twitterUsername}</span>
                            </div>
                        )}
                        {memberSince && (
                            <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                                <Calendar className="w-4 h-4 text-foreground shrink-0" />
                                <span>Joined {memberSince}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                            <User2 className="w-4 h-4 text-foreground shrink-0" />
                            <span>Stackryze SSO Account</span>
                        </div>
                    </div>

                    {/* Account stats */}
                    <div className="bg-card/70 backdrop-blur-md border border-border rounded-xl p-5 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-widest text-foreground mb-3">Domain Limits</p>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-medium text-foreground">indevs.in</span>
                                <span className="font-bold text-foreground">{user?.domainLimit || 1} domain{(user?.domainLimit || 1) > 1 ? "s" : ""}</span>
                            </div>
                            {user?.githubVerified && (
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium text-foreground">sryze.cc</span>
                                    <span className="font-bold text-foreground">{user?.sryzeDomainsLimit || 1} domain{(user?.sryzeDomainsLimit || 1) > 1 ? "s" : ""}</span>
                                </div>
                            )}
                            {user?.githubVerified && (
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium text-foreground">ryzedns.org</span>
                                    <span className="font-bold text-foreground">{user?.ryzeDnsDomainsLimit || 1} domain{(user?.ryzeDnsDomainsLimit || 1) > 1 ? "s" : ""}</span>
                                </div>
                            )}
                            {user?.githubVerified && (
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium text-foreground">nx.kg</span>
                                    <span className="font-bold text-foreground">{user?.nxKgDomainsLimit || 1} domain{(user?.nxKgDomainsLimit || 1) > 1 ? "s" : ""}</span>
                                </div>
                            )}
                            {user?.githubVerified && (
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium text-foreground">ryzn.pro</span>
                                    <span className="font-bold text-foreground">{user?.ryznProDomainsLimit || 1} domain{(user?.ryznProDomainsLimit || 1) > 1 ? "s" : ""}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── RIGHT: Settings panels ── */}
                <div className="space-y-4">

                    {/* Email */}
                    <div className="bg-card/70 backdrop-blur-md border border-border rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <Mail className="w-4 h-4 text-signal" />
                            <h3 className="font-display text-foreground text-sm font-medium">Email Address</h3>
                        </div>
                        {isEditingEmail ? (
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder="Enter new email"
                                    autoFocus
                                    className="flex-1 px-3 py-2 text-sm border border-border focus:border-foreground dark:focus:border-white rounded-lg outline-none bg-input/50 text-foreground"
                                />
                                <button onClick={handleEmailUpdate} disabled={emailLoading} className="px-3 py-2 bg-foreground text-background rounded-lg hover:bg-signal hover:text-signal-foreground transition-colors disabled:opacity-50">
                                    {emailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                </button>
                                <button onClick={() => { setIsEditingEmail(false); setNewEmail(""); }} className="px-3 py-2 bg-secondary dark:bg-secondary text-foreground rounded-lg hover:bg-accent dark:hover:bg-accent transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className="font-mono text-sm text-foreground font-medium truncate">{user?.email}</span>
                                    {!user?.isEmailVerified && <span className="shrink-0 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">Unverified</span>}
                                    {user?.email?.includes("noreply.github.com") && (
                                        <span className="shrink-0 text-xs bg-warning text-warning px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                                            <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
                                            Change required
                                        </span>
                                    )}
                                </div>
                                {user?.githubId && user?.email?.includes("noreply.github.com") && (
                                    <button onClick={() => { setIsEditingEmail(true); setNewEmail(""); }} className="shrink-0 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-card/70 border border-border text-foreground hover:bg-muted dark:hover:bg-secondary rounded-lg transition-colors shadow-sm">
                                        <Edit2 className="w-3 h-3" /> Change
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Centralized Security & Passwords */}
                    <div className="bg-card/70 backdrop-blur-md border border-border rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <Shield className="w-4 h-4 text-signal" />
                            <h3 className="font-display text-foreground text-sm font-medium">Centralized Security &amp; Passwords</h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                            Authentication credentials, Passkeys, Multi-Factor Authentication (2FA), and password management are centralized through <strong>Stackryze SSO</strong> at <a href="https://auth.stackryze.com" target="_blank" rel="noreferrer" className="text-signal underline font-medium hover:text-signal/80">auth.stackryze.com</a>.
                        </p>
                    </div>

                    {/* Privacy / WHOIS */}
                    <div className="bg-card/70 backdrop-blur-md border border-border rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <Globe className="w-4 h-4 text-signal" />
                            <h3 className="font-display text-foreground text-sm font-medium">Privacy</h3>
                        </div>

                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-bold text-foreground">WHOIS Privacy</p>
                                <p className="text-xs font-medium text-foreground mt-0.5 leading-relaxed">
                                    Hide your email from public domain WHOIS lookups.
                                </p>
                                <span className={`inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded-full text-xs font-bold ${whoisPrivacy ? "bg-green-100 text-green-700" : "bg-warning text-warning"}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${whoisPrivacy ? "bg-green-500" : "bg-warning"}`} />
                                    {whoisPrivacy ? "Email hidden" : "Email visible"}
                                </span>
                            </div>
                            <div className="flex flex-col items-end gap-1 mt-0.5">
                                <Toggle enabled={whoisPrivacy} onChange={handlePrivacyToggle} loading={privacyLoading} />
                                {privacyLoading && <span className="text-[10px] font-bold text-foreground">Saving…</span>}
                            </div>
                        </div>

                        <p className="mt-3 text-xs font-medium text-foreground">Name, address &amp; phone are always redacted regardless of this setting.</p>
                    </div>

                    {/* Official Channels */}
                    <div className="bg-card/70 backdrop-blur-md border border-border rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <Shield className="w-4 h-4 text-foreground" />
                            <h3 className="font-display text-foreground text-sm font-medium">Official Contact Channels</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                            {["support@stackryze.com", "reportabuse@stackryze.com", "security@stackryze.com", "no-reply@stackryze.com"].map(e => (
                                <div key={e} className="flex items-center gap-2 text-xs bg-white/50 dark:bg-black/20 border border-border rounded-lg px-3 py-2">
                                    <Mail className="w-3 h-3 text-foreground shrink-0" />
                                    <span className="font-mono font-medium text-foreground truncate">{e}</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs font-medium text-foreground">We will <strong className="text-red-500">never</strong> contact you from any other domain. Report fakes to <span className="font-mono font-bold">reportabuse@stackryze.com</span>.</p>
                    </div>

                </div>
            </div>
        </div>
    );
}
