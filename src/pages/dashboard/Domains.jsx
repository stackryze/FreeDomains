import { useMemo, useState, useEffect } from "react";
import { useDashboard } from "@/context/dashboard-context";
import { useAuth } from "@/context/auth-context";
import { Link } from "react-router-dom";
import {
  Globe,
  RefreshCw,
  Settings as SettingsIcon,
  Plus,
  Shield,
  Github,
  Search,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { subdomainAPI } from "@/lib/api";
import { ConsoleHeader } from "@/components/dashboard/ConsoleHeader";

const TLD_FILTERS = [
  "indevs.in",
  "sryze.cc",
  "ryzedns.org",
  "nx.kg",
  "ryzn.pro",
];

export default function Domains() {
  const { subdomains, loading, refresh } = useDashboard();
  const { user, checkAuth } = useAuth();
  const { toast } = useToast();
  const [isRenewing, setIsRenewing] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [tldFilter, setTldFilter] = useState("all");
  const [copiedId, setCopiedId] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchVerification = async () => {
      try {
        const response = await fetch(`${API_BASE}/github/verification-status`, {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          if (data.verification && data.verification.status === "pending") {
            setPendingVerification(data.verification);
          }
        }
      } catch (error) {
        console.error("Failed to fetch verification status:", error);
      }
    };
    fetchVerification();
  }, [API_BASE]);

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredDomains = useMemo(() => {
    return subdomains.filter((d) => {
      const root = d.domain || "indevs.in";
      const fqdn = `${d.name}.${root}`.toLowerCase();
      const matchesSearch =
        !searchQuery.trim() || fqdn.includes(searchQuery.trim().toLowerCase());
      const matchesTld = tldFilter === "all" || root === tldFilter;
      return matchesSearch && matchesTld;
    });
  }, [subdomains, searchQuery, tldFilter]);

  const handleCopyFqdn = (id, fqdn) => {
    navigator.clipboard.writeText(fqdn);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1600);
  };

  const handleRenew = async (domain) => {
    setIsRenewing(true);
    try {
      const updated = await subdomainAPI.renew(domain._id);
      const newExpiryStr = updated?.expiresAt
        ? new Date(updated.expiresAt).toLocaleDateString("en-GB")
        : null;

      toast({
        title: "Domain Renewed",
        description: `${domain.name}.${domain.domain || "indevs.in"} extended for 1 year.${newExpiryStr ? ` New expiry date: ${newExpiryStr}` : ""
          }`,
        variant: "success",
      });

      await refresh();
    } catch (error) {
      toast({
        title: "Cannot Renew Domain",
        description:
          error.message ||
          "Renewals are only allowed within 60 days of expiry.",
        variant: "destructive",
      });
    } finally {
      setIsRenewing(false);
    }
  };

  const StatusBadge = ({ status }) => {
    const map = {
      Active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      "Pending Deletion": "bg-amber-500/10 text-amber-500 border-amber-500/20",
      "Deletion Review": "bg-destructive/10 text-destructive border-destructive/20",
      Suspended: "bg-destructive/10 text-destructive border-destructive/20",
      Expired: "bg-destructive/10 text-destructive border-destructive/20",
      "Pending DNS": "bg-amber-500/10 text-amber-500 border-amber-500/20",
      Pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    };
    const dotStyles = {
      Active: "bg-emerald-500",
      "Pending Deletion": "bg-amber-500",
      "Deletion Review": "bg-destructive",
      Suspended: "bg-destructive",
      Expired: "bg-destructive",
      "Pending DNS": "bg-amber-500",
      Pending: "bg-amber-500",
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-medium ${map[status] || "bg-secondary border-border text-muted-foreground"
          }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotStyles[status] || dotStyles.Pending}`}
          aria-hidden="true"
        />
        {status}
      </span>
    );
  };

  return (
    <TooltipProvider delayDuration={150}>
      <div className="space-y-6 w-full">
        <ConsoleHeader
          title="Domains"
          description="Search, filter, renew, and configure nameservers for your registered subdomains."
          actions={
            <>
              <button
                type="button"
                onClick={refresh}
                disabled={loading}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md border border-border bg-card text-foreground text-sm font-medium hover:bg-secondary disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  aria-hidden="true"
                />
                <span>{loading ? "Refreshing…" : "Refresh"}</span>
              </button>
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-foreground text-background text-sm font-medium hover:bg-foreground/90"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>Add Domain</span>
              </Link>
            </>
          }
        />

        {pendingVerification && (
          <div className="px-4 py-3.5 rounded-lg border border-amber-500/30 bg-amber-500/10 flex items-start gap-3">
            <Shield className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs sm:text-sm text-foreground">
              <strong className="font-medium">GitHub Verification Pending:</strong>{" "}
              <span className="font-mono">{pendingVerification.requestedDomain}.sryze.cc</span> is awaiting review.
            </p>
          </div>
        )}

        {!user?.githubVerified && (
          <div className="px-5 py-4 rounded-lg border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Verify your GitHub account to unlock registration across all five namespaces.
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href="https://github.com/stackryze/FreeDomains"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md border border-border bg-card text-foreground text-xs font-medium hover:bg-secondary"
              >
                Star Repo
              </a>
              <a
                href={`${API_BASE}/github/kyc/start?domain=&root=indevs.in`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-foreground text-background text-xs font-medium hover:bg-foreground/90"
              >
                <Github className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Verify Now</span>
              </a>
            </div>
          </div>
        )}

        {/* Search + Filter Pills */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search
              className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search domains…"
              aria-label="Search registered domains"
              className="w-full h-9 pl-9 pr-3 rounded-md border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/40"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1 p-1 rounded-md bg-card border border-border">
            <button
              type="button"
              onClick={() => setTldFilter("all")}
              className={`px-3 py-1.5 rounded text-xs ${tldFilter === "all"
                ? "bg-foreground text-background font-medium"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              All ({subdomains.length})
            </button>

            {TLD_FILTERS.map((key) => {
              const active = tldFilter === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTldFilter(key)}
                  className={`px-3 py-1.5 rounded text-xs font-mono ${
                    active
                      ? "bg-foreground text-background font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  .{key}
                </button>
              );
            })}
          </div>
        </div>

        {/* Crisp Single-Line Vercel Domains Table */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="border-b border-border bg-secondary/25">
                <tr>
                  <th className="px-5 py-3 text-xs font-medium text-muted-foreground">
                    Domain
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-muted-foreground hidden md:table-cell">
                    Nameservers
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-muted-foreground hidden sm:table-cell">
                    Status
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-muted-foreground hidden lg:table-cell">
                    Expires
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading && subdomains.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-muted-foreground">
                      <RefreshCw className="w-5 h-5 mx-auto mb-2 animate-spin" aria-hidden="true" />
                      <p className="text-sm">Loading domains…</p>
                    </td>
                  </tr>
                ) : (
                  filteredDomains.map((domain) => {
                    const root = domain.domain || "indevs.in";
                    const fqdn = `${domain.name}.${root}`;
                    const nsList =
                      domain.recordType === "NS" && domain.recordValue
                        ? domain.recordValue.split(",").map((n) => n.trim()).filter(Boolean)
                        : domain.nameservers || [];
                    const effectiveNs =
                      nsList.length > 0 ? nsList : ["ns1.stackryze.com", "ns2.stackryze.com", "ns3.stackryze.com"];
                    const isStackNS = effectiveNs.some((n) =>
                      n.toLowerCase().endsWith("stackryze.com")
                    );

                    const daysUntilExpiry = domain.expiresAt
                      ? Math.ceil(
                        (new Date(domain.expiresAt) - new Date()) / (1000 * 60 * 60 * 24)
                      )
                      : null;
                    const isLockedStatus =
                      domain.status === "Pending Deletion" || domain.status === "Suspended";
                    const outsideWindow =
                      daysUntilExpiry !== null &&
                      (daysUntilExpiry > 60 || daysUntilExpiry < -15);
                    const canRenew = !isLockedStatus && !outsideWindow;
                    const isExpiringSoon =
                      daysUntilExpiry !== null && daysUntilExpiry > 0 && daysUntilExpiry <= 60;
                    const isGracePeriod =
                      daysUntilExpiry !== null && daysUntilExpiry <= 0 && daysUntilExpiry >= -15;

                    const renewTitle =
                      domain.status === "Pending Deletion"
                        ? "Cannot renew — deletion pending"
                        : domain.status === "Suspended"
                          ? "Cannot renew — domain suspended"
                          : daysUntilExpiry !== null && daysUntilExpiry > 60
                            ? `Renewal opens in ${daysUntilExpiry - 60} day${daysUntilExpiry - 60 === 1 ? "" : "s"
                            }`
                            : daysUntilExpiry !== null && daysUntilExpiry < -15
                              ? "Expired beyond 15-day grace period"
                              : "Extend for 1 free year";

                    return (
                      <tr
                        key={domain._id}
                        className="group hover:bg-secondary/35"
                      >
                        <td className="px-5 py-3.5 align-middle">
                          <div className="flex items-center gap-2 min-w-0">
                            <Globe className="w-3.5 h-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
                            <Link
                              to={`/domains/${domain._id}`}
                              className="font-mono text-sm hover:underline truncate"
                            >
                              <span className="text-foreground font-medium">{domain.name}</span>
                              <span className="text-muted-foreground">.{root}</span>
                            </Link>
                            <div className="flex items-center gap-0.5 sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100">
                              <button
                                type="button"
                                onClick={() => handleCopyFqdn(domain._id, fqdn)}
                                aria-label={`Copy ${fqdn}`}
                                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary"
                              >
                                {copiedId === domain._id ? (
                                  <Check className="w-3 h-3 text-emerald-500" aria-hidden="true" />
                                ) : (
                                  <Copy className="w-3 h-3" aria-hidden="true" />
                                )}
                              </button>
                              <a
                                href={`https://${fqdn}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Open ${fqdn} in new tab`}
                                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary"
                              >
                                <ExternalLink className="w-3 h-3" aria-hidden="true" />
                              </a>
                            </div>
                          </div>
                          <div className="sm:hidden mt-1.5 flex items-center gap-2">
                            <StatusBadge status={domain.status} />
                            {domain.expiresAt && (
                              <span className="text-[11px] font-mono text-muted-foreground tabular-nums">
                                {new Date(domain.expiresAt).toLocaleDateString("en-GB")}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-3.5 hidden md:table-cell align-middle">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="inline-flex items-center gap-2 font-mono text-xs max-w-[260px] cursor-default">
                                <span className="px-1.5 py-0.5 rounded bg-secondary border border-border text-[10px] uppercase tracking-wider text-foreground shrink-0">
                                  {isStackNS ? "StackNS" : "External"}
                                </span>
                                <span className="text-muted-foreground truncate">
                                  {effectiveNs[0]}
                                </span>
                                {effectiveNs.length > 1 && (
                                  <span className="text-[11px] text-muted-foreground/75 shrink-0">
                                    +{effectiveNs.length - 1}
                                  </span>
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="bg-card text-foreground border border-border text-xs font-mono space-y-0.5 p-2.5">
                              {effectiveNs.map((ns) => (
                                <div key={ns}>{ns}</div>
                              ))}
                            </TooltipContent>
                          </Tooltip>
                        </td>

                        <td className="px-5 py-3.5 hidden sm:table-cell align-middle whitespace-nowrap">
                          <StatusBadge status={domain.status} />
                        </td>

                        <td className="px-5 py-3.5 hidden lg:table-cell align-middle whitespace-nowrap">
                          <div className="flex items-center gap-2 font-mono text-xs tabular-nums">
                            <span className="text-foreground">
                              {domain.expiresAt
                                ? new Date(domain.expiresAt).toLocaleDateString("en-GB")
                                : "N/A"}
                            </span>
                            {isExpiringSoon && (
                              <span className="text-amber-500">
                                ({daysUntilExpiry}d left)
                              </span>
                            )}
                            {isGracePeriod && (
                              <span className="text-destructive">
                                (Grace period)
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-3.5 text-right align-middle whitespace-nowrap">
                          <div className="inline-flex items-center justify-end gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="inline-flex">
                                  <button
                                    type="button"
                                    onClick={() => handleRenew(domain)}
                                    disabled={isRenewing || loading || !canRenew}
                                    className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium ${canRenew
                                      ? "bg-foreground text-background hover:bg-foreground/90"
                                      : "border border-border/50 text-muted-foreground/45 cursor-not-allowed"
                                      }`}
                                  >
                                    <RefreshCw className="w-3 h-3" aria-hidden="true" />
                                    <span>Renew</span>
                                  </button>
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="bg-card text-foreground border border-border text-xs font-sans">
                                {renewTitle}
                              </TooltipContent>
                            </Tooltip>

                            <Link
                              to={`/domains/${domain._id}`}
                              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-border bg-secondary text-foreground text-xs font-medium hover:bg-accent"
                            >
                              <SettingsIcon className="w-3 h-3" aria-hidden="true" />
                              <span>Manage</span>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}

                {!loading && filteredDomains.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-14 text-center space-y-3">
                      <Globe className="w-8 h-8 text-muted-foreground mx-auto" aria-hidden="true" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          {subdomains.length === 0 ? "No domains registered" : "No matching domains"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {subdomains.length === 0
                            ? "Claim your first free subdomain to configure DNS."
                            : "Clear or adjust your search filter."}
                        </p>
                      </div>
                      {subdomains.length === 0 && (
                        <Link
                          to="/register"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-foreground text-background text-xs font-medium hover:bg-foreground/90"
                        >
                          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Register Domain</span>
                        </Link>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
