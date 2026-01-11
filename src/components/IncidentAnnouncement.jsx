import { useState, useLayoutEffect, useRef } from "react";
import { X, AlertTriangle, Info } from "lucide-react";

export function IncidentAnnouncement() {
    const [showModal, setShowModal] = useState(false);
    const bannerRef = useRef(null);

    useLayoutEffect(() => {
        const updateHeight = () => {
            if (bannerRef.current) {
                const height = bannerRef.current.offsetHeight;
                document.documentElement.style.setProperty('--incident-height', `${height}px`);
                console.log('Incident banner height:', height);
            }
        };

        // Initial update
        updateHeight();

        // Update on resize
        window.addEventListener('resize', updateHeight);

        // Cleanup
        return () => {
            window.removeEventListener('resize', updateHeight);
            document.documentElement.style.removeProperty('--incident-height');
        };
    }, []);

    return (
        <>
            {/* Announcement Banner */}
            <div ref={bannerRef} className="bg-red-50 border-b-2 border-red-200 w-full fixed top-0 left-0 right-0 z-[100]">
                <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                            <p className="text-sm font-medium text-red-900">
                                <span className="font-bold">Incident Update:</span> indevs.in is temporarily unreachable.
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="ml-2 text-red-700 hover:text-red-900 underline font-bold"
                                >
                                    Read details
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border-2 border-[#E5E3DF]">
                        {/* Header */}
                        <div className="sticky top-0 bg-red-50 p-6 border-b-2 border-red-200 flex items-start justify-between">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <AlertTriangle className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-[#1A1A1A]">Incident Update</h2>
                                    <p className="text-sm text-red-800 mt-1">Service Disruption Notice</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5 text-[#4A4A4A]" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4 text-[#1A1A1A]">
                            <p className="text-base leading-relaxed">
                                <strong>indevs.in</strong> is temporarily unreachable due to a registrar-side hold affecting DNS resolution.
                            </p>

                            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                                <p className="text-sm text-green-900">
                                    <strong>Nameservers and backend infrastructure are unaffected.</strong>
                                </p>
                            </div>

                            <p className="text-base leading-relaxed">
                                We are in contact with the registrar and expect service restoration soon.
                            </p>

                            <p className="text-sm font-medium text-gray-600">
                                Thanks for your patience.
                            </p>
                        </div>

                        {/* Close Button */}
                        <div className="sticky bottom-0 bg-white border-t-2 border-[#E5E3DF] p-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-full bg-[#1A1A1A] text-white py-3 rounded-lg font-bold hover:bg-[#333] transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
