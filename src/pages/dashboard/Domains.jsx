import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Settings as SettingsIcon, Trash, RefreshCw, X, ChevronRight, Globe, AlertCircle, Clock, Plus, Info, Shield, KeyRound, Github } from "lucide-react";
import { useDashboard } from "@/context/dashboard-context";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { subdomainAPI } from "@/lib/api";

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function MyDomains() {
    const { subdomains, setSubdomains, refresh, loading } = useDashboard();
    const { user, checkAuth } = useAuth();
    const { toast } = useToast();
    const [manageOpen, setManageOpen] = useState(false);
    const [selectedDomain, setSelectedDomain] = useState(null);
    const [logInput, setLogInput] = useState("");
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isRenewing, setIsRenewing] = useState(false);
    const [pendingVerification, setPendingVerification] = useState(null);

    // Fetch pending GitHub verification
    useEffect(() => {
        const fetchVerification = async () => {
            try {
                const response = await fetch(`${API_BASE}/github/verification-status`, {
                    credentials: 'include'
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data.verification && data.verification.status === 'pending') {
                        setPendingVerification(data.verification);
                    }
                }
            } catch (error) {
                // Silent fail - not critical
                console.error('Failed to fetch verification status:', error);
            }
        };
        fetchVerification();
    }, []);

    // Refresh user data on mount to get latest domain limit
    useEffect(() => {
        checkAuth();
    }, []);

    const handleDelete = async () => {
        if (!deleteId) return;

        setIsDeleting(true);
        try {
            await subdomainAPI.delete(deleteId);

            toast({
                title: "Deletion Request Submitted",
                description: "Your deletion request will be reviewed by an admin. The domain will remain active until approved.",
                className: "bg-blue-50 border-blue-200 text-blue-900"
            });

            // Refresh the list from backend
            await refresh();
        } catch (error) {
            toast({
                title: "Deletion Failed",
                description: error.message || "Unable to delete domain. Please try again or contact support.",
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false);
            setDeleteId(null);
            setManageOpen(false);
        }
    };

    const handleUpdateNameservers = () => {
        setSubdomains(subdomains.map(s => s.id === selectedDomain.id ? selectedDomain : s));
        toast({
            title: "Nameservers Updated",
            description: "Changes may take up to 24 hours to propagate globally.",
            className: "bg-success/10 border-success/20 text-success"
        });
    };

    const handleRenew = async (domain) => {
        setIsRenewing(true);
        try {
            await subdomainAPI.renew(domain._id);

            toast({
                title: "Domain Renewed Successfully! 🎉",
                description: `${domain.name}.${domain.domain || 'indevs.in'} has been extended for another year. New expiry date will be shown on your dashboard.`,
                className: "bg-success/10 border-success/20 text-success"
            });

            // Refresh the list to get updated data
            await refresh();
        } catch (error) {
            toast({
                title: "Cannot Renew Domain",
                description: error.message || "Renewals are only allowed within 60 days of expiry. Check your domain's expiry date and try again later.",
                variant: "destructive"
            });
        } finally {
            setIsRenewing(false);
        }
    };

    const handleAddLog = () => {
        if (!logInput.trim()) return;
        const log = { date: new Date().toISOString().split('T')[0], text: logInput };
        const updated = { ...selectedDomain, logs: [log, ...(selectedDomain.logs || [])] };
        setSelectedDomain(updated);
        setSubdomains(subdomains.map(s => s.id === updated.id ? updated : s));
        setLogInput("");
        toast({ title: "Log Entry Added" });
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            "Active": "bg-success/10 text-success border-success/20",
            "Expired": "bg-destructive/10 text-destructive border-destructive/20",
            "Suspended": "bg-destructive/10 text-destructive border-destructive/20",
            "Deletion Review": "bg-destructive/10 text-destructive border-destructive/20",
            "Pending": "bg-warning/10 text-warning border-warning/20"
        };
        const dotStyles = {
            "Active": "bg-success",
            "Expired": "bg-destructive",
            "Suspended": "bg-destructive",
            "Deletion Review": "bg-destructive",
            "Pending": "bg-warning"
        };

        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${styles[status] || styles["Pending"]}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[status] || dotStyles["Pending"]}`}></span>
                {status}
            </span>
        );
    };

    return (
        <div className="max-w-5xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-4">
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-signal mb-1">Account</p>
                    <h1 className="font-display text-2xl md:text-3xl font-medium text-foreground leading-tight">My Domains</h1>
                    <p className="text-sm text-foreground mt-1">Manage your active domains and configurations.</p>
                </div>
                <button
                    onClick={refresh}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-secondary dark:bg-accent/60 border border-border dark:border-border text-foreground font-semibold text-sm rounded-lg hover:text-foreground dark:hover:text-white hover:-translate-y-0.5 transform transition-all duration-200 hover:shadow-md disabled:opacity-50 self-start sm:self-auto cursor-pointer"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'Refreshing…' : 'Refresh'}
                </button>
            </div>

            {/* Pending GitHub Verification Banner */}
            {pendingVerification && (
                <div className="mb-5 border rounded-xl p-4 bg-warning/10 border-warning/20">
                    <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h3 className="text-sm font-medium text-foreground mb-1">
                                GitHub Verification Pending
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">
                                Your GitHub verification for <strong>{pendingVerification.requestedDomain}.sryze.cc</strong> is being reviewed by our team.
                            </p>
                            <div className="bg-background/50 rounded-lg p-3 text-xs space-y-1">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-warning" />
                                    <span className="font-semibold text-foreground">Status:</span>
                                    <span className="text-muted-foreground">Awaiting Admin Approval</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-warning" />
                                    <span className="font-semibold text-foreground">Domain:</span>
                                    <span className="font-mono text-muted-foreground">{pendingVerification.requestedDomain}.sryze.cc (Reserved)</span>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-3">
                                Once approved, your domain will be automatically created and appear here!
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Domain Usage Indicator */}
            {(() => {
                const indevsCount = subdomains?.filter(s => s.domain === 'indevs.in').length || 0;
                const indevsLimit = user?.githubVerified ? (user?.domainLimit || 1) : 1;
                const indevsPercent = Math.min((indevsCount / indevsLimit) * 100, 100);

                return (
                    <div className="mb-5 rounded-xl p-4 bg-card/70 backdrop-blur-md border border-border">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <Info className="w-4 h-4 text-foreground" />
                                    <span className="font-semibold text-sm text-foreground">
                                        Domain Limits
                                    </span>
                                </div>
                            </div>
                            <Link to="/register" className="self-start sm:self-auto">
                                <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-foreground text-background text-sm hover:bg-foreground/90 dark:hover:bg-accent transition-all duration-200 shadow-sm cursor-pointer font-semibold rounded-lg">
                                    <Plus className="w-4 h-4" />
                                    Register New
                                </button>
                            </Link>
                        </div>

                        {/* Usage Bars Container */}
                        <div className="relative">
                            {!user?.githubVerified && (
                                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/20 dark:bg-[#111]/40 rounded-lg">
                                    <div className="bg-white/80 dark:bg-black/60 backdrop-blur-md border border-border p-5 rounded-xl text-center shadow-sm max-w-sm w-full mx-4">
                                        <Shield className="w-8 h-8 text-warning mx-auto mb-2" />
                                        <p className="text-sm font-bold text-foreground mb-2">GitHub Verification Required</p>
                                        <p className="text-xs text-foreground mb-5">
                                            We require all users to verify their GitHub to prevent abuse. Verify your account to view limits and register domains.
                                        </p>
                                        <div className="flex justify-center gap-2">
                                            <a
                                                href="https://github.com/stackryze/FreeDomains"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 bg-warning text-foreground px-3 py-2 rounded-md font-bold text-xs hover:bg-warning transition-all shadow-sm"
                                            >⭐ Star Repo</a>
                                            <a
                                                href={`${API_BASE}/github/kyc/start?domain=&root=indevs.in`}
                                                className="inline-flex items-center gap-1.5 bg-foreground text-background px-3 py-2 rounded-md font-bold text-xs hover:bg-foreground/90 dark:hover:bg-accent transition-all shadow-sm"
                                            >
                                                <Github className="w-4 h-4" /> Verify Now
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className={`transition-all duration-300 ${!user?.githubVerified ? "opacity-30 blur-sm pointer-events-none select-none" : ""}`}>
                                {/* Indevs.in Usage */}
                                <div className="mb-4">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-semibold text-foreground">indevs.in Domains</span>
                                <span className="text-xs text-foreground">{indevsCount} / {indevsLimit}</span>
                            </div>
                            <div className="w-full bg-muted dark:bg-secondary rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all ${
                                        indevsPercent >= 100 ? 'bg-destructive'
                                        : indevsPercent >= 80 ? 'bg-warning'
                                        : 'bg-blue-600'
                                    }`}
                                    style={{ width: `${indevsPercent}%` }}
                                />
                            </div>
                        </div>

                        {/* Sryze.cc Usage */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-semibold text-foreground">sryze.cc Domains</span>
                                <span className="text-xs text-foreground">
                                    {subdomains?.filter(s => s.domain === 'sryze.cc').length || 0} / {user?.sryzeDomainsLimit || 1}
                                </span>
                            </div>
                            <div className="w-full bg-muted dark:bg-secondary rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all ${((subdomains?.filter(s => s.domain === 'sryze.cc').length || 0) / (user?.sryzeDomainsLimit || 1) * 100) >= 100
                                            ? 'bg-destructive'
                                            : ((subdomains?.filter(s => s.domain === 'sryze.cc').length || 0) / (user?.sryzeDomainsLimit || 1) * 100) >= 80
                                                ? 'bg-warning'
                                                : 'bg-purple-600'
                                        }`}
                                    style={{ width: `${Math.min(((subdomains?.filter(s => s.domain === 'sryze.cc').length || 0) / (user?.sryzeDomainsLimit || 1) * 100), 100)}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* RyzeDNS.org Usage */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-semibold text-foreground">ryzedns.org Domains</span>
                                <span className="text-xs text-foreground">
                                    {subdomains?.filter(s => s.domain === 'ryzedns.org').length || 0} / {user?.ryzeDnsDomainsLimit || 1}
                                </span>
                            </div>
                            <div className="w-full bg-muted dark:bg-secondary rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all ${((subdomains?.filter(s => s.domain === 'ryzedns.org').length || 0) / (user?.ryzeDnsDomainsLimit || 1) * 100) >= 100
                                            ? 'bg-destructive'
                                            : ((subdomains?.filter(s => s.domain === 'ryzedns.org').length || 0) / (user?.ryzeDnsDomainsLimit || 1) * 100) >= 80
                                                ? 'bg-warning'
                                                : 'bg-teal-600'
                                        }`}
                                    style={{ width: `${Math.min(((subdomains?.filter(s => s.domain === 'ryzedns.org').length || 0) / (user?.ryzeDnsDomainsLimit || 1) * 100), 100)}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* nx.kg Usage */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-semibold text-foreground">nx.kg Domains</span>
                                <span className="text-xs text-foreground">
                                    {subdomains?.filter(s => s.domain === 'nx.kg').length || 0} / {user?.nxKgDomainsLimit || 1}
                                </span>
                            </div>
                            <div className="w-full bg-muted dark:bg-secondary rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all ${((subdomains?.filter(s => s.domain === 'nx.kg').length || 0) / (user?.nxKgDomainsLimit || 1) * 100) >= 100
                                            ? 'bg-destructive'
                                            : ((subdomains?.filter(s => s.domain === 'nx.kg').length || 0) / (user?.nxKgDomainsLimit || 1) * 100) >= 80
                                                ? 'bg-warning'
                                                : 'bg-violet-600'
                                        }`}
                                    style={{ width: `${Math.min(((subdomains?.filter(s => s.domain === 'nx.kg').length || 0) / (user?.nxKgDomainsLimit || 1) * 100), 100)}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* ryzn.pro Usage */}
                        <div className="mb-2">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-semibold text-foreground">ryzn.pro Domains</span>
                                <span className="text-xs text-foreground">
                                    {subdomains?.filter(s => s.domain === 'ryzn.pro').length || 0} / {user?.ryznProDomainsLimit || 1}
                                </span>
                            </div>
                            <div className="w-full bg-muted dark:bg-secondary rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all ${((subdomains?.filter(s => s.domain === 'ryzn.pro').length || 0) / (user?.ryznProDomainsLimit || 1) * 100) >= 100
                                            ? 'bg-destructive'
                                            : ((subdomains?.filter(s => s.domain === 'ryzn.pro').length || 0) / (user?.ryznProDomainsLimit || 1) * 100) >= 80
                                                ? 'bg-warning'
                                                : 'bg-emerald-600'
                                        }`}
                                    style={{ width: `${Math.min(((subdomains?.filter(s => s.domain === 'ryzn.pro').length || 0) / (user?.ryznProDomainsLimit || 1) * 100), 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    })()}


            <div className="bg-card/70 backdrop-blur-md border border-border rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-muted/50 dark:bg-accent/60 border-b border-border">
                        <tr>
                            <th className="p-3 md:p-4 text-xs font-bold text-foreground uppercase tracking-wider w-full md:w-5/12">Domain Information</th>
                            <th className="p-3 md:p-4 text-xs font-bold text-foreground uppercase tracking-wider hidden md:table-cell md:w-3/12">Nameservers</th>
                            <th className="p-3 md:p-4 text-xs font-bold text-foreground uppercase tracking-wider hidden md:table-cell md:w-2/12">Status / Expiry</th>
                            <th className="p-3 md:p-4 text-right w-auto md:w-2/12"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border dark:divide-border">
                        {loading && subdomains.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-10 text-center text-foreground">
                                    <RefreshCw className="w-6 h-6 mx-auto mb-2 animate-spin" />
                                    <p>Loading subdomains...</p>
                                </td>
                            </tr>
                        ) : subdomains.map((domain) => (
                            <tr key={domain._id} className="group hover:bg-muted/50 dark:hover:bg-accent/60 transition-colors">
                                <td className="p-3 md:p-4 overflow-hidden">
                                    <div className="flex flex-col min-w-0">
                                        <div className="font-bold text-foreground text-sm sm:text-base flex items-center gap-1.5 max-w-full">
                                            <Globe className="w-3.5 h-3.5 flex-shrink-0" />
                                            <span className="break-words">
                                                {domain.name}.{domain.domain || 'indevs.in'}
                                            </span>
                                        </div>
                                        <span className="text-xs text-foreground font-mono mt-1 truncate max-w-full block" title={`ID: ${domain._id}`}>ID: {domain._id}</span>

                                        {/* Mobile Status View */}
                                        <div className="md:hidden mt-2 space-y-2">
                                            <StatusBadge status={domain.status} />
                                        </div>

                                        {/* Expiry warning */}
                                        {domain.expiresAt && (() => {
                                            const daysUntilExpiry = Math.ceil((new Date(domain.expiresAt) - new Date()) / (1000 * 60 * 60 * 24));
                                            if (daysUntilExpiry > 0 && daysUntilExpiry <= 30) {
                                                return (
                                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-warning  mt-2">
                                                        <AlertCircle className="w-3 h-3" />
                                                        Expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}
                                                    </span>
                                                );
                                            }
                                        })()}
                                    </div>
                                </td>
                                <td className="p-3 md:p-4 hidden md:table-cell overflow-hidden">
                                    <div className="flex flex-col gap-1">
                                        {domain.recordType === 'NS' && domain.recordValue ? (
                                            domain.recordValue.split(',').map((ns, idx) => (
                                                <span key={idx} className="text-foreground font-mono text-xs block truncate" title={ns.trim()}>
                                                    {ns.trim()}
                                                </span>
                                            ))
                                        ) : domain.nameservers && domain.nameservers.length > 0 ? (
                                            domain.nameservers.map((ns, idx) => (
                                                <span key={idx} className="text-foreground font-mono text-xs block truncate" title={ns}>
                                                    {ns}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-muted-foreground italic text-xs">Not configured</span>
                                        )}
                                    </div>
                                </td>
                                <td className="p-3 md:p-4 whitespace-nowrap hidden md:table-cell">
                                    <div className="space-y-1.5">
                                        <StatusBadge status={domain.status} />
                                        <div className="flex items-center gap-1.5 text-[11px] text-foreground font-medium">
                                            <Clock className="w-3.5 h-3.5" />
                                            Expires: <span className="font-mono">{domain.expiresAt ? new Date(domain.expiresAt).toLocaleDateString('en-GB') : 'N/A'}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-2 sm:p-3 md:p-4 text-right align-middle">
                                    <div className="flex justify-end items-center gap-1.5 flex-wrap">
                                        <button
                                            onClick={() => handleRenew(domain)}
                                            disabled={isRenewing || loading || domain.status === 'Pending Deletion'}
                                            className="inline-flex items-center justify-center h-7 md:h-8 px-2.5 font-bold border border-border hover:border-border dark:hover:border-foreground/25 bg-card/70 text-foreground hover:text-foreground dark:hover:text-white shadow-sm transition-all duration-200 disabled:opacity-50 text-[10px] md:text-xs whitespace-nowrap cursor-pointer rounded"
                                            title={domain.status === 'Pending Deletion' ? 'Cannot renew - deletion pending' : 'Renew Domain'}
                                        >
                                            <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                            Renew
                                        </button>
                                        <Link
                                            to={`/domains/${domain._id}`}
                                            className="inline-flex items-center justify-center h-7 md:h-8 px-2.5 font-bold border border-border hover:border-border dark:hover:border-foreground/25 bg-card/70 text-foreground hover:text-foreground dark:hover:text-white shadow-sm transition-all duration-200 text-[10px] md:text-xs whitespace-nowrap cursor-pointer rounded"
                                        >
                                            <SettingsIcon className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1.5" />
                                            Manage
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {!loading && subdomains.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-16">
                                    <div className="text-center">
                                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Globe className="w-10 h-10 text-signal " />
                                        </div>
                                        <h3 className="font-display text-2xl font-medium text-foreground mb-3">No Domains Yet</h3>
                                        <p className="text-foreground mb-6 max-w-md mx-auto">
                                            You haven't registered any domains yet. Get started by claiming your first domain!
                                        </p>
                                        <Button
                                            asChild
                                            className="bg-foreground text-background hover:bg-foreground/90 dark:hover:bg-accent font-bold"
                                        >
                                            <a href="/register">
                                                <Plus className="w-4 h-4 mr-2" />
                                                Register Your First Domain
                                            </a>
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div >

            <Dialog open={manageOpen} onOpenChange={setManageOpen}>
                <DialogContent className="bg-card/90 backdrop-blur-xl border border-border max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            <Globe className="w-6 h-6" />
                            Manage {selectedDomain?.name}.{selectedDomain?.domain || 'indevs.in'}
                        </DialogTitle>
                        <DialogDescription>Configure DNS records, security, and usage log.</DialogDescription>
                    </DialogHeader>

                    <div className="py-4 space-y-8">
                        {/* Status Overview */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-card/70 border border-border rounded-lg p-4">
                                <h5 className="font-bold text-foreground text-sm mb-1">HTTPS Security</h5>
                                <div className="flex items-center gap-2 text-xs font-medium text-success ">
                                    <div className="w-2 h-2 rounded-full bg-success  animate-pulse"></div>
                                    Active (Let's Encrypt)
                                </div>
                            </div>
                            <div className="bg-card/70 border border-border rounded-lg p-4">
                                <h5 className="font-bold text-foreground text-sm mb-1">Expiration</h5>
                                <div className="flex items-center gap-2 text-xs font-medium text-warning ">
                                    <Clock className="w-3 h-3" />
                                    {selectedDomain?.expiresAt ? new Date(selectedDomain.expiresAt).toLocaleDateString('en-GB') : 'N/A'}
                                </div>
                            </div>
                        </div>

                        {/* Nameserver Configuration */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold text-foreground flex items-center gap-2">
                                    <SettingsIcon className="w-4 h-4" /> Nameserver Configuration
                                </h4>
                                <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-secondary rounded text-muted-foreground">Advanced</span>
                            </div>

                            <div className="border border-border rounded-xl p-5 space-y-4 bg-card/70 hover:shadow-sm transition-all focus-within:border-foreground dark:focus-within:border-foreground">
                                <p className="text-sm text-foreground">
                                    Custom nameservers allow you to manage your DNS records via external providers.
                                    Leave blank to use default <b>Stackryze</b> nameservers.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase font-bold text-foreground">Primary Nameserver (NS1)</Label>
                                        <Input
                                            value={selectedDomain?.nameservers?.[0] || ""}
                                            onChange={(e) => {
                                                const newNs = [...(selectedDomain.nameservers || [])];
                                                newNs[0] = e.target.value;
                                                setSelectedDomain({ ...selectedDomain, nameservers: newNs });
                                            }}
                                            placeholder="ns1.topdns.com"
                                            className="font-mono text-sm bg-muted dark:bg-accent/60 border-border placeholder:text-foreground placeholder:opacity-75"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase font-bold text-foreground">Secondary Nameserver (NS2)</Label>
                                        <Input
                                            value={selectedDomain?.nameservers?.[1] || ""}
                                            onChange={(e) => {
                                                const newNs = [...(selectedDomain.nameservers || [])];
                                                newNs[1] = e.target.value;
                                                setSelectedDomain({ ...selectedDomain, nameservers: newNs });
                                            }}
                                            placeholder="ns2.topdns.com"
                                            className="font-mono text-sm bg-muted dark:bg-accent/60 border-border placeholder:text-foreground placeholder:opacity-75"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-2">
                                    <button onClick={handleUpdateNameservers} className="px-4 py-2 bg-foreground text-background hover:bg-foreground/90 dark:hover:bg-accent text-sm font-extrabold shadow-sm transition duration-200 cursor-pointer rounded-lg">Save Nameservers</button>
                                </div>
                            </div>
                        </div>

                        {/* Usage Log */}
                        <div>
                            <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                                <RefreshCw className="w-4 h-4" /> Usage Logs
                            </h4>
                            <div className="bg-card/70 border border-border rounded-lg overflow-hidden">
                                <div className="p-3 bg-muted/50 dark:bg-accent/60 border-b border-border">
                                    <div className="flex gap-2">
                                        <Input
                                            value={logInput}
                                            onChange={(e) => setLogInput(e.target.value)}
                                            placeholder="Add a new usage reason or changelog entry..."
                                            className="h-8 text-xs bg-card border-border"
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddLog()}
                                        />
                                        <button
                                            className="h-8 text-xs font-extrabold uppercase tracking-wider px-4 border border-border bg-card hover:bg-muted dark:hover:bg-secondary text-foreground shadow-sm transition duration-200 cursor-pointer rounded"
                                            onClick={handleAddLog}
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                                <div className="max-h-40 overflow-y-auto">
                                    <table className="w-full text-sm">
                                        <tbody className="divide-y divide-border dark:divide-border">
                                            {selectedDomain?.logs?.map((log, i) => (
                                                <tr key={i}>
                                                    <td className="p-3 text-foreground font-mono whitespace-nowrap align-top text-xs w-24 border-r border-dashed border-border">{log.date}</td>
                                                    <td className="p-3 text-foreground">{log.text}</td>
                                                </tr>
                                            ))}
                                            {(!selectedDomain?.logs || selectedDomain.logs.length === 0) && (
                                                <tr><td colSpan={2} className="p-4 text-center text-foreground italic text-xs">No logs recorded.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="pt-6 mt-6 border-t font-mono">
                            <h4 className="text-destructive font-bold mb-4 text-sm uppercase tracking-wider">Danger Zone</h4>
                            <div className="flex items-center justify-between p-4 border border-destructive/20 bg-destructive/10 rounded-lg">
                                <div>
                                    <p className="font-bold text-foreground">Delete Domain</p>
                                    <p className="text-xs text-muted-foreground">Permanently remove this domain.</p>
                                </div>
                                <button
                                    onClick={() => setDeleteId(selectedDomain.id)}
                                    className="px-4 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground text-sm shadow-sm transition duration-200 cursor-pointer rounded-lg font-bold"
                                >
                                    Delete Domain
                                </button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent className="bg-card/90 backdrop-blur-xl border border-border">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. Your deletion request for
                            <strong className="font-bold"> {selectedDomain?.name}.{selectedDomain?.domain || 'indevs.in'}</strong> will be submitted for admin review.
                            The domain will remain active until approved.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="font-bold">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground font-bold hover:bg-destructive/90"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div >
    );
}
