import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { SponsorsSection } from "@/components/sponsors-section";
import { MissionSection } from "@/components/mission-section";
import { FeatureCards } from "@/components/feature-cards";
import { Footer } from "@/components/footer-section";
import { DomainExtensionsSection } from "@/components/domain-extensions";
import { LiveStatsSection } from "@/components/live-stats";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { NetworkMapSection } from "@/components/network-map-section";
import { Reveal } from "@/components/reveal";
import { Magnetic } from "@/components/magnetic";
import { ArrowRight } from "lucide-react";

export function Landing() {
    return (
        <div className="relative min-h-screen flex flex-col bg-background text-foreground selection:bg-foreground selection:text-background">
            {/* Stackryze Continuous Atmospheric Background */}
            <div aria-hidden className="bg-aurora pointer-events-none fixed inset-x-0 top-0 z-0 min-h-full h-full" />
            <div aria-hidden className="page-tint pointer-events-none fixed inset-x-0 top-0 z-0 min-h-full h-full" />

            <Header />
            <div style={{ height: 'calc(4rem + var(--incident-height, 0px))' }}></div>

            <main className="relative z-10 flex-1 w-full flex flex-col bg-transparent">
                <HeroSection />

                <Reveal><SponsorsSection /></Reveal>

                {/* The one deliberately bold motion moment on the page —
                    explain the product early, before asking for trust */}
                <HowItWorksSection />

                <Reveal><FeatureCards /></Reveal>

                <NetworkMapSection />

                <Reveal><MissionSection /></Reveal>

                {/* Namespaces & Telemetry Section */}
                <Reveal as="section" className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 py-16 sm:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-14 items-start">
                        <DomainExtensionsSection />
                        <LiveStatsSection />
                    </div>
                </Reveal>

                {/* Final CTA Section */}
                <Reveal as="section" className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 py-16 sm:py-24">
                    <div className="relative rounded-3xl bg-card p-10 md:p-16 flex flex-col items-center justify-center text-center overflow-hidden shadow-border">
                        <div className="bg-glow-signal pointer-events-none absolute inset-0 z-0" />

                        <h2 className="relative z-10 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 max-w-3xl text-balance">
                            Launch your next project today.
                        </h2>
                        <p className="relative z-10 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
                            Claim a free subdomain, configure your DNS, and deploy anywhere. Trusted by developers worldwide for fast, flexible, and reliable domain management.
                        </p>
                        <Magnetic className="relative z-10" strength={14}>
                            <a
                                href="/login"
                                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-signal text-signal-foreground font-medium text-base hover:bg-signal/90 shadow-signal transition-all duration-150 active:scale-[0.97]"
                            >
                                Get Started Free
                                <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1" />
                            </a>
                        </Magnetic>
                    </div>
                </Reveal>

            </main>
            <Footer />
        </div>
    );
}

