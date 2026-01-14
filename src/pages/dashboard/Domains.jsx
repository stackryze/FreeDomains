import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Settings as SettingsIcon, Trash, RefreshCw, X, ChevronRight, Globe, AlertCircle, Clock, Plus, Info } from "lucide-react";
import { useDashboard } from "@/context/dashboard-context";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { subdomainAPI } from "@/lib/api";

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
            className: "bg-[#e6f4ea] border-green-200 text-green-900"
        });
    };

    const handleRenew = async (domain) => {
        setIsRenewing(true);
        try {
            const updated = await subdomainAPI.renew(domain._id);

            toast({
                title: "Domain Renewed Successfully! 🎉",
                description: `${domain.name}.indevs.in has been extended for another year. New expiry date will be shown on your dashboard.`,
                className: "bg-[#e6f4ea] border-green-200 text-green-900"
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
            "Active": "bg-[#e6f4ea] text-[#1e8e3e] border-[#ceead6]",
            "Deletion Review": "bg-red-50 text-red-600 border-red-200",
            "Pending": "bg-[#fef7e0] text-[#b06000] border-[#fce8b2]"
        };
        const dotStyles = {
            "Active": "bg-[#1e8e3e]",
            "Deletion Review": "bg-red-600",
            "Pending": "bg-[#b06000]"
        };

        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${styles[status] || styles["Pending"]}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[status] || dotStyles["Pending"]}`}></span>
                {status}
            </span>
        );
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-10 gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] capitalize">My Domains</h1>
                    <p className="text-sm sm:text-base text-[#4A4A4A] mt-1">Manage your active domains and configurations.</p>
                </div>
                <Button
                    onClick={refresh}
                    disabled={loading}
                    className="bg-[#1A1A1A] text-white hover:bg-[#333] font-bold w-full sm:w-auto"
                >
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'Refreshing...' : 'Refresh List'}
                </Button>
            </div>

            {/* Domain Usage Indicator */}
            <div className="mb-6 border-2 rounded-xl p-5 bg-blue-50 border-blue-200">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Info className="w-5 h-5 text-blue-600" />
                        <span className="font-bold text-sm text-blue-900">
                            Domain Usage: {subdomains?.length || 0} / {user?.domainLimit || 5}
                        </span>
                    </div>
                    <Link to="/register">
                        <Button size="sm" className="bg-[#FFD23F] hover:bg-[#FFB800] text-[#1A1A1A] font-bold">
                            <Plus className="w-4 h-4 mr-2" />
                            Register New
                        </Button>
                    </Link>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-white rounded-full h-2.5 mb-2">
                    <div
                        className={`h-2.5 rounded-full transition-all ${((subdomains?.length || 0) / (user?.domainLimit || 5) * 100) >= 100
                            ? 'bg-red-600'
                            : ((subdomains?.length || 0) / (user?.domainLimit || 5) * 100) >= 80
                                ? 'bg-amber-500'
                                : 'bg-green-600'
                            }`}
                        style={{ width: `${Math.min(((subdomains?.length || 0) / (user?.domainLimit || 5) * 100), 100)}%` }}
                    ></div>
                </div>

                <p className="text-xs text-blue-800">
                    {(user?.domainLimit || 5) - (subdomains?.length || 0)} {((user?.domainLimit || 5) - (subdomains?.length || 0)) === 1 ? 'domain' : 'domains'} remaining
                </p>
            </div>

            <div className="bg-white rounded-xl border-2 border-[#E5E3DF] overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#f9f9f9] border-b-2 border-[#E5E3DF]">
                        <tr>
                            <th className="p-4 md:p-6 text-xs font-bold text-[#888] uppercase tracking-wider w-full md:w-5/12">Domain Information</th>
                            <th className="p-4 md:p-6 text-xs font-bold text-[#888] uppercase tracking-wider hidden md:table-cell md:w-3/12">Nameservers</th>
                            <th className="p-4 md:p-6 text-xs font-bold text-[#888] uppercase tracking-wider hidden md:table-cell md:w-2/12">Status / Expiry</th>
                            <th className="p-4 md:p-6 text-right w-auto md:w-2/12"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E3DF]">
                        {loading && subdomains.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-10 text-center text-[#888]">
                                    <RefreshCw className="w-6 h-6 mx-auto mb-2 animate-spin" />
                                    <p>Loading subdomains...</p>
                                </td>
                            </tr>
                        ) : subdomains.map((domain) => (
                            <tr key={domain._id} className="group hover:bg-gray-50 transition-colors">
                                <td className="p-4 md:p-6 overflow-hidden">
                                    <div className="flex flex-col min-w-0">
                                        <div className="font-bold text-[#1A1A1A] text-base sm:text-lg flex items-start gap-2 max-w-full">
                                            <Globe className="w-4 h-4 flex-shrink-0 mt-1.5" />
                                            <span className="break-words">
                                                {domain.name}.indevs.in
                                            </span>
                                        </div>
                                        <span className="text-xs text-[#888] font-mono mt-1 truncate max-w-full block" title={`ID: ${domain._id}`}>ID: {domain._id}</span>

                                        {/* Mobile Status View */}
                                        <div className="md:hidden mt-2 space-y-2">
                                            <StatusBadge status={domain.status} />
                                        </div>

                                        {/* Expiry warning */}
                                        {domain.expiresAt && (() => {
                                            const daysUntilExpiry = Math.ceil((new Date(domain.expiresAt) - new Date()) / (1000 * 60 * 60 * 24));
                                            if (daysUntilExpiry > 0 && daysUntilExpiry <= 30) {
                                                return (
                                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#b06000] mt-2">
                                                        <AlertCircle className="w-3 h-3" />
                                                        Expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}
                                                    </span>
                                                );
                                            }
                                        })()}
                                    </div>
                                </td>
                                <td className="p-4 md:p-6 hidden md:table-cell overflow-hidden">
                                    <div className="flex flex-col gap-1">
                                        {domain.recordType === 'NS' && domain.recordValue ? (
                                            domain.recordValue.split(',').map((ns, idx) => (
                                                <span key={idx} className="text-[#4A4A4A] font-mono text-xs block truncate" title={ns.trim()}>
                                                    {ns.trim()}
                                                </span>
                                            ))
                                        ) : domain.nameservers && domain.nameservers.length > 0 ? (
                                            domain.nameservers.map((ns, idx) => (
                                                <span key={idx} className="text-[#4A4A4A] font-mono text-xs block truncate" title={ns}>
                                                    {ns}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-[#888] italic text-xs">Not configured</span>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4 md:p-6 whitespace-nowrap hidden md:table-cell">
                                    <div className="space-y-2">
                                        <StatusBadge status={domain.status} />
                                        <div className="flex items-center gap-1.5 text-xs text-[#4A4A4A] font-medium">
                                            <Clock className="w-3.5 h-3.5" />
                                            Expires: <span className="font-mono">{domain.expiresAt ? new Date(domain.expiresAt).toLocaleDateString('en-GB') : 'N/A'}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-2 sm:p-4 md:p-6 text-right">
                                    <div className="flex justify-end gap-1 sm:gap-2 flex-wrap">
                                        <Button
                                            size="sm"
                                            onClick={() => handleRenew(domain)}
                                            disabled={isRenewing || loading || domain.status === 'Pending Deletion'}
                                            className="h-7 sm:h-8 md:h-9 px-2 sm:px-3 bg-[#e6f4ea] text-[#1e8e3e] hover:bg-[#d4edda] border border-[#ceead6] font-bold shadow-none hover:shadow-sm transition-all disabled:opacity-50 text-[10px] sm:text-xs md:text-sm whitespace-nowrap"
                                            title={domain.status === 'Pending Deletion' ? 'Cannot renew - deletion pending' : 'Renew Domain'}
                                        >
                                            <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                            Renew
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                            className="h-7 sm:h-8 md:h-9 px-2 sm:px-3 font-bold border-2 hover:bg-[#1A1A1A] hover:text-[#FFD23F] transition-all text-[10px] sm:text-xs md:text-sm whitespace-nowrap"
                                        >
                                            <Link to={`/domains/${domain._id}`}>
                                                <SettingsIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                                Manage
                                            </Link>
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {!loading && subdomains.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-16">
                                    <div className="text-center">
                                        <div className="w-20 h-20 bg-[#FFF8F0] rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Globe className="w-10 h-10 text-[#FF6B35]" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-[#1A1A1A] mb-3">No Domains Yet</h3>
                                        <p className="text-[#4A4A4A] mb-6 max-w-md mx-auto">
                                            You haven't registered any domains yet. Get started by claiming your first domain!
                                        </p>
                                        <Button
                                            asChild
                                            className="bg-[#1A1A1A] text-white hover:bg-[#333] font-bold"
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
                <DialogContent className="bg-white border-2 border-[#E5E3DF] max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            <Globe className="w-6 h-6" />
                            Manage {selectedDomain?.name}.indevs.in
                        </DialogTitle>
                        <DialogDescription>Configure DNS records, security, and usage log.</DialogDescription>
                    </DialogHeader>

                    <div className="py-4 space-y-8">
                        {/* Status Overview */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#FFF8F0] border border-[#E5E3DF] rounded-lg p-4">
                                <h5 className="font-bold text-[#1A1A1A] text-sm mb-1">HTTPS Security</h5>
                                <div className="flex items-center gap-2 text-xs font-medium text-[#1e8e3e]">
                                    <div className="w-2 h-2 rounded-full bg-[#1e8e3e] animate-pulse"></div>
                                    Active (Let's Encrypt)
                                </div>
                            </div>
                            <div className="bg-[#FFF8F0] border border-[#E5E3DF] rounded-lg p-4">
                                <h5 className="font-bold text-[#1A1A1A] text-sm mb-1">Expiration</h5>
                                <div className="flex items-center gap-2 text-xs font-medium text-[#b06000]">
                                    <Clock className="w-3 h-3" />
                                    {selectedDomain?.expiresAt ? new Date(selectedDomain.expiresAt).toLocaleDateString('en-GB') : 'N/A'}
                                </div>
                            </div>
                        </div>

                        {/* Nameserver Configuration */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold text-[#1A1A1A] flex items-center gap-2">
                                    <SettingsIcon className="w-4 h-4" /> Nameserver Configuration
                                </h4>
                                <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-gray-100 rounded text-gray-500">Advanced</span>
                            </div>

                            <div className="border-2 border-[#E5E3DF] rounded-xl p-5 space-y-4 hover:border-[#aaa] transition-colors focus-within:border-[#1A1A1A]">
                                <p className="text-sm text-[#4A4A4A]">
                                    Custom nameservers allow you to manage your DNS records via external providers.
                                    Leave blank to use default <b>indevs.in</b> nameservers.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase font-bold text-[#888]">Primary Nameserver (NS1)</Label>
                                        <Input
                                            value={selectedDomain?.nameservers?.[0] || ""}
                                            onChange={(e) => {
                                                const newNs = [...(selectedDomain.nameservers || [])];
                                                newNs[0] = e.target.value;
                                                setSelectedDomain({ ...selectedDomain, nameservers: newNs });
                                            }}
                                            placeholder="ns1.topdns.com"
                                            className="font-mono text-sm bg-gray-50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase font-bold text-[#888]">Secondary Nameserver (NS2)</Label>
                                        <Input
                                            value={selectedDomain?.nameservers?.[1] || ""}
                                            onChange={(e) => {
                                                const newNs = [...(selectedDomain.nameservers || [])];
                                                newNs[1] = e.target.value;
                                                setSelectedDomain({ ...selectedDomain, nameservers: newNs });
                                            }}
                                            placeholder="ns2.topdns.com"
                                            className="font-mono text-sm bg-gray-50"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-2">
                                    <Button onClick={handleUpdateNameservers} size="sm" className="font-bold bg-[#1A1A1A]">Save Nameservers</Button>
                                </div>
                            </div>
                        </div>

                        {/* Usage Log */}
                        <div>
                            <h4 className="font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">
                                <RefreshCw className="w-4 h-4" /> Usage Logs
                            </h4>
                            <div className="bg-white border rounded-lg border-[#E5E3DF] overflow-hidden">
                                <div className="p-3 bg-gray-50 border-b border-[#E5E3DF]">
                                    <div className="flex gap-2">
                                        <Input
                                            value={logInput}
                                            onChange={(e) => setLogInput(e.target.value)}
                                            placeholder="Add a new usage reason or changelog entry..."
                                            className="h-8 text-xs bg-white"
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddLog()}
                                        />
                                        <Button
                                            size="sm"
                                            className="h-8 text-xs font-bold uppercase tracking-wider px-4"
                                            onClick={handleAddLog}
                                        >
                                            Add
                                        </Button>
                                    </div>
                                </div>
                                <div className="max-h-40 overflow-y-auto">
                                    <table className="w-full text-sm">
                                        <tbody className="divide-y divide-[#E5E3DF]">
                                            {selectedDomain?.logs?.map((log, i) => (
                                                <tr key={i}>
                                                    <td className="p-3 text-[#888] font-mono whitespace-nowrap align-top text-xs w-24 border-r border-dashed border-[#E5E3DF]">{log.date}</td>
                                                    <td className="p-3 text-[#1A1A1A]">{log.text}</td>
                                                </tr>
                                            ))}
                                            {(!selectedDomain?.logs || selectedDomain.logs.length === 0) && (
                                                <tr><td colSpan={2} className="p-4 text-center text-[#888] italic text-xs">No logs recorded.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="pt-6 mt-6 border-t font-mono">
                            <h4 className="text-red-600 font-bold mb-4 text-sm uppercase tracking-wider">Danger Zone</h4>
                            <div className="flex items-center justify-between p-4 border border-red-200 bg-red-50 rounded-lg">
                                <div>
                                    <p className="font-bold text-red-900">Delete Domain</p>
                                    <p className="text-xs text-red-700">Permanently remove this domain.</p>
                                </div>
                                <Button
                                    variant="destructive"
                                    onClick={() => setDeleteId(selectedDomain.id)}
                                    className="font-bold"
                                >
                                    Delete Domain
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent className="bg-white border-2 border-[#E5E3DF]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. Your deletion request for
                            <strong className="font-bold"> {selectedDomain?.name}.indevs.in</strong> will be submitted for admin review.
                            The domain will remain active until approved.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="font-bold">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-red-600 text-white font-bold hover:bg-red-700"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div >
    );
}
