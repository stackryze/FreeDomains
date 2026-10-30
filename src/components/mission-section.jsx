import { ShieldCheck, Key, Globe2, Users } from "lucide-react";
import { chipColor } from "@/lib/chips";

// Trimmed to the 4 values that don't already overlap with the feature grid
// below (DNS control, REST API, etc. live there) — this section answers
// "why trust us," not "what can it do."
const values = [
  {
    icon: ShieldCheck,
    title: "Abuse & Safety",
    description: "A dedicated team investigates phishing, malware, and spam. Repeat offenders are permanently removed.",
  },
  {
    icon: Key,
    title: "Ownership & Control",
    description: "Use our native DNS platform or bring your own. No vendor lock-in, no forced upsells.",
  },
  {
    icon: Users,
    title: "For Communities",
    description: "Open-source projects, student clubs, and personal portfolios all get the same trusted foundation.",
  },
  {
    icon: Globe2,
    title: "Open Internet",
    description: "Lowering the barrier to a trustworthy online identity, without compromising on security.",
  },
];

export function MissionSection() {
  return (
    <section className="w-full bg-secondary/30 border-y border-border">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 py-16 sm:py-24">
      {/* Asymmetric two-column editorial layout — deliberately not another
          card grid, so the page has visual rhythm instead of three sections
          that all look like the same component with different copy. */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-20 items-start">
        <div className="space-y-5 lg:sticky lg:top-28">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/80 backdrop-blur-md px-3.5 py-1 text-xs font-mono tracking-wider uppercase">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-signal opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
            </span>
            <span>Our Mission</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight tracking-tight font-display">
            Who are we?
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-md">
            A team of systems developers building an open, community-driven namespace. Free domain names for open-source projects, creators, and individuals — without financial gatekeeping.
          </p>
        </div>

        <div className="divide-y divide-border border-t border-border">
          {values.map((v, i) => (
            <div key={i} className="group flex items-start gap-5 py-6">
              <v.icon className="w-5 h-5 mt-1 shrink-0" style={{ color: chipColor(i + 2) }} strokeWidth={1.75} />
              <div className="min-w-0">
                <h3 className="text-foreground font-semibold text-lg tracking-tight font-display mb-1.5">
                  {v.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {v.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}
