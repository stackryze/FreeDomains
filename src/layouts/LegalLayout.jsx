import { Header } from "@/components/header";
import { Footer } from "@/components/footer-section";

export function LegalLayout({ children, title, date }) {
    return (
        <div className="flex flex-col min-h-screen w-full bg-[#FFF8F0]">
            <Header />
            <main className="flex-1 w-full pt-[calc(8rem+var(--incident-height,0px))] pb-20 px-6">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-[#1A1A1A] mb-6 tracking-tight">
                        {title}
                    </h1>
                    {date && (
                        <p className="text-[#6B6B6B] mb-12 font-mono text-base md:text-lg border-b border-[#E5E3DF] pb-8">
                            Last Updated: {date}
                        </p>
                    )}
                    <div className="
                        [&_h3]:text-2xl [&_h3]:md:text-3xl [&_h3]:font-bold [&_h3]:text-[#1A1A1A] [&_h3]:mt-12 [&_h3]:mb-6
                        [&_p]:text-lg [&_p]:md:text-xl [&_p]:text-[#4A4A4A] [&_p]:leading-relaxed [&_p]:mb-6
                        [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-8 [&_ul]:space-y-3 [&_ul]:text-lg [&_ul]:md:text-xl [&_ul]:text-[#4A4A4A]
                        [&_li]:pl-2
                        [&_.lead]:text-xl [&_.lead]:md:text-2xl [&_.lead]:font-medium [&_.lead]:text-[#1A1A1A] [&_.lead]:mb-10
                        [&_a]:text-[#FF6B35] [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-2
                        [&_strong]:font-bold [&_strong]:text-[#1A1A1A]
                    ">
                        {children}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
