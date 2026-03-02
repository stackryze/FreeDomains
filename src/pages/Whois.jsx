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
        <div className="min-h-screen bg-[#FFF8F0]">
            <Header />

            {/* Hero */}
            <section className="pt-[calc(6rem+var(--incident-height,0px))] pb-8 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-widest mb-6">
                        <Globe className="w-3 h-3 text-[#FF6B35]" />
                        <span>Domain WHOIS</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] mb-2 leading-tight">
                        WHOIS Lookup
                    </h1>
                    <p className="text-sm text-[#4A4A4A] max-w-xl mx-auto">
                        Look up registration details for any domain on the{" "}
                        <span className="font-bold text-[#1A1A1A]">Stackryze</span> free
                        domain registry.
                    </p>
                </div>
            </section>

            {/* Search Bar */}
            <section className="pb-8 px-6">
                <div className="max-w-2xl mx-auto">
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 bg-white p-2 border-2 border-[#E5E3DF] rounded-2xl shadow-sm focus-within:border-[#1A1A1A] focus-within:shadow-[3px_3px_0px_0px_#1A1A1A] transition-all">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="e.g. myproject.indevs.in or mybrand.sryze.cc"
                            className="flex-1 px-4 py-3 text-[#1A1A1A] bg-transparent font-mono text-sm outline-none placeholder:text-[#aaa] w-full"
                            disabled={loading}
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={loading || !query.trim()}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1A1A1A] text-white font-bold text-sm rounded-xl hover:bg-[#FF6B35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Search className="w-4 h-4" />
                            )}
                            {loading ? "Looking up…" : "Search"}
                        </button>
                    </form>

                    {/* Supported domains hint */}
                    <p className="text-xs text-[#888] mt-2 text-center">
                        Supported: <span className="font-mono font-bold text-[#4A4A4A]">.indevs.in</span> &amp;{" "}
                        <span className="font-mono font-bold text-[#4A4A4A]">.sryze.cc</span>
                    </p>
                </div>
            </section>

            {error && (
                <section className="px-6 pb-8">
                    <div className="max-w-2xl mx-auto bg-red-50 border-2 border-red-200 rounded-2xl p-5 flex gap-3 items-start">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold text-red-900 text-sm mb-1">Lookup Failed</p>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </section>
            )}

            {/* WHOIS Result */}
            {result && (
                <section className="px-6 pb-6">
                    <div className="max-w-2xl mx-auto">
                        {/* Result header */}
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-[#4A4A4A]">
                                WHOIS Record
                            </h2>
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-white border-2 border-[#E5E3DF] rounded-xl text-[#4A4A4A] hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-all"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-3 h-3" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-3 h-3" />
                                        Copy
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Classic WHOIS output block */}
                        <div className="bg-[#1A1A1A] rounded-2xl font-mono text-sm overflow-hidden shadow-lg border-2 border-[#222]">
                            {/* Domain name banner */}
                            <div className="px-5 pt-4 pb-2 border-b border-[#333]">
                                <span className="text-[#FFD23F] font-bold text-xs uppercase tracking-widest">
                                    Domain Name:
                                </span>{" "}
                                <span className="text-white font-bold">
                                    {result.domainName.toUpperCase()}
                                </span>
                            </div>

                            <div className="px-5 py-4 space-y-1 leading-relaxed">
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
                            <div className="px-5 pb-4 pt-1 border-t border-[#333] text-[#888] text-xs">
                                &gt;&gt;&gt; Last update of WHOIS database:{" "}
                                <span className="text-[#aaa]">{formatDate(new Date().toISOString())}</span> &lt;&lt;&lt;
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Terms of Use */}
            <section className="pb-10 px-6">
                <div className="max-w-2xl mx-auto border-2 border-[#E5E3DF] bg-white rounded-2xl p-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#888] mb-3">
                        Terms of Use
                    </h3>
                    <p className="text-xs text-[#4A4A4A] leading-relaxed">
                        Access to Stackryze FreeDomain WHOIS information is provided to assist
                        users in understanding the registration details of domain names managed
                        by the Stackryze registry. This data is made available for informational
                        purposes only. This service is intended solely for manual, query-based
                        access.
                    </p>
                    <p className="text-xs text-[#4A4A4A] leading-relaxed mt-2">
                        By accessing this data, you agree that it shall be used only for lawful
                        purposes and not to (a) enable or support unsolicited commercial
                        messages; or (b) automate high-volume queries. Use of this system for
                        data harvesting, spamming, or abuse is strictly prohibited.
                    </p>
                    <p className="text-xs text-[#888] mt-3 italic">
                        Registrant personally identifiable information (name, address, phone) is
                        always redacted to protect privacy. Only the registrant email is shown.
                    </p>
                </div>
            </section>

            <Footer />
        </div>
    );
}

function WhoisLine({ label, value, accent, dim, highlight }) {
    let valueClass = "text-[#e2e8f0]";
    if (accent) valueClass = "text-[#4ade80]";
    if (dim) valueClass = "text-[#6b7280] italic";
    if (highlight) valueClass = "text-[#fbbf24]";

    return (
        <div className="flex flex-wrap gap-x-1">
            <span className="text-[#94a3b8] shrink-0">{label}:</span>
            <span className={valueClass}>{value}</span>
        </div>
    );
}

function isExpiringSoon(dateStr) {
    if (!dateStr) return false;
    const diff = new Date(dateStr) - new Date();
    return diff > 0 && diff < 1000 * 60 * 60 * 24 * 60; // within 60 days
}
