import { useState, useLayoutEffect, useRef } from "react";
import { X, Rocket, Github } from "lucide-react";

export function IncidentAnnouncement() {
    const [showModal, setShowModal] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const bannerRef = useRef(null);

    useLayoutEffect(() => {
        const updateHeight = () => {
            if (bannerRef.current) {
                const height = dismissed ? 0 : bannerRef.current.offsetHeight;
                document.documentElement.style.setProperty('--incident-height', `${height}px`);
            }
        };

        // Delay slightly to ensure fonts/layout are ready before calculating height
        const timeoutId = window.setTimeout(updateHeight, 50);
        
        window.addEventListener('resize', updateHeight);
        return () => {
            window.clearTimeout(timeoutId);
            window.removeEventListener('resize', updateHeight);
            document.documentElement.style.removeProperty('--incident-height');
        };
    }, [dismissed, showModal]);

    if (dismissed) return null;

    return (
        <>
            {/* Minimalist Thin Banner */}
            <div ref={bannerRef} className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 w-full fixed top-0 left-0 right-0 z-[100] shadow-sm">
                <div className="max-w-[1600px] mx-auto px-4 py-2 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="text-sm flex-shrink-0 animate-pulse">🚀</span>
                            <p className="text-xs font-medium text-slate-900 dark:text-white truncate">
                                <span className="font-extrabold text-orange-500">NEW:</span>{" "}
                                <span className="font-mono font-bold">.nx.kg</span>{" "}
                                domains are live!{" "}
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="ml-2 font-bold underline transition-colors hover:text-orange-500 whitespace-nowrap"
                                >
                                    Learn more →
                                </button>
                            </p>
                        </div>
                        <button
                            onClick={() => setDismissed(true)}
                            className="flex-shrink-0 p-1 hover:bg-slate-900/5 dark:hover:bg-white/10 rounded-lg transition-colors"
                            aria-label="Dismiss announcement"
                        >
                            <X className="w-3.5 h-3.5 text-slate-900 dark:text-white hover:text-orange-500 transition-colors" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Compact Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white/90 dark:bg-[#1A1A1A]/95 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-[24px] shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">

                        {/* Header */}
                        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 p-5 flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-500/10 rounded-xl border border-orange-500/20 shadow-sm flex-shrink-0">
                                    <Rocket className="w-5 h-5 text-orange-500" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
                                        .nx.kg is Live! 🎉
                                    </h2>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-1.5 hover:bg-slate-900/5 dark:hover:bg-white/10 rounded-xl transition-colors"
                                aria-label="Close modal"
                            >
                                <X className="w-5 h-5 text-slate-900 dark:text-white" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            <p className="text-sm leading-relaxed text-slate-900 dark:text-white font-medium">
                                We've just launched{" "}
                                <strong className="font-mono font-bold text-orange-500">.nx.kg</strong> — our newest domain extension,
                                joining{" "}
                                <strong className="font-mono font-bold">.indevs.in</strong>,{" "}
                                <strong className="font-mono font-bold">.sryze.cc</strong>, and{" "}
                                <strong className="font-mono font-bold">.ryzedns.org</strong>.
                                <br/><br/>
                                All domains are <strong>free</strong>, instant, and come with full DNS management.
                            </p>

                            <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-4">
                                <p className="text-xs font-bold text-slate-900 dark:text-white text-center">
                                    Star our GitHub repo to instantly unlock all premium extensions.
                                </p>
                            </div>

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <a
                                    href="/register"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 border border-slate-200/80 dark:border-white/10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm rounded-xl hover:scale-[1.02] transition-transform shadow-md"
                                >
                                    Claim Your Domain →
                                </a>
                                <a
                                    href="https://github.com/stackryze/FreeDomains"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 border border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-md text-slate-900 dark:text-white font-bold text-sm rounded-xl hover:scale-[1.02] transition-transform shadow-sm"
                                >
                                    <Github className="w-4 h-4" />
                                    Star Repo
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
