import { Terminal, ShieldCheck, Eye, Users, Key, Server, Database, Globe2 } from "lucide-react";

const features = [
  {
    icon: Terminal,
    title: "Developer Friendly",
    subtitle: "Built for builders",
    description: "Manage records through our intuitive dashboard or automate workflows via API. Bring your own nameservers, integrate with your preferred hosting providers, and stay in complete control.",
    accent: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    icon: ShieldCheck,
    title: "Abuse & Safety",
    subtitle: "Protecting the namespace",
    description: "Automated detection systems and a dedicated Abuse & Safety team actively investigate and remove phishing, malware, spam, and other malicious activity. Repeat offenders are permanently removed.",
    accent: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
  {
    icon: Eye,
    title: "Transparency",
    subtitle: "Clear policies, fair decisions",
    description: "Abuse reports are handled through a transparent, documented process. Enforcement actions are guided by published policies, with fair appeal options available to legitimate users.",
    accent: "text-signal",
    bg: "bg-signal/10",
    border: "border-signal/20",
  },
  {
    icon: Users,
    title: "For Communities",
    subtitle: "Perfect for growing ideas",
    description: "Whether you're building an open-source project, student club, non-profit initiative, or personal portfolio, Stackryze Domains provides a trusted foundation to get started.",
    accent: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    icon: Key,
    title: "Ownership & Control",
    subtitle: "Your domain, your choice",
    description: "Use our native DNS platform or connect to external providers such as Cloudflare. No vendor lock-in, no forced upsells—just complete control over your domain and records.",
    accent: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    icon: Server,
    title: "Infrastructure",
    subtitle: "Reliable by design",
    description: "Powered by globally distributed DNS infrastructure with continuous monitoring, redundancy, and high availability to ensure dependable DNS performance and rapid resolution worldwide.",
    accent: "text-sky-500",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
  },
  {
    icon: Database,
    title: "Data Protection",
    subtitle: "Privacy through resilience",
    description: "Your data is protected across self-hosted, geographically distributed systems designed for security, reliability, and long-term resilience. We minimize dependencies and prioritize user trust.",
    accent: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    icon: Globe2,
    title: "Open Internet",
    subtitle: "Access without gatekeepers",
    description: "We believe everyone deserves access to a trustworthy online identity. By lowering barriers to entry while maintaining strong security standards, we help make the internet open for all.",
    accent: "text-fuchsia-500",
    bg: "bg-fuchsia-500/10",
    border: "border-fuchsia-500/20",
  }
];

export function MissionSection() {
  return (
    <section className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 py-16 sm:py-24">
      {/* Section Header */}
      <div className="max-w-3xl mb-12 sm:mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/80 backdrop-blur-md px-3.5 py-1 text-xs font-mono tracking-wider uppercase">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-signal opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
          </span>
          <span>Our Mission</span>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight font-display">
          Who are we?
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          We are a team of passionate systems developers building an open, accessible, and community-driven namespace for the modern web. We provide completely free domain names for open-source projects, creators, and individuals to launch ideas without financial gatekeeping.
        </p>
      </div>

      {/* 8-Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {features.map((f, i) => (
          <div
            key={i}
            className="group relative bg-card/70 backdrop-blur-md border border-border rounded-2xl p-6 flex flex-col justify-between hover:border-foreground/25 hover:bg-card transition-all duration-300 shadow-sm"
          >
            <div>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${f.bg} ${f.border} border mb-5 transition-transform duration-300 group-hover:scale-105`}>
                <f.icon className={`w-5 h-5 ${f.accent}`} strokeWidth={2.2} />
              </div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground mb-1">
                {f.subtitle}
              </p>
              <h3 className="text-foreground font-bold text-xl tracking-tight font-display mb-2.5">
                {f.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {f.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
