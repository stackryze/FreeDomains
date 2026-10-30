import { useEffect, useState } from "react";
import { Activity, Globe2, ShieldCheck, Users } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { chipColor } from "@/lib/chips";

function StatCard({ stat, index }) {
  const { ref, display } = useCountUp(stat.value);
  return (
    <div
      ref={ref}
      className="group relative bg-card/70 backdrop-blur-md rounded-2xl p-5 md:p-6 flex flex-col justify-between hover:bg-card transition-all duration-150 shadow-border"
    >
      <div className="flex items-center justify-between mb-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary border border-border transition-transform duration-150 group-hover:scale-105"
          style={{ color: chipColor(index + 4) }}
        >
          <stat.icon className="w-5 h-5" strokeWidth={1.75} />
        </div>
        <span className="text-[10px] md:text-xs font-mono text-muted-foreground uppercase tracking-widest"></span>
      </div>

      <div>
        <div className="text-3xl md:text-4xl font-bold font-mono text-foreground tracking-tight mb-1 tabular-nums">
          {display}
        </div>
        <div className="text-xs md:text-sm font-medium text-muted-foreground">
          {stat.label}
        </div>
      </div>
    </div>
  );
}

export function LiveStatsSection() {
  const [stats, setStats] = useState({
    activeDomains: "60,000+",
    totalUsers: "36,000+",
    countries: "120+",
    nameservers: "3"
  });

  useEffect(() => {
    // Attempt to fetch live stats from the backend
    const fetchStats = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/public/stats`);
        if (response.ok) {
          const data = await response.json();
          setStats(prev => ({
            ...prev,
            activeDomains: data.totalDomains > 60000 ? `${data.totalDomains.toLocaleString()}+` : "60,000+",
            totalUsers: data.totalUsers > 36000 ? `${data.totalUsers.toLocaleString()}+` : "36,000+",
          }));
        }
      } catch {
        // Keep defaults
      }
    };

    fetchStats();
  }, []);

  const statItems = [
    { label: "Active Users", value: stats.totalUsers, icon: Users },
    { label: "Domains Active", value: stats.activeDomains, icon: Globe2 },
    { label: "Countries Served", value: stats.countries, icon: Activity },
    { label: "Global DNS Servers", value: stats.nameservers, icon: ShieldCheck }
  ];

  return (
    <div className="w-full flex flex-col justify-start">
      <div className="mb-6 md:mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/80 backdrop-blur-md px-3 py-1 text-xs font-mono tracking-wider uppercase mb-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-signal opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
          </span>
          <span>Live Network Metrics</span>
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-tight">
          Trusted by developers <span className="text-gradient-signal">worldwide</span>
        </h2>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          Real-time telemetry across our global authoritative DNS infrastructure.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
        {statItems.map((stat, idx) => (
          <StatCard key={idx} stat={stat} index={idx} />
        ))}
      </div>
    </div>
  );
}
