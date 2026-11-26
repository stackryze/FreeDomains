import { useState } from "react";
import { Shield, Eye, Code2, Activity, Server, Check, Lock } from "lucide-react";

const bottomSpecs = [
  {
    icon: Server,
    title: "Up to 6 custom nameservers",
    description:
      "Configure NS1 through NS6 per subdomain with immediate authoritative publication.",
  },
  {
    icon: Activity,
    title: "Live WHOIS & ownership verification",
    description:
      "Query public WHOIS records or verify zone ownership cleanly for Stackryze Managed DNS.",
  },
  {
    icon: Code2,
    title: "Open source & abuse-protected",
    description:
      "Transparent codebase on GitHub, protected by automated abuse monitoring and fair appeals.",
  },
];

export function FeatureCards() {
  const [privacyOn, setPrivacyOn] = useState(true);

  return (
    <section id="features" className="w-full px-6 md:px-12 lg:px-16">
      <div className="max-w-[1600px] mx-auto border-x border-b border-border bg-background">
        {/* Top 2-Column Showcase with Edge-Cropped UI Glimpses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
          {/* Security & Centralized SSO */}
          <div className="relative pt-8 sm:pt-10 px-6 sm:px-10 lg:px-12 overflow-hidden flex flex-col justify-between gap-8 min-h-[340px]">
            <div className="space-y-2 max-w-md relative z-10">
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Identity &amp; Access</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold tracking-[-0.03em] text-foreground">
                Centralized Stackryze SSO.
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Secured with unified OIDC authentication, hardware passkeys, two-factor protection, and GitHub anti-abuse verification.
              </p>
            </div>

            <div className="relative flex items-end">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-14 left-1/2 -translate-x-1/2 w-[90%] h-40 bg-[radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.12),transparent_70%)]"
              />
              <div className="relative z-10 w-full rounded-t-xl border-x border-t border-border bg-card px-5 py-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 text-xs font-medium text-foreground">
                    <Shield className="w-4 h-4 text-emerald-500" aria-hidden="true" />
                    <span>Stackryze OIDC Session</span>
                  </div>
                  <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                    Passkey + 2FA
                  </span>
                </div>
                <div className="pt-3 border-t border-border flex items-center justify-between gap-3 font-mono text-xs">
                  <span className="text-muted-foreground">GitHub Anti-Abuse Gate</span>
                  <span className="inline-flex items-center gap-1 text-foreground">
                    <Check className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
                    Verified
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive WHOIS Privacy Preview */}
          <div className="relative pt-8 sm:pt-10 px-6 sm:px-10 lg:px-12 overflow-hidden flex flex-col justify-between gap-8 min-h-[340px]">
            <div className="space-y-2 max-w-md relative z-10">
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Registrant Privacy</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold tracking-[-0.03em] text-foreground">
                WHOIS privacy enabled by default.
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Names, addresses, and phone numbers are always redacted in public WHOIS lookups. Email privacy stays under your control.
              </p>
            </div>

            <div className="relative flex items-end">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-14 left-1/2 -translate-x-1/2 w-[90%] h-40 bg-[radial-gradient(ellipse_at_bottom,rgba(124,92,255,0.16),transparent_70%)]"
              />
              <div className="relative z-10 w-full rounded-t-xl border-x border-t border-border bg-card overflow-hidden">
                <div className="px-5 py-3 border-b border-border flex items-center justify-between gap-3">
                  <span className="text-xs font-medium text-foreground">
                    WHOIS Email Redaction
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={privacyOn}
                    aria-label="Preview WHOIS email redaction toggle"
                    onClick={() => setPrivacyOn((v) => !v)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      privacyOn ? "bg-signal" : "bg-secondary border border-border"
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        privacyOn ? "translate-x-4.5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>

                <div className="px-5 py-3.5 space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Registrant Name:</span>
                    <span className="text-foreground">REDACTED FOR PRIVACY</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Registrant Email:</span>
                    <span className={privacyOn ? "text-signal" : "text-foreground"}>
                      {privacyOn ? "REDACTED FOR PRIVACY" : "developer@example.com"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom 3-Column Technical Specification Strip */}
        <div className="border-t border-border grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
          {bottomSpecs.map((spec) => {
            const IconComp = spec.icon;
            return (
              <div key={spec.title} className="p-6 sm:p-8 lg:p-10 space-y-2.5">
                <div className="flex items-center gap-2.5 text-foreground">
                  <IconComp className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden="true" />
                  <h4 className="text-sm sm:text-base font-semibold tracking-tight">
                    {spec.title}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {spec.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
