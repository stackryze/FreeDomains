import { Link } from "react-router-dom";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { SponsorsSection } from "@/components/sponsors-section";
import { MissionSection } from "@/components/mission-section";
import { FeatureCards } from "@/components/feature-cards";
import { Footer } from "@/components/footer-section";
import { DomainExtensionsSection } from "@/components/domain-extensions";
import { LiveStatsSection } from "@/components/live-stats";
import { ArrowRight } from "lucide-react";

export function Landing() {
  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground">
      <div aria-hidden="true" className="bg-aurora pointer-events-none fixed inset-x-0 top-0 -z-10 min-h-full h-full" />

      <Header />
      <div style={{ height: "calc(4rem + var(--incident-height, 0px))" }} />

      <main className="flex-1 w-full flex flex-col bg-transparent">
        <HeroSection />

        <SponsorsSection />

        <MissionSection />

        <FeatureCards />

        {/* Namespaces & Telemetry Section */}
        <section className="w-full px-6 md:px-12 lg:px-16">
          <div className="max-w-[1600px] mx-auto border-x border-b border-border bg-background grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
            <DomainExtensionsSection />
            <LiveStatsSection />
          </div>
        </section>

        {/* Final CTA Section — Preserved Centered Glow Card */}
        <section className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 py-16 sm:py-24">
          <div className="relative rounded-3xl border border-border bg-card p-10 md:p-16 flex flex-col items-center justify-center text-center overflow-hidden z-10 shadow-sm">
            <div className="bg-glow-signal pointer-events-none absolute inset-0 -z-10" />

            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 max-w-3xl text-balance">
              Launch your next project today.
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
              Claim a free subdomain, configure your DNS, and deploy anywhere. Trusted by developers worldwide for fast, flexible, and reliable domain management.
            </p>
            <Link
              to="/login"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-foreground text-background font-medium text-base hover:bg-signal hover:text-signal-foreground transition-all duration-200 shadow-sm active:scale-[0.98]"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
