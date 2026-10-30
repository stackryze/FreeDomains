import { Globe, Plus, Settings, Clock, CheckCircle, ArrowRight, Search, History, Shield } from "lucide-react";
import { useDashboard } from "@/context/dashboard-context";
import { useAuth } from "@/context/auth-context";
import { Link } from "react-router-dom";
import { useCountUp } from "@/hooks/useCountUp";

export default function Overview() {
    const { subdomains, loading } = useDashboard();
    const { user } = useAuth();

    const totalCount = subdomains.length;
    const activeCount = subdomains.filter(d => d.status === "Active").length;
    const expiringCount = subdomains.filter(d => {
        if (!d.expiresAt) return false;
        const days = Math.ceil((new Date(d.expiresAt) - new Date()) / 864e5);
        return days > 0 && days <= 30;
    }).length;
    const expiredCount = subdomains.filter(d => d.status === "Expired").length;

    // Most recently created domains (up to 3)
    const recentDomains = [...subdomains]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);

    const greeting = () => {
        const h = new Date().getHours();
        if (h < 12) return "Good morning";
        if (h < 17) return "Good afternoon";
        return "Good evening";
    };

    if (loading && subdomains.length === 0) {
        return (
            <div className="max-w-[1600px] animate-pulse space-y-6">
                <div className="h-8 bg-muted rounded-lg w-48" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-muted rounded-2xl" />)}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-muted rounded-2xl" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] space-y-6">

            {/* ── Greeting header ── */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-signal mb-1">Registry Console</p>
                    <h1 className="text-3xl md:text-4xl font-display font-medium text-foreground leading-tight">
                        {greeting()}, {user?.name?.split(" ")[0] || "there"}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {totalCount === 0 ? "Register your first free domain to get started." : `You have ${totalCount} active domain${totalCount > 1 ? "s" : ""} on Stackryze.`}
                    </p>
                </div>
                <Link
                    to="/register"
                    className="inline-flex items-center gap-2 self-start sm:self-auto px-5 py-2.5 bg-signal text-signal-foreground text-sm font-semibold rounded-xl hover:bg-signal/90 transition-all duration-150 active:scale-[0.97] shadow-signal"
                >
                    <Plus className="w-4 h-4" />
                    Register Domain
                </Link>
            </div>

            {/* ── Stat cards — one accent (signal) for the overview total,
                 semantic status colors for the rest: success/warning/destructive,
                 never signal, so "Active" doesn't visually compete with
                 the brand action color. ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <StatCard value={totalCount} label="Total" sub="domains" tone="neutral" to="/my-domains" />
                <StatCard value={activeCount} label="Active" sub="running" tone="success" to="/my-domains" />
                <StatCard value={expiringCount} label="Expiring" sub="within 30 days" tone={expiringCount > 0 ? "warning" : "neutral"} to="/my-domains" />
                <StatCard value={expiredCount} label="Expired" sub="domains" tone={expiredCount > 0 ? "destructive" : "neutral"} to="/my-domains" />
            </div>

            {/* ── KYC / GitHub verification status ── */}
            {user?.githubVerified ? (
                <div className="flex items-center gap-3 px-4 py-3 bg-success/10 border border-success/20 rounded-2xl">
                    <div className="w-8 h-8 rounded-full bg-success/15 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-success" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">KYC Verified</p>
                        <p className="text-xs text-muted-foreground">GitHub identity verified — premium extensions (.sryze.cc, .ryzedns.org, .nx.kg, .ryzn.pro) unlocked</p>
                    </div>
                    <span className="shrink-0 text-xs font-semibold px-2.5 py-1 bg-success text-success-foreground rounded-full">Verified</span>
                </div>
            ) : (
                <a
                    href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/github/kyc/start`}
                    className="group flex items-center gap-3 px-4 py-3 bg-warning/10 border border-warning/20 rounded-2xl hover:border-warning/40 transition-colors cursor-pointer"
                >
                    <div className="w-8 h-8 rounded-full bg-warning/15 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-4 h-4 text-warning" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">KYC Not Verified</p>
                        <p className="text-xs text-muted-foreground">Complete GitHub verification to unlock sryze.cc, ryzedns.org, nx.kg &amp; ryzn.pro domains and extra quota</p>
                    </div>
                    <span className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full bg-warning text-warning-foreground group-hover:bg-warning/90 transition-colors">
                        Verify →
                    </span>
                </a>
            )}

            {/* ── Main grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Manage Domains */}
                <ActionCard
                    to="/my-domains"
                    icon={Globe}
                    iconColor="text-signal"
                    title="Manage Domains"
                    desc="View, renew, or configure your registered domains"
                />

                {/* DNS Config */}
                <ActionCard
                    to="/dns"
                    icon={Settings}
                    iconColor="text-foreground"
                    title="DNS Configuration"
                    desc="Set up NS delegation and manage DNS records"
                />

                {/* WHOIS Lookup */}
                <ActionCard
                    to="/whois"
                    icon={Search}
                    iconColor="text-foreground"
                    title="WHOIS Lookup"
                    desc="Look up registration info for any domain"
                    external={false}
                />

                {/* History */}
                <ActionCard
                    to="/history"
                    icon={History}
                    iconColor="text-foreground"
                    title="Activity History"
                    desc="Track changes, renewals, and domain events"
                />
            </div>

            {/* ── Recent domains ── */}
            {recentDomains.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Recent Domains</h2>
                        <Link to="/my-domains" className="text-xs font-medium text-foreground hover:text-signal flex items-center gap-1 transition-colors">
                            View all <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="space-y-2">
                        {recentDomains.map(d => (
                            <Link
                                key={d._id}
                                to={`/domains/${d._id}`}
                                className="flex items-center justify-between px-4 py-3 bg-card rounded-xl shadow-border transition-all group"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                                        <Globe className="w-4 h-4 text-foreground" />
                                    </div>
                                    <span className="font-mono font-medium text-sm text-foreground truncate">
                                        {d.name}.{d.domain}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <StatusPill status={d.status} />
                                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Empty state ── */}
            {totalCount === 0 && !loading && (
                <div className="relative bg-card rounded-2xl shadow-border p-8 md:p-10 text-center overflow-hidden">
                    <div aria-hidden className="bg-glow-signal pointer-events-none absolute inset-0" />
                    <div className="relative w-14 h-14 bg-signal/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-signal/20">
                        <Globe className="w-7 h-7 text-signal" />
                    </div>
                    <h3 className="relative text-2xl font-display font-medium text-foreground mb-2">Register your first domain</h3>
                    <p className="relative text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                        Free, instant, and takes under a minute. Claim your personal <strong>.indevs.in</strong>, <strong>.sryze.cc</strong>, <strong>.ryzedns.org</strong>, <strong>.nx.kg</strong>, or <strong>.ryzn.pro</strong> subdomain.
                    </p>
                    <Link
                        to="/register"
                        className="relative inline-flex items-center gap-2 px-6 py-3 bg-signal text-signal-foreground font-semibold text-sm rounded-xl hover:bg-signal/90 transition-all duration-150 active:scale-[0.97] shadow-signal"
                    >
                        <Plus className="w-4 h-4" />
                        Register Now — It's Free
                    </Link>
                </div>
            )}
        </div>
    );
}

const STAT_TONES = {
    neutral: { dot: "bg-signal", text: "text-foreground" },
    success: { dot: "bg-success", text: "text-success" },
    warning: { dot: "bg-warning", text: "text-warning" },
    destructive: { dot: "bg-destructive", text: "text-destructive" },
};

function StatCard({ value, label, sub, tone, to }) {
    const { ref, display } = useCountUp(value, { duration: 700 });
    const t = STAT_TONES[tone] || STAT_TONES.neutral;
    return (
        <Link
            ref={ref}
            to={to}
            className="bg-card rounded-2xl p-4 md:p-5 shadow-border transition-all duration-150 group"
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${t.dot}`} />
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className={`text-3xl md:text-4xl font-display font-medium leading-none mt-3 tabular-nums ${t.text}`}>{display}</p>
            <p className="text-xs text-muted-foreground mt-1.5">{sub}</p>
        </Link>
    );
}

function ActionCard({ to, icon: Icon, iconColor, title, desc }) {
    return (
        <Link
            to={to}
            className="bg-card rounded-2xl p-5 flex items-center gap-4 shadow-border transition-all duration-150 group"
        >
            <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 transition-transform duration-150 group-hover:scale-105">
                <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm md:text-base text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{desc}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all flex-shrink-0" />
        </Link>
    );
}

function StatusPill({ status }) {
    const map = {
        Active:             { bg: "bg-success/10",     text: "text-success",     dot: "bg-success" },
        Expired:            { bg: "bg-destructive/10",  text: "text-destructive", dot: "bg-destructive" },
        Suspended:          { bg: "bg-destructive/10",  text: "text-destructive", dot: "bg-destructive" },
        "Pending Deletion": { bg: "bg-warning/10",       text: "text-warning",     dot: "bg-warning" },
        "Pending DNS":      { bg: "bg-info/10",          text: "text-info",        dot: "bg-info" },
    };
    const s = map[status] || { bg: "bg-muted", text: "text-muted-foreground", dot: "bg-muted-foreground" };
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {status}
        </span>
    );
}
