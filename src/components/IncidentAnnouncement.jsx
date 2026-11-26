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
        document.documentElement.style.setProperty("--incident-height", `${height}px`);
      }
    };

    // Use rAF to measure after paint — no setTimeout jitter
    const rafId = requestAnimationFrame(updateHeight);

    window.addEventListener("resize", updateHeight);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", updateHeight);
      document.documentElement.style.removeProperty("--incident-height");
    };
  }, [dismissed, showModal]);

  if (dismissed) return null;

  return (
    <>
      <div
        ref={bannerRef}
        className="bg-card/85 backdrop-blur-xl border-b border-border w-full fixed top-0 left-0 right-0 z-[100]"
      >
        <div className="max-w-[1600px] mx-auto px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Rocket className="w-3.5 h-3.5 text-signal shrink-0" aria-hidden="true" />
              <p className="text-xs font-medium text-foreground truncate">
                <span className="font-mono font-semibold text-signal">NEW:</span>{" "}
                <span className="font-mono font-semibold">.nx.kg</span> domains are live.{" "}
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="ml-1.5 font-medium underline underline-offset-4 hover:text-signal transition-colors whitespace-nowrap"
                >
                  Learn more
                </button>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="shrink-0 p-1 hover:bg-secondary rounded-md transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Dismiss announcement"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
            <div className="border-b border-border p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-signal/10 rounded-lg border border-signal/20 shrink-0">
                  <Rocket className="w-4 h-4 text-signal" aria-hidden="true" />
                </div>
                <h2 className="text-base font-semibold text-foreground leading-tight">
                  .nx.kg Domains Are Live
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <p className="text-sm leading-relaxed text-muted-foreground">
                We launched <strong className="font-mono text-signal">.nx.kg</strong> alongside{" "}
                <strong className="font-mono text-foreground">.indevs.in</strong>,{" "}
                <strong className="font-mono text-foreground">.sryze.cc</strong>,{" "}
                <strong className="font-mono text-foreground">.ryzedns.org</strong>, and{" "}
                <strong className="font-mono text-foreground">.ryzn.pro</strong>. All extensions are free with full NS delegation.
              </p>

              <div className="bg-signal/10 border border-signal/20 rounded-xl p-3.5">
                <p className="text-xs font-medium text-foreground text-center">
                  Star our GitHub repository and verify to unlock all namespaces.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="/register?root=nx.kg"
                  onClick={() => setShowModal(false)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-foreground text-background font-medium text-sm rounded-lg hover:bg-foreground/90 transition-colors"
                >
                  Claim Your Domain
                </a>
                <a
                  href="https://github.com/stackryze/FreeDomains"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-border bg-secondary text-foreground font-medium text-sm rounded-lg hover:bg-accent transition-colors"
                >
                  <Github className="w-4 h-4" aria-hidden="true" />
                  <span>Star Repo</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
