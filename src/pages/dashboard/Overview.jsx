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
            <div className="max-w-5xl animate-pulse space-y-6">
                <div className="h-8 bg-[#E5E3DF] rounded-lg w-48" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-[#E5E3DF] rounded-2xl" />)}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-[#E5E3DF] rounded-2xl" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl space-y-6">

            {/* ── Greeting header ── */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#FF6B35] mb-1">Dashboard</p>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] leading-tight">
                        {greeting()}, {user?.name?.split(" ")[0] || "there"} 👋
                    </h1>
                    <p className="text-sm text-[#888] mt-1">
                        {totalCount === 0 ? "Register your first free domain to get started." : `You have ${totalCount} domain${totalCount > 1 ? "s" : ""} on Stackryze.`}
                    </p>
                </div>
                <Link
                    to="/register"
                    className="inline-flex items-center gap-2 self-start sm:self-auto px-4 py-2.5 bg-[#1A1A1A] text-white text-sm font-bold rounded-xl hover:bg-[#FF6B35] transition-colors shadow-[3px_3px_0px_0px_#FFD23F]"
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
                    accent="#1A1A1A"
                    dot="#FFD23F"
                    to="/my-domains"
                />
                <StatCard
                    value={activeCount}
                    label="Active"
                    sub="running"
                    accent="#1e8e3e"
                    dot="#4ade80"
                    to="/my-domains"
                />
                <StatCard
                    value={expiringCount}
                    label="Expiring"
                    sub="within 30 days"
                    accent={expiringCount > 0 ? "#b45309" : "#888"}
                    dot={expiringCount > 0 ? "#fbbf24" : "#D1D5DB"}
                    to="/my-domains"
                    warn={expiringCount > 0}
                />
                <StatCard
                    value={expiredCount}
                    label="Expired"
                    sub="domains"
                    accent={expiredCount > 0 ? "#c5221f" : "#888"}
                    dot={expiredCount > 0 ? "#f87171" : "#D1D5DB"}
                    to="/my-domains"
                />
            </div>

            {/* ── KYC / GitHub verification status ── */}
            {user?.githubVerified ? (
                <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border-2 border-green-200 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-green-800">KYC Verified</p>
                        <p className="text-xs text-green-600">GitHub identity verified — you have access to sryze.cc domains &amp; higher limits</p>
                    </div>
                    <span className="shrink-0 text-xs font-bold px-2.5 py-1 bg-green-600 text-white rounded-full">Verified</span>
                </div>
            ) : (
                <Link
                    to="/github-kyc"
                    className="group flex items-center gap-3 px-4 py-3 bg-amber-50 border-2 border-amber-200 rounded-xl hover:border-amber-400 transition-colors"
                >
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-amber-900">KYC Not Verified</p>
                        <p className="text-xs text-amber-700">Complete GitHub verification to unlock sryze.cc domains and extra limits</p>
                    </div>
                    <span className="shrink-0 text-xs font-bold px-2.5 py-1 border-2 border-amber-400 text-amber-700 rounded-full group-hover:bg-amber-400 group-hover:text-white transition-colors">
                        Verify →
                    </span>
                </Link>
            )}

            {/* ── Main grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Manage Domains */}
                <ActionCard
                    to="/my-domains"
                    icon={Globe}
                    iconBg="bg-[#e6f4ea]"
                    iconColor="text-[#1e8e3e]"
                    title="Manage Domains"
                    desc="View, renew, or delete your existing domains"
                />

                {/* DNS Config */}
                <ActionCard
                    to="/dns"
                    icon={Settings}
                    iconBg="bg-[#FFF0E6]"
                    iconColor="text-[#FF6B35]"
                    title="DNS Configuration"
                    desc="Set up NS delegation and manage DNS records"
                />

                {/* WHOIS Lookup */}
                <ActionCard
                    to="/whois"
                    icon={Search}
                    iconBg="bg-[#F0F4FF]"
                    iconColor="text-[#4F6EF7]"
                    title="WHOIS Lookup"
                    desc="Look up registration info for any domain"
                    external={false}
                />

                {/* History */}
                <ActionCard
                    to="/history"
                    icon={History}
                    iconBg="bg-[#FFF8E6]"
                    iconColor="text-[#b45309]"
                    title="Activity History"
                    desc="Track changes, renewals, and domain events"
                />
            </div>

            {/* ── Recent domains ── */}
            {recentDomains.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-[#4A4A4A]">Recent Domains</h2>
                        <Link to="/my-domains" className="text-xs font-bold text-[#888] hover:text-[#FF6B35] flex items-center gap-1 transition-colors">
                            View all <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="space-y-2">
                        {recentDomains.map(d => (
                            <Link
                                key={d._id}
                                to={`/domains/${d._id}`}
                                className="flex items-center justify-between px-4 py-3 bg-white border-[1px] border-[#D1D5DB] rounded-xl hover:border-[#9CA3AF] transition-colors group"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-8 h-8 rounded-lg bg-[#F9FAFB] border-[1px] border-[#E5E7EB] flex items-center justify-center flex-shrink-0">
                                        <Globe className="w-4 h-4 text-[#4B5563]" />
                                    </div>
                                    <span className="font-mono font-bold text-sm text-[#111827] truncate">
                                        {d.name}.{d.domain}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <StatusPill status={d.status} />
                                    <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#4B5563] group-hover:translate-x-1 transition-all" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Empty state ── */}
            {totalCount === 0 && !loading && (
                <div className="bg-gradient-to-br from-[#FFF8F0] to-[#FFE8D6] rounded-2xl border-2 border-[#FFD23F] p-8 text-center">
                    <div className="w-14 h-14 bg-[#FF6B35] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0px_0px_#1A1A1A]">
                        <Globe className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-extrabold text-[#1A1A1A] mb-2">Register your first domain 🎉</h3>
                    <p className="text-sm text-[#4A4A4A] mb-5 max-w-sm mx-auto">
                        It's free, instant, and takes under a minute. Get a personal <strong>.indevs.in</strong> or <strong>.sryze.cc</strong> subdomain.
                    </p>
                    <Link
                        to="/register"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1A1A1A] text-white font-bold text-sm rounded-xl hover:bg-[#FF6B35] transition-colors shadow-[3px_3px_0px_0px_#FFD23F]"
                    >
                        <Plus className="w-4 h-4" />
                        Register Now — It's Free
                    </Link>
                </div>
            )}
        </div>
    );
}

function StatCard({ value, label, sub, accent, dot, to, warn }) {
    return (
        <Link
            to={to}
            className={`bg-white border-[1px] border-[#D1D5DB] rounded-2xl p-4 md:p-5 hover:border-[#9CA3AF] transition-colors group ${warn ? "border-amber-300" : ""}`}
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: dot }} />
                    <span className="text-sm font-semibold uppercase tracking-wider text-[#4B5563]">{label}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#4B5563] transition-colors" />
            </div>
            <p className="text-3xl md:text-4xl font-bold leading-none mt-3" style={{ color: accent }}>{value}</p>
            <p className="text-sm text-[#6B7280] mt-1">{sub}</p>
        </Link>
    );
}

function ActionCard({ to, icon: Icon, iconBg, iconColor, title, desc }) {
    return (
        <Link
            to={to}
            className="bg-white border-[1px] border-[#D1D5DB] rounded-2xl p-5 flex items-center gap-4 hover:border-[#9CA3AF] transition-colors group"
        >
            <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-bold text-base text-[#111827]">{title}</p>
                <p className="text-sm text-[#4B5563] mt-0.5 truncate">{desc}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-[#9CA3AF] group-hover:text-[#4B5563] group-hover:translate-x-1 transition-all flex-shrink-0" />
        </Link>
    );
}

function StatusPill({ status }) {
    const map = {
        Active:          { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500" },
        Expired:         { bg: "bg-red-50",    text: "text-red-600",    dot: "bg-red-400" },
        Suspended:       { bg: "bg-red-50",    text: "text-red-600",    dot: "bg-red-400" },
        "Pending Deletion": { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
        "Pending DNS":   { bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-400" },
    };
    const s = map[status] || { bg: "bg-gray-100", text: "text-gray-500", dot: "bg-gray-400" };
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {status}
        </span>
    );
}
