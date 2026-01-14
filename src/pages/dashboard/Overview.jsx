import { Globe, Plus, Settings, Clock, AlertCircle, CheckCircle, TrendingUp } from "lucide-react";
import { useDashboard } from "@/context/dashboard-context";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const StatCard = ({ icon: Icon, label, value, color, bgColor, to }) => (
    <Link
        to={to || "/my-domains"}
        className="bg-white p-5 sm:p-6 rounded-xl border-2 border-[#E5E3DF] hover:border-[#1A1A1A] transition-all hover:shadow-md group active:scale-[0.98]"
    >
        <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className={`p-2.5 sm:p-3 ${bgColor} rounded-lg`}>
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${color}`} />
            </div>
        </div>
        <h3 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] mb-1">{value}</h3>
        <p className="text-xs sm:text-sm font-bold text-[#4A4A4A] uppercase tracking-wide">{label}</p>
    </Link>
);

const QuickAction = ({ icon: Icon, label, description, to, variant = "default" }) => (
    <Link
        to={to}
        className={`p-5 sm:p-6 rounded-xl border-2 transition-all hover:shadow-md active:scale-[0.98] ${variant === "primary"
            ? "bg-[#1A1A1A] text-white border-[#1A1A1A] hover:bg-[#333]"
            : "bg-white border-[#E5E3DF] hover:border-[#1A1A1A]"
            }`}
    >
        <div className="flex items-start gap-3 sm:gap-4">
            <div className={`p-2.5 sm:p-3 rounded-lg flex-shrink-0 ${variant === "primary" ? "bg-white/20" : "bg-[#FFF8F0]"
                }`}>
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${variant === "primary" ? "text-white" : "text-[#1A1A1A]"}`} />
            </div>
            <div className="flex-1">
                <h4 className={`text-base sm:text-lg font-bold mb-1 ${variant === "primary" ? "text-white" : "text-[#1A1A1A]"}`}>
                    {label}
                </h4>
                <p className={`text-xs sm:text-sm ${variant === "primary" ? "text-white/80" : "text-[#4A4A4A]"}`}>
                    {description}
                </p>
            </div>
        </div>
    </Link>
);

export default function Overview() {
    const { subdomains, loading } = useDashboard();

    // Calculate stats
    const activeCount = subdomains.filter(d => d.status === "Active").length;
    // const pendingCount = subdomains.filter(d => d.status === "Pending").length;

    // Domains expiring within 30 days
    const expiringCount = subdomains.filter(d => {
        if (!d.expiresAt) return false;
        const daysUntilExpiry = Math.ceil((new Date(d.expiresAt) - new Date()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
    }).length;

    if (loading && subdomains.length === 0) {
        return (
            <div className="max-w-5xl mx-auto">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-32"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
            {/* Header */}
            <div className="pr-2">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-1 sm:mb-2">Dashboard Overview</h1>
                <p className="text-xs sm:text-sm md:text-base text-[#4A4A4A]">Manage your subdomains and monitor activity</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                <StatCard
                    icon={Globe}
                    label="Total Domains"
                    value={subdomains.length}
                    color="text-[#1e8e3e]"
                    bgColor="bg-[#e6f4ea]"
                />
                <StatCard
                    icon={CheckCircle}
                    label="Active"
                    value={activeCount}
                    color="text-[#1e8e3e]"
                    bgColor="bg-[#e6f4ea]"
                />
                <StatCard
                    icon={Clock}
                    label="Expiring Soon"
                    value={expiringCount}
                    color="text-[#b06000]"
                    bgColor="bg-[#fff4e6]"
                />
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#1A1A1A] mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <QuickAction
                        icon={Plus}
                        label="Register New Domain"
                        description="Claim a new domain under indevs.in"
                        to="/register"
                        variant="primary"
                    />
                    <QuickAction
                        icon={Globe}
                        label="Manage Domains"
                        description="View and manage your existing domains"
                        to="/my-domains"
                    />
                    <QuickAction
                        icon={Settings}
                        label="DNS Configuration"
                        description="Learn about NS delegation and DNS setup"
                        to="/dns"
                    />
                    <QuickAction
                        icon={TrendingUp}
                        label="Account Settings"
                        description="Update your profile and preferences"
                        to="/settings"
                    />
                </div>
            </div>

            {/* Welcome message for new users */}
            {subdomains.length === 0 && !loading && (
                <div className="bg-gradient-to-br from-[#FFF8F0] to-[#FFE8D6] rounded-xl border-2 border-[#E5E3DF] p-6 sm:p-8 text-center">
                    <Globe className="w-12 h-12 sm:w-16 sm:h-16 text-[#FF6B35] mx-auto mb-4" />
                    <h3 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-3">Welcome to Indevs! 🎉</h3>
                    <p className="text-sm sm:text-base text-[#4A4A4A] mb-6 max-w-md mx-auto">
                        Get started by registering your first domain. It's free and takes less than a minute!
                    </p>
                    <Button asChild className="bg-[#1A1A1A] text-white hover:bg-[#333] font-bold w-full sm:w-auto">
                        <Link to="/register">
                            <Plus className="w-4 h-4 mr-2" />
                            Register Your First Domain
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
