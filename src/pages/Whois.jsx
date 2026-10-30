import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer-section";
import { Search, Globe, AlertCircle, Loader2, Copy, Check } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function formatDate(dateStr) {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toISOString().replace("T", " ").slice(0, 19) + "Z";
}

export function Whois() {
    const [query, setQuery] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        const trimmed = query.trim().toLowerCase();
        if (!trimmed) return;

        setLoading(true);
        setResult(null);
        setError(null);

        try {
            const res = await fetch(
                `${API_BASE}/subdomains/whois?query=${encodeURIComponent(trimmed)}`
            );
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Lookup failed. Please try again.");
            } else {
                setResult(data);
            }
        } catch {
            setError("Network error. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    const buildWhoisText = (d) => {
        const lines = [
            `Domain Name: ${d.domainName.toUpperCase()}`,
            `Registrar WHOIS Server: ${d.registrarWhoisServer}`,
            `Registrar URL: ${d.registrarUrl}`,
            `Creation Date: ${formatDate(d.createdAt)}`,
            `Registry Expiry Date: ${formatDate(d.expiresAt)}`,
            `Updated Date: ${formatDate(d.updatedAt)}`,
            `Registrar: ${d.registrar}`,
            `Registrar Abuse Contact Email: ${d.registrarAbuseEmail}`,
            `Domain Status: ${d.domainStatus}`,
            `Registrant Name: ${d.registrantName}`,
            `Registrant Email: ${d.registrantEmail}`,
            `Registrant Address: ${d.registrantAddress}`,
            `Registrant Phone: ${d.registrantPhone}`,
            ...d.nameservers.map((ns) => `Name Server: ${ns}`),
            `DNSSEC: ${d.dnssec}`,
            ``,
            `>>> Last update of WHOIS database: ${formatDate(new Date().toISOString())} <<<`,
        ];
        return lines.join("\n");
    };

    const handleCopy = () => {
        if (!result) return;
        navigator.clipboard.writeText(buildWhoisText(result));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-transparent">
            <Header />

            {/* Hero */}
            <section className="pt-[calc(6rem+var(--incident-height,0px))] pb-8 px-6 md:px-12 lg:px-16">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/80 border border-border text-foreground text-xs font-semibold uppercase tracking-widest mb-6 backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-signal"></span>
                        </span>
                        <span>Registry Directory</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-foreground mb-4 leading-tight tracking-tight">
                        WHOIS Lookup
                    </h1>
                    <p className="text-base text-muted-foreground font-normal max-w-xl mx-auto">
                        Query live registration records, delegation status, and name servers across all Stackryze free domain extensions.
                    </p>
                </div>
            </section>

            {/* Search Bar */}
            <section className="pb-8 px-6">
                <div className="max-w-2xl mx-auto">
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 bg-card/80 backdrop-blur-xl p-2 border border-border rounded-2xl shadow-sm focus-within:border-foreground/30 transition-all">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="e.g. myproject.indevs.in or mybrand.sryze.cc or myapp.ryzedns.org"
                            className="flex-1 px-4 py-3 text-foreground bg-transparent font-mono text-sm outline-none placeholder:text-muted-foreground w-full"
                            disabled={loading}
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={loading || !query.trim()}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-background font-semibold text-sm rounded-xl hover:bg-signal hover:text-signal-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-sm"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Search className="w-4 h-4" />
                            )}
                            {loading ? "Looking up…" : "Lookup"}
                        </button>
                    </form>

                    {/* Supported domains hint */}
                    <p className="text-xs text-muted-foreground mt-3 text-center">
                        Supported:{" "}
                        <span className="font-mono font-medium text-foreground">.indevs.in</span> &amp;{" "}
                        <span className="font-mono font-medium text-foreground">.sryze.cc</span> &amp;{" "}
                        <span className="font-mono font-medium text-foreground">.ryzedns.org</span> &amp;{" "}
                        <span className="font-mono font-medium text-foreground">.nx.kg</span> &amp;{" "}
                        <span className="font-mono font-medium text-foreground">.ryzn.pro</span>
                    </p>
                </div>
            </section>

            {error && (
                <section className="px-6 pb-8">
                    <div className="max-w-2xl mx-auto bg-destructive/10 border border-destructive/20 rounded-2xl p-5 flex gap-3 items-start shadow-sm">
                        <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-destructive text-sm mb-1">Lookup Failed</p>
                            <p className="text-sm text-foreground/80">{error}</p>
                        </div>
                    </div>
                </section>
            )}

            {/* WHOIS Result */}
            {result && (
                <section className="px-6 pb-8">
                    <div className="max-w-2xl mx-auto">
                        {/* Result header */}
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                Live WHOIS Record
                            </h2>
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-card/80 backdrop-blur-md border border-border rounded-xl text-foreground hover:bg-muted transition-all shadow-sm"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-3.5 h-3.5 text-signal" />
                                        <span>Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                                        <span>Copy Record</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Classic WHOIS output block */}
                        <div className="bg-card/90 backdrop-blur-xl rounded-2xl font-mono text-sm overflow-hidden shadow-lg border border-border">
                            {/* Domain name banner */}
                            <div className="px-5 py-3.5 border-b border-border bg-muted/40 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-signal font-semibold text-xs uppercase tracking-widest">
                                        Domain:
                                    </span>
                                    <span className="text-foreground font-bold">
                                        {result.domainName.toUpperCase()}
                                    </span>
                                </div>
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-signal/10 text-signal border border-signal/20">
                                    Active Registry
                                </span>
                            </div>

                            <div className="px-5 py-4 space-y-1.5 leading-relaxed">
                                <WhoisLine label="Registrar WHOIS Server" value={result.registrarWhoisServer} />
                                <WhoisLine label="Registrar URL" value={result.registrarUrl} />
                                <div className="pt-1" />
                                <WhoisLine label="Creation Date" value={formatDate(result.createdAt)} />
                                <WhoisLine label="Registry Expiry Date" value={formatDate(result.expiresAt)} highlight={isExpiringSoon(result.expiresAt)} />
                                <WhoisLine label="Updated Date" value={formatDate(result.updatedAt)} />
                                <div className="pt-1" />
                                <WhoisLine label="Registrar" value={result.registrar} />
                                <WhoisLine label="Registrar Abuse Contact Email" value={result.registrarAbuseEmail} />
                                <div className="pt-1" />
                                <WhoisLine label="Domain Status" value={result.domainStatus} accent />
                                <div className="pt-1" />
                                <WhoisLine label="Registrant Name" value={result.registrantName} dim />
                                <WhoisLine label="Registrant Email" value={result.registrantEmail} />
                                <WhoisLine label="Registrant Address" value={result.registrantAddress} dim />
                                <WhoisLine label="Registrant Phone" value={result.registrantPhone} dim />
                                <div className="pt-1" />
                                {result.nameservers.map((ns, i) => (
                                    <WhoisLine key={i} label="Name Server" value={ns.toUpperCase()} />
                                ))}
                                <div className="pt-1" />
                                <WhoisLine label="DNSSEC" value={result.dnssec} />
                            </div>

                            {/* Footer line */}
                            <div className="px-5 py-3 border-t border-border text-muted-foreground text-xs bg-muted/20">
                                &gt;&gt;&gt; Last update of WHOIS database:{" "}
                                <span className="text-foreground font-semibold">{formatDate(new Date().toISOString())}</span> &lt;&lt;&lt;
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Terms of Use */}
            <section className="pb-16 px-6">
                <div className="max-w-2xl mx-auto border border-border bg-card/60 backdrop-blur-md rounded-2xl p-6 shadow-sm">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground mb-3">
                        Terms of Use
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Access to Stackryze FreeDomain WHOIS information is provided to assist
                        users in understanding the registration details of domain names managed
                        by the Stackryze registry. This data is made available for informational
                        purposes only. This service is intended solely for manual, query-based
                        access.
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                        By accessing this data, you agree that it shall be used only for lawful
                        purposes and not to (a) enable or support unsolicited commercial
                        messages; or (b) automate high-volume queries. Use of this system for
                        data harvesting, spamming, or abuse is strictly prohibited.
                    </p>
                    <p className="text-xs font-medium text-foreground/80 mt-3 italic">
                        Registrant personally identifiable information (name, address, phone) is
                        redacted to protect privacy. Only the registry contact email is exposed.
                    </p>
                </div>
            </section>

            <Footer />
        </div>
    );
}

function WhoisLine({ label, value, accent, dim, highlight }) {
    let valueClass = "text-foreground";
    if (accent) valueClass = "text-signal font-semibold";
    if (dim) valueClass = "text-muted-foreground italic";
    if (highlight) valueClass = "text-amber-500 font-semibold";

    return (
        <div className="flex flex-wrap gap-x-2">
            <span className="text-muted-foreground shrink-0">{label}:</span>
            <span className={valueClass}>{value}</span>
        </div>
    );
}

function isExpiringSoon(dateStr) {
    if (!dateStr) return false;
    const diff = new Date(dateStr) - new Date();
    return diff > 0 && diff < 1000 * 60 * 60 * 24 * 60; // within 60 days
}
