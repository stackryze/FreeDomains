import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { StatsSection } from "@/components/sections/stats-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { ExtensionsSection } from "@/components/sections/extensions-section";
import { DNSRecordsSection } from "@/components/sections/dns-records-section";
import { HowItWorksSection } from "@/components/sections/how-it-works-section";
import { UsecasesSection } from "@/components/sections/usecases-section";
import { CTASection } from "@/components/sections/cta-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 cv-auto">
        <Hero />
        <StatsSection />
        <FeaturesSection />
        <ExtensionsSection />
        <DNSRecordsSection />
        <HowItWorksSection />
        <UsecasesSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
