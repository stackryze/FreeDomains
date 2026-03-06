import { Server, Settings } from "lucide-react";
import { ExternalLink } from "lucide-react";

export default function DNSRecords() {
    return (
        <div className="max-w-3xl space-y-6">

            {/* Header */}
            <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#FF6B35] mb-1">Infrastructure</p>
                <h1 className="text-2xl md:text-3xl font-extrabold text-[#111827] leading-tight">DNS Management</h1>
                <p className="text-sm text-[#6B7280] mt-1">Manage your DNS records with Stackryze DNS.</p>
            </div>

            {/* Managed DNS CTA */}
            <div className="bg-white border-[1px] border-[#D1D5DB] rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#F9FAFB] border-[1px] border-[#E5E7EB] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Server className="w-5 h-5 text-[#4B5563]" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-[#111827] text-base">Managed DNS is Now Live!</p>
                            <span className="bg-[#111827] text-white px-2 py-0.5 rounded-full text-xs font-semibold">Live</span>
                        </div>
                        <p className="text-sm text-[#4B5563] leading-relaxed">
                            Host your DNS records directly with <strong>Stackryze DNS</strong> at <span className="font-mono text-[#111827]">dns.stackryze.com</span> — powered by PowerDNS, globally distributed.
                        </p>
                    </div>
                </div>
                <a
                    href="https://dns.stackryze.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#111827] text-white font-semibold text-sm rounded-lg hover:bg-[#374151] transition-colors whitespace-nowrap flex-shrink-0"
                >
                    Get Started
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
            </div>

            {/* How it works (Delegation model) */}
            <div className="bg-white border-[1px] border-[#D1D5DB] rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                    <Settings className="w-4 h-4 text-[#6B7280]" />
                    <h2 className="font-semibold text-sm text-[#111827]">Current DNS Model: Delegation</h2>
                </div>

                <p className="text-sm text-[#4B5563] leading-relaxed mb-4">
                    Indevs operates on a <strong className="text-[#111827]">"Bring Your Own DNS"</strong> model. When you register a subdomain (e.g.,{" "}
                    <code className="bg-[#F9FAFB] border-[1px] border-[#E5E7EB] px-1.5 py-0.5 rounded font-mono text-xs">yourname.indevs.in</code>
                    ), you provide your own nameservers and we handle the NS delegation.
                </p>

                <div className="bg-[#F9FAFB] border-[1px] border-[#E5E7EB] rounded-lg p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-3">How it works</p>
                    <ol className="space-y-2 text-sm text-[#4B5563] list-decimal list-inside">
                        <li>Register your subdomain on Indevs</li>
                        <li>Provide your DNS provider's nameservers (e.g., <code className="bg-white border-[1px] border-[#E5E7EB] px-1.5 py-0.5 rounded font-mono text-xs">ns1.cloudflare.com</code>)</li>
                        <li>We create an NS delegation record pointing to your nameservers</li>
                        <li>Manage all your DNS records (A, CNAME, TXT, etc.) at your DNS provider</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
