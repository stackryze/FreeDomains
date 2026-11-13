import { DottedMap } from "./ui/dotted-map";

const mapMarkers = [
  // Primary Nameservers
  { lat: 40.7128, lng: -74.006, size: 1.5, pulse: true, label: "ns1.stackryze.com • New York" },
  { lat: 50.1109, lng: 8.6821, size: 1.5, pulse: true, label: "ns2.stackryze.com • Germany" },
  { lat: 17.3850, lng: 78.4867, size: 1.5, pulse: true, label: "ns3.stackryze.com • Hyderabad" }
];

export function NetworkMapSection() {
  return (
    <section className="w-full py-10 md:py-16 bg-white relative border-b border-slate-100 dark:border-[#27272a] overflow-hidden">
      <div className="w-full px-4 sm:px-6 md:px-12 lg:px-16 mb-12 max-w-[1600px] mx-auto relative z-10">
        
        <div className="mb-12 space-y-4 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Globally Distributed Name Servers
          </h2>
          <p className="max-w-2xl mx-auto text-base md:text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            Lightning-fast resolution from our authoritative name servers worldwide, ensuring your domain resolves instantly anywhere on the planet.
          </p>
        </div>

        <div className="w-full max-w-5xl mx-auto">
          <div className="w-full relative rounded-2xl border border-slate-200 dark:border-[#27272a]/60 bg-slate-50/50 p-6 sm:p-12 shadow-xl ring-1 ring-black/[0.02]">
            <DottedMap
              markers={mapMarkers}
              markerColor="#10B981"
              pulse={true}
              height={50}
              renderMarkerOverlay={({ marker, x, y }) => {
                if (!marker.label) return null;
                return (
                  <g>
                    {/* Pill Background */}
                    <rect
                      x={x - 17}
                      y={y - 5.5}
                      width={34}
                      height={4}
                      rx={2}
                      fill="#ffffff"
                      stroke="#e2e8f0"
                      strokeWidth="0.3"
                      className="drop-shadow-sm"
                    />
                    {/* Label Text */}
                    <text
                      x={x}
                      y={y - 2.8}
                      textAnchor="middle"
                      fill="#0f172a"
                      style={{ 
                        fontSize: "1.8px", 
                        fontWeight: "700", 
                        fontFamily: "Inter, system-ui, sans-serif",
                        letterSpacing: "-0.02em"
                      }}
                    >
                      {marker.label}
                    </text>
                  </g>
                );
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
