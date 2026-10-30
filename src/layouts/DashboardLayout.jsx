import { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer-section";
import { DashboardProvider } from "@/context/dashboard-context";
import {
    LayoutDashboard,
    Globe,
    BarChart3,
    Settings,
    HelpCircle,
    LogOut,
    Plus,
    Heart,
    Server,
    Menu,
    X,
    Clock,
    Search
} from "lucide-react";
import { useAuth } from "@/context/auth-context";

const SidebarItem = ({ to, icon: Icon, label, active, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className={`group w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all duration-150 text-sm relative ${active
            ? "bg-signal/10 text-signal"
            : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
            }`}
    >
        {active && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-signal" aria-hidden />
        )}
        <Icon className={`w-4 h-4 flex-shrink-0 transition-transform duration-150 group-hover:scale-110 ${active ? "text-signal" : "text-muted-foreground"}`} />
        <span>{label}</span>
    </Link>
);

export default function DashboardLayout() {
    const location = useLocation();
    const { logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    // Close sidebar when route changes (mobile)
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [sidebarOpen]);

    const SidebarContent = () => (
        <>
            <div className="p-4 space-y-1.5 overflow-y-auto flex-1">
                <SidebarItem
                    to="/dashboard"
                    icon={LayoutDashboard}
                    label="Overview"
                    active={isActive("/dashboard")}
                    onClick={() => setSidebarOpen(false)}
                />
                <SidebarItem
                    to="/my-domains"
                    icon={Globe}
                    label="My Domains"
                    active={isActive("/my-domains")}
                    onClick={() => setSidebarOpen(false)}
                />
                <SidebarItem
                    to="/dns"
                    icon={Server}
                    label="DNS Records"
                    active={isActive("/dns")}
                    onClick={() => setSidebarOpen(false)}
                />
                <SidebarItem
                    to="/register"
                    icon={Plus}
                    label="Register Domain"
                    active={isActive("/register")}
                    onClick={() => setSidebarOpen(false)}
                />
                <SidebarItem
                    to="/history"
                    icon={Clock}
                    label="History"
                    active={isActive("/history")}
                    onClick={() => setSidebarOpen(false)}
                />
                <SidebarItem
                    to="/whois"
                    icon={Search}
                    label="WHOIS Lookup"
                    active={isActive("/whois")}
                    onClick={() => setSidebarOpen(false)}
                />
                <div className="pt-3 border-t border-border my-2"></div>
                {/* Analytics placeholder */}
                <div className="opacity-40 pointer-events-none">
                    <SidebarItem to="#" icon={BarChart3} label="Analytics (Soon)" active={false} />
                </div>
                <SidebarItem
                    to="/profile"
                    icon={Settings}
                    label="Settings"
                    active={isActive("/profile")}
                    onClick={() => setSidebarOpen(false)}
                />
                <SidebarItem
                    to="/donate"
                    icon={Heart}
                    label="Donate"
                    active={isActive("/donate")}
                    onClick={() => setSidebarOpen(false)}
                />
                <SidebarItem
                    to="/help"
                    icon={HelpCircle}
                    label="Help & Support"
                    active={isActive("/help")}
                    onClick={() => setSidebarOpen(false)}
                />
            </div>

            <div className="p-4 border-t border-border bg-transparent">
                <button
                    onClick={() => {
                        setSidebarOpen(false);
                        logout();
                    }}
                    className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl font-medium text-destructive hover:bg-destructive/10 transition-colors text-sm"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                </button>
            </div>
        </>
    );

    return (
        <DashboardProvider>
            <div className="min-h-screen bg-transparent font-sans flex flex-col">
                <Header />

                {/* Mobile Hamburger Button */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="md:hidden fixed top-[calc(5rem+var(--incident-height,0px))] left-4 z-50 p-2.5 bg-card/80 backdrop-blur-xl border border-border rounded-xl shadow-sm text-foreground hover:bg-muted transition-all"
                    aria-label="Toggle menu"
                >
                    {sidebarOpen ? (
                        <X className="w-5 h-5 text-foreground" />
                    ) : (
                        <Menu className="w-5 h-5 text-foreground" />
                    )}
                </button>

                {/* Mobile Backdrop */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                <div className="flex flex-1 pt-[calc(4rem+var(--incident-height,0px))]">
                    {/* Desktop Sidebar — its own tonal layer (--sidebar), one
                        notch apart from the page background, so navigation
                        reads as a distinct surface instead of blending in */}
                    <aside className="w-64 bg-sidebar border-r border-border hidden md:flex md:flex-col fixed top-[calc(4rem+var(--incident-height,0px))] h-[calc(100vh-4rem-var(--incident-height,0px))] z-10">
                        <SidebarContent />
                    </aside>

                    {/* Mobile Sidebar */}
                    <aside
                        className={`fixed top-[var(--incident-height,0px)] left-0 h-[calc(100vh-var(--incident-height,0px))] w-64 bg-sidebar border-r border-border z-40 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                            }`}
                    >
                        {/* Mobile sidebar header with close button */}
                        <div className="flex items-center justify-between p-4 border-b border-border mt-16">
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Menu</h2>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <SidebarContent />
                    </aside>

                    {/* Main Content — a barely-visible atmospheric glow, felt
                        rather than noticed, instead of a flat single tone */}
                    <main className="relative flex-1 md:ml-64 p-4 sm:p-6 md:p-10 pt-16 md:pt-6 mb-20 overflow-y-auto min-h-[calc(100vh-64px)]">
                        <div aria-hidden className="bg-atmo pointer-events-none absolute inset-0 -z-10" />
                        <div className="max-w-[1600px] mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-500">
                            <Outlet />
                        </div>
                    </main>
                </div>

                <div className="md:ml-64">
                    <Footer />
                </div>
            </div>
        </DashboardProvider>
    );
}
