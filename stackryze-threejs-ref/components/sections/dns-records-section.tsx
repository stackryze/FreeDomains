"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const records = [
  {
    type: "A / AAAA",
    title: "Standard records",
    description: "Map your domain to an IPv4 or IPv6 address.",
    examples: ["192.0.2.1", "2001:db8::1"],
  },
  {
    type: "MX / SRV / CAA",
    title: "Mail & services",
    description: "Route email and define which services may issue certificates.",
    examples: ["10 mail", "_sip._tcp", "0 issue letsencrypt.org"],
  },
  {
    type: "SVCB / HTTPS / TLSA",
    title: "Modern standards",
    description: "Service binding, HTTPS records, and DANE for the long tail of needs.",
    examples: ["1 . alpn=h2", "https://h2", "port 443 …"],
  },
];

export function DNSRecordsSection() {
  return (
    <section className="relative py-24 sm:py-32">
      {/* Subtle grid backdrop for the DNS records section */}
      <div
        aria-hidden
        className="section-bg-dots-32 pointer-events-none absolute inset-0 -z-10 opacity-40 fade-edges"
      />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            DNS record support
          </p>
          <h2 className="font-display mt-3 text-4xl tracking-tight text-balance sm:text-5xl">
            Every record type.
            <br />
            <span className="text-muted-foreground">Full control.</span>
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {records.map((r, i) => (
            <motion.div
              key={r.type}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-colors hover:bg-accent/40"
            >
              <div className="font-mono text-sm font-medium text-foreground">
                {r.type}
              </div>
              <h3 className="font-display mt-4 text-2xl tracking-tight">
                {r.title}
              </h3>
              <p className="mt-3 text-sm text-muted-foreground text-pretty">
                {r.description}
              </p>

              <div className="mt-8 space-y-2">
                {r.examples.map((ex) => (
                  <div
                    key={ex}
                    className={cn(
                      "flex items-center gap-3 rounded-md border border-border bg-background px-3 py-2",
                      "font-mono text-xs text-muted-foreground",
                    )}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                    {ex}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
