import { useEffect, useMemo, useState } from "react";
import {
  Globe,
  Plus,
  Shield,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  ArrowUpRight,
  Activity,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDashboard } from "@/context/dashboard-context";
import { useAuth } from "@/context/auth-context";
import { subdomainAPI } from "@/lib/api";
import { DEMO_ACTIVITIES, IS_LOCAL_DEMO } from "@/lib/demo-data";
import { useToast } from "@/hooks/use-toast";
import { ConsoleHeader } from "@/components/dashboard/ConsoleHeader";

const TLD_QUOTAS = [
  { key: "indevs.in", limitField: "domainLimit" },
  { key: "sryze.cc", limitField: "sryzeDomainsLimit" },
  { key: "ryzedns.org", limitField: "ryzeDnsDomainsLimit" },
  { key: "nx.kg", limitField: "nxKgDomainsLimit" },
  { key: "ryzn.pro", limitField: "ryznProDomainsLimit" },
];

export default function Overview() {
  const { subdomains, loading, refresh } = useDashboard();
  const { user } = useAuth();
  const { toast } = useToast();
  const [recentActivity, setRecentActivity] = useState([]);
  const [renewingId, setRenewingId] = useState(null);

  useEffect(() => {
    if (IS_LOCAL_DEMO) {
      setRecentActivity(DEMO_ACTIVITIES.slice(0, 4));
      return;
    }
    let cancelled = false;
    subdomainAPI
      .getActivity()
      .then((data) => {
        if (!cancelled && Array.isArray(data)) {
          setRecentActivity(data.slice(0, 4));
        }
      })
      .catch(() => {
        if (!cancelled) setRecentActivity([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const { activeCount, attentionDomains } = useMemo(() => {
    const active = subdomains.filter((d) => d.status === "Active").length;
    const needsAttention = subdomains.filter((d) => {
      const days = d.expiresAt
        ? Math.ceil((new Date(d.expiresAt) - new Date()) / 864e5)
        : null;
      return d.status !== "Active" || (days !== null && days <= 60);
    });
    return { activeCount: active, attentionDomains: needsAttention };
  }, [subdomains]);

  const handleQuickRenew = async (domain) => {
    setRenewingId(domain._id);
    try {
      const updated = await subdomainAPI.renew(domain._id);
      const expiryStr = updated?.expiresAt
        ? new Date(updated.expiresAt).toLocaleDateString("en-GB")
        : null;
      toast({
        title: "Domain Renewed",
        description: `${domain.name}.${domain.domain || "indevs.in"} extended for 1 year.${expiryStr ? ` New expiry: ${expiryStr}` : ""
          }`,
        variant: "success",
      });
      await refresh();
    } catch (err) {
      toast({
        title: "Cannot Renew Domain",
        description: err.message || "Unable to renew domain right now.",
        variant: "destructive",
      });
    } finally {
      setRenewingId(null);
    }
  };

  if (loading && subdomains.length === 0) {
    return (
      <div>
        <ConsoleHeader
          eyebrow="Registry Console"
          title="Overview"
          description="Loading registry status and quotas…"
        />
        <div className="p-6 sm:p-10 space-y-6 animate-pulse">
          <div className="h-24 bg-muted/60 rounded-lg" />
          <div className="h-64 bg-muted/60 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <ConsoleHeader
        eyebrow="Registry Console"
        title="Overview"
        description={
          user?.name
            ? `Welcome back, ${user.name}. Account status, namespace quotas, and domains requiring attention.`
            : "Account status, namespace quotas, and domains requiring attention."
        }
        badge={
          user?.githubVerified ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle className="w-3 h-3" aria-hidden="true" />
              GitHub Verified
            </span>
          ) : null
        }
        actions={
          <Link
            to="/register"
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-foreground text-background text-sm font-medium hover:bg-foreground/90"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Register Domain</span>
          </Link>
        }
      />

      {!user?.githubVerified && (
        <a
          href={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/github/kyc/start`}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 sm:px-10 py-4 border-b border-border bg-amber-500/10 hover:bg-amber-500/15"
        >
          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4 text-amber-500 shrink-0" aria-hidden="true" />
            <p className="text-xs sm:text-sm text-foreground">
              <strong className="font-semibold">GitHub Verification Required:</strong>{" "}
              <span className="text-muted-foreground">
                Verify your GitHub account once to unlock domain registration across all five extensions.
              </span>
            </p>
          </div>
          <span className="self-start sm:self-center shrink-0 px-4 py-1.5 rounded-full bg-amber-500 text-white text-xs font-medium">
            Verify Account
          </span>
        </a>
      )}

      {/* Band 1: 3-Column Flush Hairline Telemetry Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border border-b border-border">
        <div className="bg-background px-6 sm:px-10 py-6 space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Registered Domains</p>
          <p className="font-mono text-3xl font-semibold tabular-nums tracking-[-0.03em] text-foreground">
            {subdomains.length}
          </p>
        </div>
        <div className="bg-background px-6 sm:px-10 py-6 space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Active &amp; Resolving</p>
          <p className="font-mono text-3xl font-semibold tabular-nums tracking-[-0.03em] text-emerald-500">
            {activeCount}
          </p>
        </div>
        <div className="bg-background px-6 sm:px-10 py-6 space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Needs Attention</p>
          <p
            className={`font-mono text-3xl font-semibold tabular-nums tracking-[-0.03em] ${attentionDomains.length > 0 ? "text-amber-500" : "text-foreground"
              }`}
          >
            {attentionDomains.length}
          </p>
        </div>
      </div>

      {/* Band 2: Split Namespace Quotas + Action Queue & Recent Activity */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 divide-y xl:divide-y-0 xl:divide-x divide-border">
        {/* Left: Quotas */}
        <div className="xl:col-span-4 flex flex-col">
          <div className="px-6 sm:px-8 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Namespace Quotas
            </h2>
            <Link
              to="/register"
              className="font-mono text-xs text-muted-foreground hover:text-foreground"
            >
              Claim
            </Link>
          </div>

          <div className="divide-y divide-border flex-1">
            {TLD_QUOTAS.map(({ key, limitField }) => {
              const count =
                subdomains?.filter((s) => (s.domain || "indevs.in") === key).length || 0;
              const limit = user?.[limitField] || 1;
              return (
                <div
                  key={key}
                  className="px-6 sm:px-8 py-4 flex items-center justify-between gap-4 text-xs sm:text-sm"
                >
                  <span className="font-mono text-foreground">.{key}</span>
                  <span className="font-mono text-muted-foreground tabular-nums">
                    {count} / {limit}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Action Required + Recent Activity */}
        <div className="xl:col-span-8 flex flex-col divide-y divide-border">
          {/* Action Required */}
          <div className="flex flex-col">
            <div className="px-6 sm:px-8 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Action Required
              </h2>
              <Link
                to="/my-domains"
                className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground"
              >
                <span>Open directory</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>

            {subdomains.length === 0 ? (
              <div className="p-10 text-center space-y-3">
                <Globe className="w-6 h-6 text-muted-foreground mx-auto" aria-hidden="true" />
                <p className="text-sm font-medium text-foreground">No domains registered yet</p>
                <p className="text-xs text-muted-foreground">
                  Register your first free subdomain to configure DNS delegation.
                </p>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-foreground text-background text-xs font-medium hover:bg-foreground/90"
                >
                  <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Register Domain</span>
                </Link>
              </div>
            ) : attentionDomains.length > 0 ? (
              <div className="divide-y divide-border">
                {attentionDomains.map((d) => {
                  const fqdn = `${d.name}.${d.domain || "indevs.in"}`;
                  const days = d.expiresAt
                    ? Math.ceil((new Date(d.expiresAt) - new Date()) / 864e5)
                    : null;
                  const canRenew =
                    d.status !== "Pending Deletion" &&
                    d.status !== "Suspended" &&
                    days !== null &&
                    days <= 60 &&
                    days >= -15;

                  return (
                    <div
                      key={d._id}
                      className="px-6 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-secondary/25"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        {d.status === "Expired" || d.status === "Suspended" ? (
                          <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" aria-hidden="true" />
                        ) : (
                          <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
                        )}
                        <div className="min-w-0">
                          <Link
                            to={`/domains/${d._id}`}
                            className="font-mono text-sm font-medium text-foreground hover:underline break-all"
                          >
                            {fqdn}
                          </Link>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {d.status === "Expired"
                              ? "Expired — inside 15-day renewal grace period"
                              : d.status !== "Active"
                                ? `Status: ${d.status}`
                                : `Expires in ${days} day${days === 1 ? "" : "s"}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 pl-7 sm:pl-0">
                        {canRenew && (
                          <button
                            type="button"
                            onClick={() => handleQuickRenew(d)}
                            disabled={renewingId === d._id}
                            className="inline-flex items-center gap-1.5 h-8 px-4 rounded-full bg-foreground text-background text-xs font-medium hover:bg-foreground/90 disabled:opacity-50"
                          >
                            <RefreshCw
                              className={`w-3 h-3 ${renewingId === d._id ? "animate-spin" : ""}`}
                              aria-hidden="true"
                            />
                            <span>Renew</span>
                          </button>
                        )}
                        <Link
                          to={`/domains/${d._id}`}
                          className="inline-flex items-center h-8 px-4 rounded-full border border-border bg-card text-foreground text-xs font-medium hover:bg-secondary"
                        >
                          Manage
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="px-6 sm:px-8 py-5 flex items-center justify-between gap-4">
                <span className="flex items-center gap-2.5 text-xs sm:text-sm text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" aria-hidden="true" />
                  All {subdomains.length} registered domains are active with no renewals due.
                </span>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          {recentActivity.length > 0 && (
            <div className="flex flex-col flex-1">
              <div className="px-6 sm:px-8 py-4 border-b border-border flex items-center justify-between">
                <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Recent Activity
                </h2>
                <Link
                  to="/history"
                  className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground"
                >
                  <span>Full audit log</span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>

              <div className="divide-y divide-border">
                {recentActivity.map((item, idx) => (
                  <div
                    key={item._id || idx}
                    className="px-6 sm:px-8 py-3.5 flex items-center justify-between gap-4 text-xs sm:text-sm"
                  >
                    <span className="flex items-center gap-2.5 text-foreground min-w-0">
                      <Activity className="w-3.5 h-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
                      <span className="truncate">{item.description}</span>
                    </span>
                    <span className="font-mono text-xs text-muted-foreground shrink-0 tabular-nums">
                      {new Date(item.timestamp).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
