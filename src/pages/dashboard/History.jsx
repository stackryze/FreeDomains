import { useState, useEffect } from "react";
import { subdomainAPI } from "@/lib/api";
import { Clock, Activity, Plus, RefreshCw, AlertCircle, Trash2, Settings, Loader2, ChevronLeft, ChevronRight, User } from "lucide-react";

export default function History() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    useEffect(() => { fetchActivities(); }, []);

    const fetchActivities = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await subdomainAPI.getActivity();
            setActivities(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'account_created': return { icon: User,       color: "text-emerald-600 bg-emerald-50" };
            case 'login':           return { icon: Activity,   color: "text-cyan-600 bg-cyan-50" };
            case 'create':
            case 'registration':    return { icon: Plus,       color: "text-green-600 bg-green-50" };
            case 'renewal':         return { icon: RefreshCw,  color: "text-blue-600 bg-blue-50" };
            case 'soft_delete':
            case 'deletion_request':return { icon: Trash2,     color: "text-red-600 bg-red-50" };
            case 'nameserver_update':return { icon: Settings,  color: "text-amber-600 bg-amber-50" };
            case 'status_change':   return { icon: AlertCircle,color: "text-purple-600 bg-purple-50" };
            default:                return { icon: Activity,   color: "text-gray-500 bg-gray-50" };
        }
    };

    const formatDate = (ts) => {
        const d = new Date(ts);
        const today = new Date();
        const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
        if (d.toDateString() === today.toDateString()) return 'Today';
        if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const formatTime = (ts) => new Date(ts).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    const totalPages = Math.ceil(activities.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentActivities = activities.slice(startIndex, endIndex);

    return (
        <div className="max-w-4xl space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#FF6B35] mb-1">Account</p>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-[#111827] leading-tight">Activity History</h1>
                    <p className="text-sm text-[#6B7280] mt-1">
                        {activities.length} {activities.length === 1 ? 'activity' : 'activities'} recorded
                    </p>
                </div>
                <button
                    onClick={fetchActivities}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border-[1px] border-[#D1D5DB] text-[#374151] font-semibold text-sm rounded-lg hover:border-[#9CA3AF] transition-colors disabled:opacity-50 self-start sm:self-auto"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'Refreshing…' : 'Refresh'}
                </button>
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-7 h-7 animate-spin text-[#9CA3AF]" />
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="bg-red-50 border-[1px] border-red-200 rounded-xl p-5 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-red-800 text-sm">Failed to load history</p>
                        <p className="text-red-600 text-sm mt-0.5">{error}</p>
                    </div>
                </div>
            )}

            {/* Empty */}
            {!loading && !error && activities.length === 0 && (
                <div className="bg-white border-[1px] border-[#D1D5DB] rounded-xl p-12 text-center">
                    <Clock className="w-10 h-10 text-[#D1D5DB] mx-auto mb-3" />
                    <p className="font-semibold text-[#374151] text-sm mb-1">No Activity Yet</p>
                    <p className="text-[#6B7280] text-sm">Your account history will appear here.</p>
                </div>
            )}

            {/* Table */}
            {!loading && !error && activities.length > 0 && (
                <>
                    <div className="bg-white border-[1px] border-[#D1D5DB] rounded-xl overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                                <tr>
                                    <th className="px-5 py-3 text-left text-xs font-bold text-[#6B7280] uppercase tracking-wider">Event</th>
                                    <th className="px-5 py-3 text-left text-xs font-bold text-[#6B7280] uppercase tracking-wider">Description</th>
                                    <th className="px-5 py-3 text-right text-xs font-bold text-[#6B7280] uppercase tracking-wider">Date & Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F3F4F6]">
                                {currentActivities.map((activity, index) => {
                                    const { icon: Icon, color } = getIcon(activity.type);
                                    return (
                                        <tr key={index} className="hover:bg-[#F9FAFB] transition-colors">
                                            <td className="px-5 py-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <p className="text-sm font-medium text-[#111827]">{activity.description}</p>
                                                {activity.changes?.before && activity.changes?.after && (
                                                    <p className="text-xs text-[#6B7280] mt-0.5">{activity.changes.before} → {activity.changes.after}</p>
                                                )}
                                            </td>
                                            <td className="px-5 py-3 text-right">
                                                <p className="text-sm font-medium text-[#111827]">{formatDate(activity.timestamp)}</p>
                                                <p className="text-xs text-[#6B7280]">{formatTime(activity.timestamp)}</p>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-[#6B7280]">
                                Showing {startIndex + 1}–{Math.min(endIndex, activities.length)} of {activities.length}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm border-[1px] border-[#D1D5DB] rounded-lg hover:border-[#9CA3AF] disabled:opacity-40 transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4" /> Previous
                                </button>
                                <span className="px-3 py-1.5 text-sm font-medium text-[#374151]">
                                    {currentPage} / {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm border-[1px] border-[#D1D5DB] rounded-lg hover:border-[#9CA3AF] disabled:opacity-40 transition-colors"
                                >
                                    Next <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
