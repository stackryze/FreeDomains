import { Globe, Plus, Settings, Clock, CheckCircle, ArrowRight, Search, History, Shield } from "lucide-react";
import { useDashboard } from "@/context/dashboard-context";
import { useAuth } from "@/context/auth-context";
import { Link } from "react-router-dom";

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
                    className="inline-flex items-center gap-2 self-start sm:self-auto px-5 py-2.5 bg-foreground text-background text-sm font-semibold rounded-xl hover:bg-signal hover:text-signal-foreground transition-all duration-200 shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Register Domain
                </Link>
            </div>

            {/* ── Stat cards ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <StatCard
                    value={totalCount}
                    label="Total"
                    sub="domains"
                    accentClass="text-foreground"
                    dot="#4FBE7A"
                    to="/my-domains"
                />
                <StatCard
                    value={activeCount}
                    label="Active"
                    sub="running"
                    accentClass="text-signal"
                    dot="#4FBE7A"
                    to="/my-domains"
                />
                <StatCard
                    value={expiringCount}
                    label="Expiring"
                    sub="within 30 days"
                    accentClass={expiringCount > 0 ? "text-amber-500" : "text-foreground"}
                    dot={expiringCount > 0 ? "#fbbf24" : "var(--muted-foreground)"}
                    to="/my-domains"
                    warn={expiringCount > 0}
                />
                <StatCard
                    value={expiredCount}
                    label="Expired"
                    sub="domains"
                    accentClass={expiredCount > 0 ? "text-destructive" : "text-foreground"}
                    dot={expiredCount > 0 ? "#ef4444" : "var(--muted-foreground)"}
                    to="/my-domains"
                />
            </div>

            {/* ── KYC / GitHub verification status ── */}
            {user?.githubVerified ? (
                <div className="flex items-center gap-3 px-4 py-3 bg-signal/10 border border-signal/20 rounded-2xl">
                    <div className="w-8 h-8 rounded-full bg-signal/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-signal" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">KYC Verified</p>
                        <p className="text-xs text-muted-foreground">GitHub identity verified — premium extensions (.sryze.cc, .ryzedns.org, .nx.kg, .ryzn.pro) unlocked</p>
                    </div>
                    <span className="shrink-0 text-xs font-semibold px-2.5 py-1 bg-signal text-signal-foreground rounded-full">Verified</span>
                </div>
            ) : (
                <a
                    href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/github/kyc/start`}
                    className="group flex items-center gap-3 px-4 py-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl hover:border-amber-500/40 transition-colors cursor-pointer"
                >
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">KYC Not Verified</p>
                        <p className="text-xs text-muted-foreground">Complete GitHub verification to unlock sryze.cc, ryzedns.org, nx.kg &amp; ryzn.pro domains and extra quota</p>
                    </div>
                    <span className="shrink-0 text-xs font-semibold px-2.5 py-1 border border-amber-500/40 text-amber-500 rounded-full group-hover:bg-amber-500 group-hover:text-background transition-colors">
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
                    iconBg="bg-signal/10"
                    iconColor="text-signal"
                    title="Manage Domains"
                    desc="View, renew, or configure your registered domains"
                />

                {/* DNS Config */}
                <ActionCard
                    to="/dns"
                    icon={Settings}
                    iconBg="bg-secondary"
                    iconColor="text-foreground"
                    title="DNS Configuration"
                    desc="Set up NS delegation and manage DNS records"
                />

                {/* WHOIS Lookup */}
                <ActionCard
                    to="/whois"
                    icon={Search}
                    iconBg="bg-secondary"
                    iconColor="text-foreground"
                    title="WHOIS Lookup"
                    desc="Look up registration info for any domain"
                    external={false}
                />

                {/* History */}
                <ActionCard
                    to="/history"
                    icon={History}
                    iconBg="bg-secondary"
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
                                className="flex items-center justify-between px-4 py-3 bg-card/70 backdrop-blur-md border border-border rounded-xl hover:border-foreground/20 transition-all group shadow-sm"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center flex-shrink-0">
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
                <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border p-8 md:p-10 text-center shadow-sm">
                    <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border">
                        <Globe className="w-6 h-6 text-foreground" />
                    </div>
                    <h3 className="text-2xl font-display font-medium text-foreground mb-2">Register your first domain</h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                        Free, instant, and takes under a minute. Claim your personal <strong>.indevs.in</strong>, <strong>.sryze.cc</strong>, <strong>.ryzedns.org</strong>, <strong>.nx.kg</strong>, or <strong>.ryzn.pro</strong> subdomain.
                    </p>
                    <Link
                        to="/register"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-semibold text-sm rounded-xl hover:bg-signal hover:text-signal-foreground transition-all duration-200 shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Register Now — It's Free
                    </Link>
                </div>
            )}
        </div>
    );
}

function StatCard({ value, label, sub, accentClass, dot, to, warn }) {
    return (
        <Link
            to={to}
            className={`bg-card/70 backdrop-blur-xl border border-border rounded-2xl p-4 md:p-5 hover:border-foreground/25 transition-all duration-200 group shadow-sm ${warn ? "border-amber-500/30" : ""}`}
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: dot }} />
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
            <p className={`text-3xl md:text-4xl font-display font-medium leading-none mt-3 ${accentClass}`}>{value}</p>
            <p className="text-xs text-muted-foreground mt-1.5">{sub}</p>
        </Link>
    );
}

function ActionCard({ to, icon: Icon, iconBg, iconColor, title, desc }) {
    return (
        <Link
            to={to}
            className="bg-card/70 backdrop-blur-xl border border-border rounded-2xl p-5 flex items-center gap-4 hover:border-foreground/25 transition-all duration-200 group shadow-sm"
        >
            <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0 border border-border`}>
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
        Active:          { bg: "bg-signal/10",  text: "text-signal",  dot: "bg-signal" },
        Expired:         { bg: "bg-destructive/10",    text: "text-destructive",    dot: "bg-destructive" },
        Suspended:       { bg: "bg-destructive/10",    text: "text-destructive",    dot: "bg-destructive" },
        "Pending Deletion": { bg: "bg-amber-500/10", text: "text-amber-500", dot: "bg-amber-500" },
        "Pending DNS":   { bg: "bg-sky-500/10",   text: "text-sky-500",   dot: "bg-sky-500" },
    };
    const s = map[status] || { bg: "bg-muted", text: "text-muted-foreground", dot: "bg-muted-foreground" };
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {status}
        </span>
    );
}
