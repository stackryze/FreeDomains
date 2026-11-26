import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDashboard } from "@/context/dashboard-context";
import { useToast } from "@/hooks/use-toast";
import { subdomainAPI } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConsoleHeader } from "@/components/dashboard/ConsoleHeader";
import {
  Globe,
  ArrowLeft,
  RefreshCw,
  Clock,
  Trash,
  Settings as SettingsIcon,
  AlertCircle,
  CheckCircle,
  Loader2,
  XCircle,
  KeyRound,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const STACKRYZE_NS = [
  "ns1.stackryze.com",
  "ns2.stackryze.com",
  "ns3.stackryze.com",
];

export default function DomainDetail() {
  const { id } = useParams();
  const { subdomains, refresh } = useDashboard();
  const { toast } = useToast();

  const [domain, setDomain] = useState(null);
  const [nameservers, setNameservers] = useState(STACKRYZE_NS);
  const MAX_NS = 6;
  const MIN_NS = 2;
  const [isEditingDNS, setIsEditingDNS] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenewing, setIsRenewing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dnsVerifyCode, setDnsVerifyCode] = useState("");
  const [isSettingCode, setIsSettingCode] = useState(false);
  const [dnsVerifyOpen, setDnsVerifyOpen] = useState(false);
  const [copiedFqdn, setCopiedFqdn] = useState(false);

  useEffect(() => {
    const foundDomain = subdomains.find((d) => d._id === id);
    if (foundDomain) {
      setDomain(foundDomain);
      if (foundDomain.recordType === "NS" && foundDomain.recordValue) {
        const parsed = foundDomain.recordValue
          .split(",")
          .map((n) => n.trim())
          .filter(Boolean);
        const padded = [...parsed];
        while (padded.length < MIN_NS) padded.push("");
        setNameservers(padded);
      } else {
        setNameservers(STACKRYZE_NS);
      }
    }
    setIsLoading(false);
  }, [id, subdomains]);

  const handleRenew = async () => {
    setIsRenewing(true);
    try {
      const updated = await subdomainAPI.renew(domain._id);
      const fallbackExpiry = domain.expiresAt
        ? new Date(
            new Date(domain.expiresAt).setFullYear(
              new Date(domain.expiresAt).getFullYear() + 1
            )
          )
        : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
      const displayExpiry = (
        updated?.expiresAt ? new Date(updated.expiresAt) : fallbackExpiry
      ).toLocaleDateString("en-GB");
      toast({
        title: "Domain Renewed",
        description: `${domain.name}.${domain.domain || "indevs.in"} extended for 1 year. New expiry date: ${displayExpiry}`,
        variant: "success",
      });
      await refresh();
    } catch (error) {
      toast({
        title: "Cannot Renew Domain",
        description:
          error.message ||
          "Renewals are only available within 60 days before expiry.",
        variant: "destructive",
      });
    } finally {
      setIsRenewing(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await subdomainAPI.delete(domain._id);
      toast({
        title: "Deletion Request Submitted",
        description:
          "Your deletion request will be reviewed by an admin. The domain remains active until approved.",
      });
      await refresh();
    } catch (error) {
      toast({
        title: "Deletion Failed",
        description:
          error.message ||
          "Unable to delete domain. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleSetDnsVerificationCode = async () => {
    if (!dnsVerifyCode.trim() || dnsVerifyCode.trim().length < 10) {
      toast({
        title: "Invalid Code",
        description:
          "Please enter a valid verification code from dns.stackryze.com.",
        variant: "destructive",
      });
      return;
    }

    setIsSettingCode(true);
    try {
      await subdomainAPI.setDnsVerificationCode(domain._id, dnsVerifyCode.trim());
      toast({
        title: "Verification Code Saved",
        description:
          "Return to dns.stackryze.com and click Verify Ownership to complete verification.",
        variant: "success",
      });
      setDnsVerifyOpen(false);
      setDnsVerifyCode("");
      await refresh();
    } catch (error) {
      toast({
        title: "Failed to Set Code",
        description:
          error.message || "Unable to set verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSettingCode(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="w-7 h-7 text-muted-foreground mx-auto mb-3 animate-spin" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">Loading domain details…</p>
      </div>
    );
  }

  if (!domain) {
    return (
      <div className="py-24 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto" aria-hidden="true" />
        <div>
          <h2 className="text-xl font-semibold text-foreground">Domain Not Found</h2>
          <p className="text-sm text-muted-foreground mt-1">
            This domain does not exist or you do not have access to it.
          </p>
        </div>
        <Link
          to="/my-domains"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border bg-card text-foreground text-sm font-medium hover:bg-secondary"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Domains</span>
        </Link>
      </div>
    );
  }

  const fqdn = `${domain.name}.${domain.domain || "indevs.in"}`;
  const daysUntilExpiry = domain.expiresAt
    ? Math.ceil((new Date(domain.expiresAt) - new Date()) / (1000 * 60 * 60 * 24))
    : null;
  const usingStackNS = nameservers.every(
    (ns) => !ns || ns.toLowerCase().endsWith("stackryze.com")
  );

  return (
    <div className="space-y-6 w-full">
      <ConsoleHeader
        eyebrow={
          <div className="flex items-center gap-2">
            <Link
              to="/my-domains"
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-3 h-3" aria-hidden="true" />
              <span>Domains</span>
            </Link>
            <span className="text-border">/</span>
            <span className="truncate">{domain._id}</span>
          </div>
        }
        title={fqdn}
        monoTitle
        badge={
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-medium ${
                domain.status === "Active"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  : domain.status === "Pending Deletion"
                  ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                  : "bg-destructive/10 text-destructive border-destructive/20"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  domain.status === "Active"
                    ? "bg-emerald-500"
                    : domain.status === "Pending Deletion"
                    ? "bg-amber-500"
                    : "bg-destructive"
                }`}
                aria-hidden="true"
              />
              {domain.status}
            </span>

            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(fqdn);
                setCopiedFqdn(true);
                setTimeout(() => setCopiedFqdn(false), 1500);
              }}
              aria-label={`Copy ${fqdn}`}
              className="p-1.5 rounded-md border border-border bg-card text-muted-foreground hover:text-foreground"
            >
              {copiedFqdn ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
              ) : (
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
              )}
            </button>
            <a
              href={`https://${fqdn}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${fqdn}`}
              className="p-1.5 rounded-md border border-border bg-card text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        }
        actions={
          <button
            type="button"
            onClick={handleRenew}
            disabled={
              isRenewing ||
              domain.status === "Pending Deletion" ||
              domain.status === "Suspended" ||
              (daysUntilExpiry !== null &&
                (daysUntilExpiry > 60 || daysUntilExpiry < -15))
            }
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-foreground text-background text-sm font-medium hover:bg-foreground/90 disabled:opacity-40"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRenewing ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            <span>{isRenewing ? "Renewing…" : "Renew Domain"}</span>
          </button>
        }
      />

      {/* Metadata Strip */}
      <div className="rounded-lg border border-border bg-border grid grid-cols-1 sm:grid-cols-3 gap-px overflow-hidden">
        <div className="bg-card px-5 py-4 space-y-1">
          <p className="text-xs text-muted-foreground">Registered</p>
          <p className="font-mono text-sm font-medium text-foreground tabular-nums">
            {domain.createdAt
              ? new Date(domain.createdAt).toLocaleDateString("en-GB")
              : "N/A"}
          </p>
        </div>

        <div className="bg-card px-5 py-4 space-y-1">
          <p className="text-xs text-muted-foreground">Expires</p>
          <p className="font-mono text-sm font-medium text-foreground tabular-nums">
            {domain.expiresAt
              ? new Date(domain.expiresAt).toLocaleDateString("en-GB")
              : "Never"}
          </p>
        </div>

        <div className="bg-card px-5 py-4 space-y-1">
          <p className="text-xs text-muted-foreground">Renewal Window</p>
          <p className="text-sm font-medium text-foreground tabular-nums">
            {daysUntilExpiry !== null && daysUntilExpiry > 60 ? (
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                Opens in {daysUntilExpiry - 60}d
              </span>
            ) : (
              "1 Year (Renewable)"
            )}
          </p>
        </div>
      </div>

      {daysUntilExpiry !== null &&
        daysUntilExpiry <= 60 &&
        daysUntilExpiry >= -15 &&
        domain.status !== "Suspended" &&
        domain.status !== "Pending Deletion" && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-5 py-3.5 flex items-center gap-3 text-xs sm:text-sm">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" aria-hidden="true" />
            <p className="text-foreground">
              {daysUntilExpiry > 0
                ? `Domain expires in ${daysUntilExpiry} day${daysUntilExpiry === 1 ? "" : "s"}.`
                : daysUntilExpiry === 0
                ? "Domain expires today."
                : `Domain expired ${Math.abs(daysUntilExpiry)} day${
                    Math.abs(daysUntilExpiry) === 1 ? "" : "s"
                  } ago (15-day grace period).`}{" "}
              <span className="text-muted-foreground">
                Use Renew Domain above to extend for another year for free.
              </span>
            </p>
          </div>
        )}

      {domain.status === "Pending Deletion" && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-5 py-3.5 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Domain Locked:</strong> Deletion request is under review (within 48 hours). Contact support to cancel.
          </p>
        </div>
      )}

      {domain.status === "Suspended" && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-5 py-3.5 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            <strong className="text-destructive">Domain Suspended:</strong> DNS resolution is disabled by an administrator. Contact support if you believe this is an error.
          </p>
        </div>
      )}

      {/* Nameservers Editor Panel */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-base font-semibold text-foreground">
                <Globe className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                <span>Nameservers (NS1–NS6)</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Use Stackryze DNS (<span className="font-mono text-foreground">ns1–ns3.stackryze.com</span>) or delegate to any external DNS provider.
              </p>
            </div>

            {domain.status !== "Pending Deletion" &&
              domain.status !== "Suspended" && (
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {isEditingDNS && (
                    <button
                      type="button"
                      onClick={() => setNameservers(STACKRYZE_NS)}
                      disabled={usingStackNS}
                      className="px-3 py-1.5 rounded-md border border-border bg-secondary/70 text-foreground text-xs font-medium hover:bg-secondary disabled:opacity-40"
                    >
                      Reset to StackNS
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      if (isEditingDNS) {
                        if (domain.recordType === "NS" && domain.recordValue) {
                          const parsed = domain.recordValue
                            .split(",")
                            .map((n) => n.trim())
                            .filter(Boolean);
                          const padded = [...parsed];
                          while (padded.length < MIN_NS) padded.push("");
                          setNameservers(padded);
                        } else {
                          setNameservers(STACKRYZE_NS);
                        }
                        setIsEditingDNS(false);
                      } else {
                        setIsEditingDNS(true);
                      }
                    }}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md border text-xs font-medium shrink-0 ${
                      isEditingDNS
                        ? "bg-destructive/10 border-destructive/25 text-destructive"
                        : "bg-secondary border-border text-foreground hover:bg-accent"
                    }`}
                  >
                    {isEditingDNS ? (
                      <>
                        <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Cancel</span>
                      </>
                    ) : (
                      <>
                        <SettingsIcon className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Edit Nameservers</span>
                      </>
                    )}
                  </button>
                </div>
              )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nameservers.map((ns, idx) => {
              const isRequired = idx < MIN_NS;
              const label = `NS${idx + 1}${isRequired ? "" : " (Optional)"}`;
              const inputId = `ns-input-${idx}`;
              return (
                <div key={idx} className="flex items-end gap-2">
                  <div className="flex-1 space-y-1.5">
                    <Label
                      htmlFor={inputId}
                      className="text-xs font-medium text-muted-foreground"
                    >
                      {label}
                    </Label>
                    <Input
                      id={inputId}
                      value={ns}
                      onChange={(e) => {
                        const updated = [...nameservers];
                        updated[idx] = e.target.value;
                        setNameservers(updated);
                      }}
                      placeholder={`ns${idx + 1}.example.com…`}
                      spellCheck={false}
                      className={`font-mono text-sm rounded-md ${
                        isEditingDNS
                          ? "bg-background border-foreground/35"
                          : "bg-secondary/40 text-muted-foreground cursor-not-allowed"
                      }`}
                      readOnly={!isEditingDNS}
                    />
                  </div>
                  {isEditingDNS && !isRequired && (
                    <button
                      type="button"
                      onClick={() =>
                        setNameservers(nameservers.filter((_, i) => i !== idx))
                      }
                      aria-label={`Remove nameserver ${idx + 1}`}
                      className="h-9 w-9 shrink-0 rounded-md bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/25 font-semibold flex items-center justify-center"
                    >
                      −
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {isEditingDNS && nameservers.length < MAX_NS && (
            <button
              type="button"
              onClick={() => setNameservers([...nameservers, ""])}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground hover:underline"
            >
              <span>+ Add nameserver</span>
              <span className="text-muted-foreground">
                ({MAX_NS - nameservers.length} remaining)
              </span>
            </button>
          )}
        </div>

        <div className="px-6 py-3.5 border-t border-border bg-secondary/25 flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs text-muted-foreground">
            NS changes may take up to 48 hours to propagate globally.
          </span>
          {isEditingDNS && (
            <button
              type="button"
              onClick={async () => {
                const filled = nameservers.map((n) => n.trim()).filter(Boolean);
                const seen = new Set();
                const unique = filled.filter((ns) => {
                  const key = ns.toLowerCase();
                  if (seen.has(key)) return false;
                  seen.add(key);
                  return true;
                });
                if (unique.length < MIN_NS) {
                  toast({
                    title: "Validation Error",
                    description: `At least ${MIN_NS} nameservers (NS1 and NS2) are required.`,
                    variant: "destructive",
                  });
                  return;
                }
                try {
                  await subdomainAPI.update(domain._id, {
                    recordValue: unique.join(", "),
                  });
                  toast({
                    title: "Nameservers Updated",
                    description: `${unique.length} nameserver${
                      unique.length > 1 ? "s" : ""
                    } saved.`,
                    variant: "success",
                  });
                  setIsEditingDNS(false);
                  await refresh();
                } catch (error) {
                  toast({
                    title: "Update Failed",
                    description:
                      error.message ||
                      "Unable to update nameservers. Please try again.",
                    variant: "destructive",
                  });
                }
              }}
              className="px-4 py-1.5 bg-foreground text-background hover:bg-foreground/90 rounded-md font-medium text-xs shrink-0"
            >
              Save Nameservers
            </button>
          )}
        </div>
      </div>

      {/* Ownership Verification Panel */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-base font-semibold text-foreground">
              <KeyRound className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <span>Stackryze DNS Ownership</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Managing DNS records on{" "}
              <a
                href="https://dns.stackryze.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-foreground underline underline-offset-4"
              >
                dns.stackryze.com
              </a>
              ? Paste your zone verification token here.
            </p>
            {domain.ownershipVerified ? (
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="w-4 h-4" aria-hidden="true" />
                <span>Ownership verified on dns.stackryze.com</span>
              </div>
            ) : domain.dnsVerificationCode ? (
              <div className="flex items-center gap-2 text-xs font-medium text-amber-500">
                <CheckCircle className="w-4 h-4" aria-hidden="true" />
                <span>Token saved — verify on dns.stackryze.com</span>
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => setDnsVerifyOpen(true)}
            disabled={
              domain.status === "Pending Deletion" ||
              domain.status === "Suspended"
            }
            className="self-start sm:self-center shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border bg-secondary text-foreground text-xs font-medium hover:bg-accent disabled:opacity-40"
          >
            <KeyRound className="w-3.5 h-3.5" aria-hidden="true" />
            <span>
              {domain.ownershipVerified
                ? "Re-verify Token"
                : domain.dnsVerificationCode
                ? "Update Code"
                : "Add Verification Code"}
            </span>
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      {domain.status !== "Pending Deletion" && (
        <div className="rounded-lg border border-destructive/30 bg-card overflow-hidden">
          <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-destructive">
                Delete Domain
              </h2>
              <p className="text-sm text-muted-foreground">
                Submit a deletion request for administrator review before permanently releasing this subdomain.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDeleteDialogOpen(true)}
              className="self-start sm:self-center shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-destructive text-destructive-foreground text-xs font-medium hover:bg-destructive/90"
            >
              <Trash className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Delete Domain</span>
            </button>
          </div>
        </div>
      )}

      {/* DNS Verification Dialog */}
      <AlertDialog open={dnsVerifyOpen} onOpenChange={setDnsVerifyOpen}>
        <AlertDialogContent className="bg-card border border-border sm:rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-foreground">
              <KeyRound className="w-4 h-4 text-foreground" aria-hidden="true" />
              DNS Verification Code
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Paste the verification code from{" "}
              <strong className="text-foreground">dns.stackryze.com</strong> for{" "}
              <span className="font-mono text-foreground">{fqdn}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-3 space-y-4">
            <div className="bg-secondary/50 border border-border rounded-md p-3.5 text-xs text-muted-foreground space-y-1">
              <p>
                1. Open{" "}
                <a
                  href="https://dns.stackryze.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground underline"
                >
                  dns.stackryze.com
                </a>
              </p>
              <p>
                2. Add zone <strong className="font-mono text-foreground">{fqdn}</strong>
              </p>
              <p>3. Copy the verification token and paste it below</p>
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="dns-verify-input"
                className="text-xs font-medium text-muted-foreground"
              >
                Verification Code
              </Label>
              <Input
                id="dns-verify-input"
                value={dnsVerifyCode}
                onChange={(e) => setDnsVerifyCode(e.target.value)}
                placeholder="sryze-verify-…"
                spellCheck={false}
                className="font-mono text-sm rounded-md"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-md">Cancel</AlertDialogCancel>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleSetDnsVerificationCode();
              }}
              disabled={isSettingCode || !dnsVerifyCode.trim()}
              className="px-4 py-2 bg-foreground text-background hover:bg-foreground/90 rounded-md text-sm font-medium disabled:opacity-45"
            >
              {isSettingCode ? "Saving…" : "Save Code"}
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border border-border sm:rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Domain?</AlertDialogTitle>
            <AlertDialogDescription>
              Your deletion request for{" "}
              <strong className="font-mono text-foreground">{fqdn}</strong> will be queued for administrator review. The domain remains active until approved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-md">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md"
            >
              {isDeleting ? "Submitting…" : "Submit Deletion Request"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
