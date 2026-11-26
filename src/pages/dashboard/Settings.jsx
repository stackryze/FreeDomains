import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { ConsoleHeader } from "@/components/dashboard/ConsoleHeader";
import { Switch } from "@/components/ui/switch";
import {
  Shield,
  Mail,
  Loader2,
  Check,
  X,
  Edit2,
  Globe,
  MapPin,
  Link2,
  Twitter,
  Building2,
  Calendar,
  User2,
} from "lucide-react";
import { subdomainAPI } from "@/lib/api";
import { toast } from "sonner";

export default function Settings() {
  const { user } = useAuth();

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  const [whoisPrivacy, setWhoisPrivacy] = useState(user?.whoisPrivacy !== false);
  const [privacyLoading, setPrivacyLoading] = useState(false);

  const handleEmailUpdate = async () => {
    if (!newEmail?.includes("@")) return toast.error("Enter a valid email");
    if (newEmail.toLowerCase() === user.email.toLowerCase())
      return setIsEditingEmail(false);
    try {
      setEmailLoading(true);
      await subdomainAPI.post("/auth/email/change-email", { newEmail });
      toast.success("Verification email sent");
      window.location.href = `/verify-email?email=${encodeURIComponent(
        newEmail
      )}`;
    } catch (err) {
      toast.error(err.data?.error || err.message || "Failed");
    } finally {
      setEmailLoading(false);
    }
  };

  const handlePrivacyToggle = async (enabled) => {
    try {
      setPrivacyLoading(true);
      const data = await subdomainAPI.patch("/subdomains/whois-privacy", {
        enabled,
      });
      setWhoisPrivacy(data.whoisPrivacy);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.data?.error || err.message);
    } finally {
      setPrivacyLoading(false);
    }
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      })
    : null;

  return (
    <div className="space-y-6 w-full">
      <ConsoleHeader
        title="Profile & Settings"
        description="Manage registrant identity, domain quotas, Stackryze SSO security, and WHOIS privacy."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
        {/* Left: Profile Sidebar (proven original structure) */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <div className="relative inline-block mb-3">
              <img
                src={user?.avatarUrl || "/stackryze_logo_white.png"}
                alt="Avatar"
                className="w-20 h-20 rounded-full border-2 border-border object-cover bg-secondary"
              />
              {user?.githubVerified && (
                <span
                  title="GitHub Verified"
                  className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-card"
                >
                  ✓
                </span>
              )}
            </div>
            <h2 className="text-base font-semibold text-foreground leading-tight">
              {user?.name || "User"}
            </h2>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">
              @{user?.username || "—"}
            </p>
            {user?.bio && (
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                {user.bio}
              </p>
            )}
          </div>

          <div className="bg-card border border-border rounded-lg p-5 space-y-2.5 text-xs">
            {user?.location && (
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span className="text-foreground truncate">{user.location}</span>
              </div>
            )}
            {user?.company && (
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <Building2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span className="text-foreground truncate">{user.company}</span>
              </div>
            )}
            {user?.blog && (
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <Link2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <a
                  href={
                    user.blog.startsWith("http")
                      ? user.blog
                      : `https://${user.blog}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="text-foreground hover:underline truncate"
                >
                  {user.blog.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}
            {user?.twitterUsername && (
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <Twitter className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span className="text-foreground">@{user.twitterUsername}</span>
              </div>
            )}
            {memberSince && (
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <Calendar className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span className="text-foreground">Joined {memberSince}</span>
              </div>
            )}
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <User2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span className="text-foreground">Stackryze SSO</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-5 space-y-3">
            <p className="text-xs font-medium text-muted-foreground">Domain Quotas</p>
            <div className="space-y-2 text-xs tabular-nums">
              {[
                ["indevs.in", user?.domainLimit || 1, true],
                ["sryze.cc", user?.sryzeDomainsLimit || 1, user?.githubVerified],
                [
                  "ryzedns.org",
                  user?.ryzeDnsDomainsLimit || 1,
                  user?.githubVerified,
                ],
                ["nx.kg", user?.nxKgDomainsLimit || 1, user?.githubVerified],
                [
                  "ryzn.pro",
                  user?.ryznProDomainsLimit || 1,
                  user?.githubVerified,
                ],
              ]
                .filter(([, , show]) => show)
                .map(([ext, lim]) => (
                  <div key={ext} className="flex justify-between items-center">
                    <span className="font-mono text-muted-foreground">.{ext}</span>
                    <span className="font-mono font-medium text-foreground">
                      {lim} {lim === 1 ? "domain" : "domains"}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right: Settings Stack */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <h3 className="text-sm font-semibold text-foreground">Email Address</h3>
            </div>

            {isEditingEmail ? (
              <div className="flex gap-2 max-w-md">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter new email…"
                  autoFocus
                  className="flex-1 px-3 py-2 text-sm border border-border focus:border-foreground rounded-md outline-none bg-background text-foreground"
                />
                <button
                  type="button"
                  onClick={handleEmailUpdate}
                  disabled={emailLoading}
                  aria-label="Save email address"
                  className="px-3 py-2 bg-foreground text-background rounded-md hover:bg-foreground/90 disabled:opacity-50"
                >
                  {emailLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Check className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingEmail(false);
                    setNewEmail("");
                  }}
                  aria-label="Cancel email edit"
                  className="px-3 py-2 bg-secondary text-foreground border border-border rounded-md hover:bg-accent"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 min-w-0">
                  <span className="font-mono text-sm text-foreground truncate">
                    {user?.email}
                  </span>
                  {!user?.isEmailVerified && (
                    <span className="text-xs bg-destructive/10 text-destructive border border-destructive/25 px-2.5 py-0.5 rounded-full">
                      Unverified
                    </span>
                  )}
                  {user?.email?.includes("noreply.github.com") && (
                    <span className="text-xs bg-amber-500/10 text-amber-500 border border-amber-500/25 px-2.5 py-0.5 rounded-full">
                      Change required
                    </span>
                  )}
                </div>

                {user?.githubId && user?.email?.includes("noreply.github.com") && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingEmail(true);
                      setNewEmail("");
                    }}
                    className="shrink-0 inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-secondary border border-border text-foreground hover:bg-accent rounded-md"
                  >
                    <Edit2 className="w-3 h-3" aria-hidden="true" />
                    <span>Change</span>
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="bg-card border border-border rounded-lg p-6 space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <h3 className="text-sm font-semibold text-foreground">
                Centralized Security &amp; Passkeys
              </h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Authentication credentials, Passkeys, Two-Factor Authentication (2FA), and passwords are managed through{" "}
              <strong className="text-foreground font-medium">Stackryze SSO</strong> at{" "}
              <a
                href="https://auth.stackryze.com"
                target="_blank"
                rel="noreferrer"
                className="font-mono text-foreground underline underline-offset-4 hover:opacity-80"
              >
                auth.stackryze.com
              </a>
              .
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                <h3 className="text-sm font-semibold text-foreground">
                  WHOIS Privacy
                </h3>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <label
                    htmlFor="whois-privacy-switch"
                    className="text-sm text-foreground font-medium block cursor-pointer"
                  >
                    Redact Registrant Email
                  </label>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Hide your email address from public domain WHOIS queries.
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <Switch
                    id="whois-privacy-switch"
                    checked={whoisPrivacy}
                    onCheckedChange={handlePrivacyToggle}
                    disabled={privacyLoading}
                  />
                  {privacyLoading && (
                    <span className="text-[11px] font-mono text-muted-foreground">
                      Saving…
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-3.5 border-t border-border bg-secondary/25 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>Names, addresses, and phone numbers are always redacted.</span>
              <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    whoisPrivacy ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                  aria-hidden="true"
                />
                {whoisPrivacy ? "Email hidden" : "Email visible"}
              </span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <h3 className="text-sm font-semibold text-foreground">
                Official Contact Channels
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                "support@stackryze.com",
                "reportabuse@stackryze.com",
                "security@stackryze.com",
                "no-reply@stackryze.com",
              ].map((email) => (
                <div
                  key={email}
                  className="flex items-center gap-2 text-xs bg-secondary/40 border border-border rounded-md px-3 py-2"
                >
                  <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
                  <span className="font-mono text-foreground truncate">{email}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              We will never contact you from any other domain. Report spoofing to{" "}
              <span className="font-mono text-foreground">reportabuse@stackryze.com</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
