import { Link } from 'react-router-dom';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer-section';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col bg-transparent">
            <Header />
            <main className="flex-1 flex flex-col items-center justify-center p-6 text-center pt-[calc(6rem+var(--incident-height,0px))] pb-16">
                <span className="text-xs font-semibold uppercase tracking-widest text-signal mb-4 px-3 py-1 rounded-full bg-signal/10 border border-signal/20">
                    Error 404
                </span>
                <h1 className="text-7xl md:text-8xl font-mono font-semibold text-foreground tracking-tighter mb-2 tabular-nums">
                    404
                </h1>
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4 tracking-tight">
                    Page Not Found
                </h2>
                <p className="text-base text-muted-foreground mb-8 max-w-md">
                    The requested route does not exist or has been relocated within the Stackryze domain registry.
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-foreground text-background font-semibold text-sm hover:bg-signal hover:text-signal-foreground transition-all duration-200 shadow-sm"
                >
                    Return to Registry
                </Link>
            </main>
            <Footer />
        </div>
    );
}
