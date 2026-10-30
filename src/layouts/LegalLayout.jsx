import { Header } from "@/components/header";
import { Footer } from "@/components/footer-section";

export function LegalLayout({ children, title, date }) {
    return (
        <div className="flex flex-col min-h-screen w-full bg-transparent">
            <Header />
            <main className="flex-1 w-full pt-[calc(6rem+var(--incident-height,0px))] pb-20 px-6 md:px-12 lg:px-16">
                <div className="max-w-3xl mx-auto">
                    <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
                        {title}
                    </h1>
                    {date && (
                        <p className="text-muted-foreground mb-12 font-mono text-sm md:text-base border-b border-border pb-6">
                            Last Updated: {date}
                        </p>
                    )}
                    <div className="
                        [&_h3]:font-display [&_h3]:text-2xl [&_h3]:md:text-3xl [&_h3]:font-bold [&_h3]:text-foreground [&_h3]:mt-12 [&_h3]:mb-4
                        [&_p]:text-base [&_p]:md:text-lg [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-6
                        [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-8 [&_ul]:space-y-2.5 [&_ul]:text-base [&_ul]:md:text-lg [&_ul]:text-muted-foreground
                        [&_li]:pl-1.5
                        [&_.lead]:text-lg [&_.lead]:md:text-xl [&_.lead]:font-normal [&_.lead]:text-foreground [&_.lead]:mb-8 [&_.lead]:leading-relaxed
                        [&_a]:text-signal [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-foreground transition-colors
                        [&_strong]:font-semibold [&_strong]:text-foreground
                    ">
                        {children}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
