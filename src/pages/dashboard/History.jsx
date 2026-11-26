import { useState, useEffect } from "react";
import { subdomainAPI } from "@/lib/api";
import { DEMO_ACTIVITIES, IS_LOCAL_DEMO } from "@/lib/demo-data";
import { ConsoleHeader } from "@/components/dashboard/ConsoleHeader";
import {
  Clock,
  Activity,
  Plus,
  RefreshCw,
  AlertCircle,
  Trash2,
  Settings,
  Loader2,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";

export default function History() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const fetchActivities = async () => {
    if (IS_LOCAL_DEMO) {
      setActivities(DEMO_ACTIVITIES);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await subdomainAPI.getActivity();
      setActivities(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case "account_created":
        return User;
      case "login":
        return Activity;
      case "create":
      case "registration":
        return Plus;
      case "renewal":
        return RefreshCw;
      case "soft_delete":
      case "deletion_request":
        return Trash2;
      case "nameserver_update":
        return Settings;
      case "status_change":
        return AlertCircle;
      default:
        return Activity;
    }
  };

  const formatDate = (ts) => {
    const d = new Date(ts);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (ts) =>
    new Date(ts).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const totalPages = Math.ceil(activities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentActivities = activities.slice(startIndex, endIndex);

  return (
    <div className="space-y-6 w-full">
      <ConsoleHeader
        title="Activity History"
        description={`${activities.length} ${activities.length === 1 ? "event" : "events"} recorded across your account.`}
        actions={
          <button
            type="button"
            onClick={fetchActivities}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md border border-border bg-card text-foreground text-sm font-medium hover:bg-secondary transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            <span>{loading ? "Refreshing…" : "Refresh"}</span>
          </button>
        }
      />

      {loading && (
        <div className="rounded-lg border border-border bg-card p-14 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" aria-hidden="true" />
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-medium text-destructive text-sm">Failed to load history</p>
            <p className="text-muted-foreground text-sm mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && activities.length === 0 && (
        <div className="rounded-lg border border-border bg-card p-14 text-center space-y-2">
          <Clock className="w-8 h-8 text-muted-foreground mx-auto" aria-hidden="true" />
          <p className="font-medium text-foreground text-sm">No Activity Yet</p>
          <p className="text-muted-foreground text-xs">
            Registrations, renewals, and nameserver updates will appear here.
          </p>
        </div>
      )}

      {!loading && !error && activities.length > 0 && (
        <>
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-secondary/25 border-b border-border">
                  <tr>
                    <th className="px-5 py-3 text-xs font-medium text-muted-foreground w-14">
                      Type
                    </th>
                    <th className="px-5 py-3 text-xs font-medium text-muted-foreground">
                      Event
                    </th>
                    <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground whitespace-nowrap">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {currentActivities.map((activity, index) => {
                    const IconComp = getIcon(activity.type);
                    return (
                      <tr
                        key={activity._id || index}
                        className="hover:bg-secondary/35 transition-colors"
                      >
                        <td className="px-5 py-3.5 align-top">
                          <div className="w-8 h-8 rounded-md bg-secondary border border-border flex items-center justify-center text-foreground">
                            <IconComp className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
                          </div>
                        </td>
                        <td className="px-5 py-3.5 min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            {activity.description}
                          </p>
                          {activity.changes?.before && activity.changes?.after && (
                            <p className="font-mono text-xs text-muted-foreground mt-1 break-all">
                              {activity.changes.before} → {activity.changes.after}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-right whitespace-nowrap align-top tabular-nums">
                          <p className="text-sm font-medium text-foreground">
                            {formatDate(activity.timestamp)}
                          </p>
                          <p className="font-mono text-xs text-muted-foreground">
                            {formatTime(activity.timestamp)}
                          </p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-xs font-mono text-muted-foreground tabular-nums">
                Showing {startIndex + 1}–{Math.min(endIndex, activities.length)} of{" "}
                {activities.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-card border border-border text-foreground rounded-md hover:bg-secondary disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                  <span>Previous</span>
                </button>
                <span className="px-3 py-1.5 font-mono text-xs text-muted-foreground tabular-nums">
                  {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-card border border-border text-foreground rounded-md hover:bg-secondary disabled:opacity-40 transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
