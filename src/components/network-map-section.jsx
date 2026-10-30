import { DottedMap } from "./ui/dotted-map";
import { Reveal } from "./reveal";

const mapMarkers = [
  { lat: 40.7128, lng: -74.006, size: 1.5, pulse: true, label: "ns1 · New York" },
  { lat: 50.1109, lng: 8.6821, size: 1.5, pulse: true, label: "ns2 · Germany" },
  { lat: 17.3850, lng: 78.4867, size: 1.5, pulse: true, label: "ns3 · Hyderabad" },
];

export function NetworkMapSection() {
  return (
    <section className="w-full py-16 sm:py-24 bg-background relative overflow-hidden">
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 z-0 opacity-60" />

      <div className="w-full px-6 md:px-12 lg:px-16 max-w-[1600px] mx-auto relative z-10">
        <Reveal className="mb-12 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/80 backdrop-blur-md px-3.5 py-1 text-xs font-mono tracking-wider uppercase">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-signal opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
            </span>
            <span>Authoritative Nameservers</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground tracking-tight">
            Resolved from three continents.
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Every query answered from the nearest authoritative server — low-latency resolution anywhere a request originates.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="w-full max-w-5xl mx-auto">
          <div className="w-full relative rounded-2xl bg-card p-6 sm:p-12 shadow-border">
            <DottedMap
              markers={mapMarkers}
              markerColor="var(--signal)"
              pulse={true}
              height={50}
              className="text-border"
              renderMarkerOverlay={({ marker, x, y }) => {
                if (!marker.label) return null;
                return (
                  <g>
                    <rect
                      x={x - 17}
                      y={y - 5.5}
                      width={34}
                      height={4}
                      rx={2}
                      fill="var(--popover)"
                      stroke="var(--border)"
                      strokeWidth="0.3"
                    />
                    <text
                      x={x}
                      y={y - 2.8}
                      textAnchor="middle"
                      fill="var(--popover-foreground)"
                      style={{
                        fontSize: "1.8px",
                        fontWeight: "600",
                        fontFamily: "'Geist Mono Variable', ui-monospace, monospace",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {marker.label}
                    </text>
                  </g>
                );
              }}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
