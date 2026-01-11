import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { FeatureCards } from "@/components/feature-cards";
import { FAQSection } from "@/components/faq-section";
import { Footer } from "@/components/footer-section";
import { PSLAnnouncement } from "@/components/PSLAnnouncement";

export function Landing() {
    return (
        <div className="flex flex-col min-h-screen w-full">
            <Header />
            <div style={{ height: 'calc(4rem + var(--incident-height, 0px))' }}></div>
            <PSLAnnouncement />
            <main className="flex-1 w-full flex flex-col">
                <HeroSection />
                <FeatureCards />
                <FAQSection />
            </main>
            <Footer />
        </div>
    );
}
