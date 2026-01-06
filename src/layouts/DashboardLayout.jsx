import { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
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
    X
} from "lucide-react";
import { useAuth } from "@/context/auth-context";

const SidebarItem = ({ to, icon: Icon, label, active, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all duration-200 text-sm ${active
            ? "bg-[#1A1A1A] text-white shadow-md"
            : "text-[#4A4A4A] hover:bg-[#FFF8F0] hover:text-[#1A1A1A]"
            }`}
    >
        <Icon className="w-5 h-5 flex-shrink-0" />
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
            <div className="p-6 space-y-2 overflow-y-auto flex-1">
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
                <div className="pt-4 border-t border-[#E5E3DF] my-2"></div>
                {/* Analytics placeholder */}
                <div className="opacity-50 pointer-events-none">
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

            <div className="p-6 border-t border-[#E5E3DF] bg-white">
                <button
                    onClick={() => {
                        setSidebarOpen(false);
                        logout();
                    }}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg font-bold text-white bg-[#E63946] hover:bg-[#d32f2f] transition-colors text-sm"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                </button>
            </div>
        </>
    );

    return (
        <DashboardProvider>
            <div className="min-h-screen bg-[#FFF8F0] font-sans flex flex-col">
                <Header />

                {/* Mobile Hamburger Button */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="md:hidden fixed top-20 left-4 z-50 p-2 bg-white border-2 border-[#E5E3DF] rounded-lg shadow-lg hover:bg-[#FFF8F0] transition-colors"
                    aria-label="Toggle menu"
                >
                    {sidebarOpen ? (
                        <X className="w-6 h-6 text-[#1A1A1A]" />
                    ) : (
                        <Menu className="w-6 h-6 text-[#1A1A1A]" />
                    )}
                </button>

                {/* Mobile Backdrop */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-30 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                <div className="flex flex-1 pt-16">
                    {/* Desktop Sidebar */}
                    <aside className="w-64 bg-white border-r-2 border-[#E5E3DF] hidden md:flex md:flex-col fixed top-16 h-[calc(100vh-4rem)] z-10">
                        <SidebarContent />
                    </aside>

                    {/* Mobile Sidebar */}
                    <aside
                        className={`fixed top-0 left-0 h-full w-64 bg-white border-r-2 border-[#E5E3DF] z-40 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                            }`}
                    >
                        {/* Mobile sidebar header with close button */}
                        <div className="flex items-center justify-between p-4 border-b-2 border-[#E5E3DF] mt-16">
                            <h2 className="text-lg font-bold text-[#1A1A1A]">Menu</h2>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="p-2 hover:bg-[#FFF8F0] rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-[#4A4A4A]" />
                            </button>
                        </div>
                        <SidebarContent />
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 md:ml-64 p-4 sm:p-6 md:p-10 mb-20 overflow-y-auto min-h-[calc(100vh-64px)]">
                        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-500">
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
