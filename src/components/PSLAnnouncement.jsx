import { useState } from "react";
import { X, AlertCircle, CheckCircle, Clock, Info } from "lucide-react";

export function PSLAnnouncement() {
    const [isVisible, setIsVisible] = useState(true);
    const [showModal, setShowModal] = useState(false);

    if (!isVisible) return null;

    return (
        <>
            {/* Announcement Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-200 w-full relative z-40">
                <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            <p className="text-sm font-medium text-blue-900">
                                <span className="font-bold">New:</span> PSL Update – Temporary SSL issues with some hosting providers.
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="ml-2 text-blue-700 hover:text-blue-900 underline font-bold"
                                >
                                    Learn more
                                </button>
                            </p>
                        </div>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="flex-shrink-0 p-1 hover:bg-blue-100 rounded transition-colors"
                            aria-label="Dismiss announcement"
                        >
                            <X className="w-4 h-4 text-blue-600" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border-2 border-[#E5E3DF]">
                        {/* Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b-2 border-blue-200 flex items-start justify-between">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Info className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-[#1A1A1A]">PSL Update Notice</h2>
                                    <p className="text-sm text-blue-800 mt-1">Important information about recent changes</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5 text-[#4A4A4A]" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6 text-[#1A1A1A]">
                            {/* Intro */}
                            <p className="text-base leading-relaxed">
                                Hi everyone 👋 We have an important update about our domain and some temporary issues you might encounter when setting up your subdomain.
                            </p>

                            {/* Good News */}
                            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-bold text-green-900 mb-2">✅ Great News: PSL Approval!</h3>
                                        <p className="text-sm text-green-800 mb-3">
                                            Our domain was recently <strong>approved and added to Cloudflare's Public Suffix List (PSL)</strong>. You can now onboard and use your subdomains!
                                        </p>
                                        <p className="text-sm text-green-800 mb-2">This brings major security benefits:</p>
                                        <ul className="text-sm text-green-800 space-y-1 ml-4 list-disc">
                                            <li>Each subdomain gets its own isolated security context</li>
                                            <li>Individual SSL certificates for better security</li>
                                            <li>Protection from cookie sharing across subdomains</li>
                                            <li>Industry-standard security like major platforms</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Temporary Issues */}
                            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-bold text-amber-900 mb-2">⚠️ Temporary Setup Issues</h3>
                                        <p className="text-sm text-amber-800 mb-3">
                                            <strong>The PSL approval is brand new</strong> – not all platforms have synced the update yet. Some users may experience temporary issues:
                                        </p>
                                        <ul className="text-sm text-amber-800 space-y-2 ml-4 list-disc">
                                            <li>
                                                <strong>Hosting providers</strong> (Vercel, Netlify, etc.) may show:
                                                <code className="bg-amber-100 px-2 py-0.5 rounded text-xs block mt-1">"This domain is already registered in another account"</code>
                                            </li>
                                            <li><strong>SSL certificate failures</strong> during initial setup or deployment</li>
                                            <li><strong>Proxy/ACME validation errors</strong> when generating certificates</li>
                                        </ul>
                                        <p className="text-sm text-amber-900 font-bold mt-3">This is temporary and will resolve automatically as platforms sync!</p>
                                    </div>
                                </div>
                            </div>

                            {/* Technical Context */}
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                                <div className="flex items-start gap-3">
                                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-bold text-blue-900 mb-2">🔐 Why This Happens (Technical Details)</h3>
                                        <p className="text-sm text-blue-800 mb-2">Even if you use Cloudflare, SSL issues can occur because:</p>
                                        <ul className="text-sm text-blue-800 space-y-2 ml-4 list-disc">
                                            <li><strong>Certificate Authorities (Let's Encrypt, Google ACME)</strong> haven't synced the PSL yet</li>
                                            <li>Cloudflare uses different CAs depending on availability – some may still treat our domain as a single shared domain</li>
                                            <li>Let's Encrypt has <strong>rate limits</strong> – without PSL sync, they count all subdomains as one domain (causing failures for multiple users)</li>
                                            <li>Once synced, each subdomain is treated independently (no more rate limit conflicts)</li>
                                        </ul>
                                        <p className="text-sm text-blue-900 font-bold mt-3 bg-blue-100 p-2 rounded">
                                            ✅ This is NOT your fault or a configuration error! We applied to PSL specifically to provide secure, isolated domains for everyone.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* What Happens Next */}
                            <div className="border-l-4 border-indigo-500 bg-indigo-50 p-4 rounded-r-lg">
                                <div className="flex items-start gap-3">
                                    <Clock className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-bold text-indigo-900 mb-2">⏳ Timeline & Next Steps</h3>
                                        <ul className="text-sm text-indigo-800 space-y-1 ml-4 list-disc">
                                            <li><strong>Already done:</strong> PSL approval ✅</li>
                                            <li><strong>In progress:</strong> Vercel, Netlify, Let's Encrypt, and other platforms are syncing (automatic)</li>
                                            <li><strong>Your action:</strong> None! Just wait if you encounter errors</li>
                                            <li><strong>Existing subdomains:</strong> Will continue working normally</li>
                                        </ul>
                                        <p className="text-sm text-indigo-900 font-medium mt-2">Expected resolution: 1-2 weeks for major platforms</p>
                                    </div>
                                </div>
                            </div>

                            {/* What We Ask */}
                            <div>
                                <h3 className="font-bold text-[#1A1A1A] mb-3">🙏 What We Need From You</h3>
                                <p className="text-sm text-[#4A4A4A] mb-2">If you encounter SSL or deployment errors:</p>
                                <ul className="text-sm text-[#4A4A4A] space-y-2 ml-4 list-disc">
                                    <li><strong>Be patient</strong> – wait a few days and retry</li>
                                    <li><strong>Don't worry</strong> – it's not your account, configuration, or our fault</li>
                                    <li><strong>Retry later</strong> – the issue resolves itself as platforms sync</li>
                                    <li><strong>Report persistent issues</strong> – especially after 2 weeks (screenshots help!)</li>
                                </ul>
                            </div>

                            {/* Footer */}
                            <div className="bg-[#FFF8F0] border-2 border-[#E5E3DF] rounded-lg p-4 text-center">
                                <p className="text-sm text-[#4A4A4A]">
                                    We appreciate your understanding, this change ultimately gives everyone a more secure and future-proof setup.
                                </p>
                                <p className="text-sm text-[#1A1A1A] font-bold mt-2">
                                    Thanks for being part of the community ❤️
                                </p>
                                <p className="text-xs text-[#888] mt-3">— Stackryze Team</p>
                            </div>
                        </div>

                        {/* Close Button */}
                        <div className="sticky bottom-0 bg-white border-t-2 border-[#E5E3DF] p-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-full bg-[#1A1A1A] text-white py-3 rounded-lg font-bold hover:bg-[#333] transition-colors"
                            >
                                Got it, thanks!
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
