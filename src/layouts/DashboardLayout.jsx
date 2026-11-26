import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer-section";
import { DashboardProvider } from "@/context/dashboard-context";
import {
  LayoutDashboard,
  Globe,
  User2,
  HelpCircle,
  LogOut,
  Plus,
  Server,
  Clock,
  Search,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { IS_LOCAL_DEMO } from "@/lib/demo-data";

const NAV_GROUPS = [
  {
    title: "Registry",
    items: [
      { to: "/dashboard", icon: LayoutDashboard, label: "Overview" },
      { to: "/my-domains", icon: Globe, label: "Domains" },
      { to: "/register", icon: Plus, label: "Register Domain" },
      { to: "/dns", icon: Server, label: "DNS Management" },
    ],
  },
  {
    title: "Tools",
    items: [
      { to: "/history", icon: Clock, label: "Activity History" },
      { to: "/whois", icon: Search, label: "WHOIS Lookup" },
    ],
  },
  {
    title: "Account",
    items: [
      { to: "/profile", icon: User2, label: "Profile" },
      { to: "/help", icon: HelpCircle, label: "Help & Support" },
    ],
  },
];

function LeftRailNav({ isActive, user, logout, onNavigate }) {
  return (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="space-y-0.5">
            <p className="px-2.5 pb-1 text-[11px] font-medium text-muted-foreground">
              {group.title}
            </p>
            {group.items.map((item) => {
              const IconComp = item.icon;
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onNavigate}
                  className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] ${
                    active
                      ? "bg-secondary text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  <IconComp
                    className={`w-4 h-4 shrink-0 ${
                      active ? "text-foreground" : "text-muted-foreground"
                    }`}
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      <div className="pt-4 mt-6 border-t border-border space-y-3">
        {IS_LOCAL_DEMO && (
          <div className="px-2.5 py-1.5 rounded-md border border-border bg-card flex items-center justify-between gap-2 text-[11px] font-mono text-muted-foreground">
            <span className="flex items-center gap-1.5 text-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              Demo Mode
            </span>
            <span>Dev</span>
          </div>
        )}

        {user && (
          <div className="flex items-center gap-2.5 px-1.5">
            <img
              src={user.avatarUrl || "/stackryze_logo_white.png"}
              alt={user.name || "Account avatar"}
              className="w-7 h-7 rounded-full border border-border object-cover bg-secondary shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-foreground truncate">
                {user.name || user.username || "Account"}
              </p>
              <p className="text-[11px] font-mono text-muted-foreground truncate">
                @{user.username || "user"}
              </p>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            logout();
          }}
          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === "/dashboard") {
      return (
        location.pathname === "/dashboard" || location.pathname === "/overview"
      );
    }
    if (path === "/my-domains") {
      return (
        location.pathname === "/my-domains" ||
        location.pathname.startsWith("/domains/")
      );
    }
    if (path === "/profile") {
      return (
        location.pathname === "/profile" || location.pathname === "/settings"
      );
    }
    return location.pathname === path;
  };

  return (
    <DashboardProvider>
      <div className="min-h-screen bg-background font-sans flex flex-col">
        <Header />

        {/* Full edge-to-edge Vercel Dashboard Shell */}
        <div className="flex-1 w-full flex flex-col lg:flex-row pt-[calc(4rem+var(--incident-height,0px))]">
          {/* Mobile Top Bar */}
          <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-background">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-expanded={mobileMenuOpen}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-card text-xs font-medium text-foreground"
            >
              {mobileMenuOpen ? (
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <Menu className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              <span>Menu</span>
            </button>

            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-foreground text-background text-xs font-medium hover:bg-foreground/90"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Register Domain</span>
            </Link>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden p-4 border-b border-border bg-card">
              <LeftRailNav
                isActive={isActive}
                user={user}
                logout={logout}
                onNavigate={() => setMobileMenuOpen(false)}
              />
            </div>
          )}

          {/* Left Sidebar Docked Flush to Left Edge */}
          <aside className="hidden lg:block w-60 shrink-0 border-r border-border bg-background">
            <div className="sticky top-[calc(4rem+var(--incident-height,0px))] h-[calc(100vh-4rem-var(--incident-height,0px))] overflow-y-auto px-3 py-5">
              <LeftRailNav isActive={isActive} user={user} logout={logout} />
            </div>
          </aside>

          {/* Centered Container Inside Right Workspace (matches Vercel Console) */}
          <main className="flex-1 min-w-0 px-6 sm:px-8 lg:px-10 py-8">
            <div className="max-w-7xl mx-auto w-full">
              <Outlet />
            </div>
          </main>
        </div>

        <Footer />
      </div>
    </DashboardProvider>
  );
}
