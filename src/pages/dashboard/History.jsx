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
            default:                return { icon: Activity,   color: "text-muted-foreground bg-secondary" };
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
        <div className="max-w-[1600px] space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-signal mb-1">Account</p>
                    <h1 className="font-display text-2xl md:text-3xl font-medium text-foreground leading-tight">Activity History</h1>
                    <p className="text-sm text-foreground mt-1">
                        {activities.length} {activities.length === 1 ? 'activity' : 'activities'} recorded
                    </p>
                </div>
                <button
                    onClick={fetchActivities}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-card/70 border border-border text-foreground font-bold text-sm rounded-lg hover:bg-muted dark:hover:bg-secondary transition-colors disabled:opacity-50 self-start sm:self-auto backdrop-blur-md shadow-sm"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'Refreshing…' : 'Refresh'}
                </button>
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-7 h-7 animate-spin text-foreground" />
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="bg-red-50/90 dark:bg-red-500/10 border border-red-200/50 dark:border-red-500/20 rounded-xl p-5 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold text-red-900 dark:text-red-400 text-sm">Failed to load history</p>
                        <p className="text-red-700 dark:text-red-300 font-medium text-sm mt-0.5">{error}</p>
                    </div>
                </div>
            )}

            {/* Empty */}
            {!loading && !error && activities.length === 0 && (
                <div className="bg-card/70 backdrop-blur-md border border-border rounded-xl p-12 text-center">
                    <Clock className="w-10 h-10 text-foreground mx-auto mb-3" />
                    <p className="font-bold text-foreground text-sm mb-1">No Activity Yet</p>
                    <p className="text-foreground text-sm">Your account history will appear here.</p>
                </div>
            )}

            {/* Table */}
            {!loading && !error && activities.length > 0 && (
                <>
                    <div className="bg-card/70 backdrop-blur-md border border-border rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full">
                            <thead className="bg-muted dark:bg-black/40 border-b border-border">
                                <tr>
                                    <th className="px-5 py-3 text-left text-xs font-bold text-foreground uppercase tracking-wider">Event</th>
                                    <th className="px-5 py-3 text-left text-xs font-bold text-foreground uppercase tracking-wider">Description</th>
                                    <th className="px-5 py-3 text-right text-xs font-bold text-foreground uppercase tracking-wider">Date & Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border dark:divide-border">
                                {currentActivities.map((activity, index) => {
                                    const { icon: Icon, color } = getIcon(activity.type);
                                    return (
                                        <tr key={index} className="hover:bg-muted dark:hover:bg-accent/60 transition-colors">
                                            <td className="px-5 py-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <p className="text-sm font-bold text-foreground">{activity.description}</p>
                                                {activity.changes?.before && activity.changes?.after && (
                                                    <p className="text-xs font-medium text-foreground mt-0.5">{activity.changes.before} → {activity.changes.after}</p>
                                                )}
                                            </td>
                                            <td className="px-5 py-3 text-right">
                                                <p className="text-sm font-bold text-foreground">{formatDate(activity.timestamp)}</p>
                                                <p className="text-xs font-medium text-foreground">{formatTime(activity.timestamp)}</p>
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
                            <p className="text-sm font-medium text-foreground">
                                Showing {startIndex + 1}–{Math.min(endIndex, activities.length)} of {activities.length}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-bold bg-card/70 border border-border text-foreground rounded-lg hover:bg-muted dark:hover:bg-secondary disabled:opacity-40 transition-colors shadow-sm"
                                >
                                    <ChevronLeft className="w-4 h-4" /> Previous
                                </button>
                                <span className="px-3 py-1.5 text-sm font-bold text-foreground">
                                    {currentPage} / {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-bold bg-card/70 border border-border text-foreground rounded-lg hover:bg-muted dark:hover:bg-secondary disabled:opacity-40 transition-colors shadow-sm"
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
