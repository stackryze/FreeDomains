import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDashboard } from "@/context/dashboard-context";
import { useToast } from "@/hooks/use-toast";
import { subdomainAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, ArrowLeft, RefreshCw, Clock, Shield, Trash, Settings as SettingsIcon, AlertCircle, CheckCircle, Loader2, XCircle, KeyRound } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function DomainDetail() {
    const { id } = useParams();
    // navigate removed
    const { subdomains, refresh } = useDashboard();
    const { toast } = useToast();

    const [domain, setDomain] = useState(null);
    const [ns1, setNs1] = useState("");
    const [ns2, setNs2] = useState("");
    const [isEditingDNS, setIsEditingDNS] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isRenewing, setIsRenewing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [dnsVerifyCode, setDnsVerifyCode] = useState("");
    const [isSettingCode, setIsSettingCode] = useState(false);
    const [dnsVerifyOpen, setDnsVerifyOpen] = useState(false);

    useEffect(() => {
        const foundDomain = subdomains.find(d => d._id === id);
        if (foundDomain) {
            setDomain(foundDomain);
            // Parse nameservers from recordValue if it's NS type
            if (foundDomain.recordType === 'NS' && foundDomain.recordValue) {
                const ns = foundDomain.recordValue.split(',').map(n => n.trim());
                setNs1(ns[0] || '');
                setNs2(ns[1] || '');
            }
        }
        // Only set loading to false after we've checked the subdomains
        setIsLoading(false);
    }, [id, subdomains]);

    const handleRenew = async () => {
        setIsRenewing(true);
        try {
            await subdomainAPI.renew(domain._id);
            toast({
                title: "Domain Renewed Successfully! 🎉",
                description: `${domain.name}.${domain.domain || 'indevs.in'} has been extended for 1 year. New expiry date: ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB')}`,

                className: "bg-[#e6f4ea] border-green-200 text-green-900"
            });
            await refresh();
        } catch (error) {
            toast({
                title: "Cannot Renew Domain",
                description: error.message || "Renewals are only available within 60 days before expiry. Please check back later.",
                variant: "destructive"
            });
        } finally {
            setIsRenewing(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await subdomainAPI.delete(domain._id);
            toast({
                title: "Deletion Request Submitted",
                description: "Your deletion request will be reviewed by an admin. The domain will remain active until approved.",
                className: "bg-blue-50 border-blue-200 text-blue-900"
            });
            await refresh();
            // Navigate away since domain is gone
            // If refresh updates subdomains list, the useEffect will redirect or show not found
        } catch (error) {
            toast({
                title: "Deletion Failed",
                description: error.message || "Unable to delete domain. Please try again or contact support.",
                variant: "destructive"
            });
        } finally {
            setIsDeleting(false);
            setDeleteDialogOpen(false);
        }
    };

    const handleSetDnsVerificationCode = async () => {
        if (!dnsVerifyCode.trim() || dnsVerifyCode.trim().length < 10) {
            toast({
                title: "Invalid Code",
                description: "Please enter a valid verification code from the DNS platform (dns.stackryze.com).",
                variant: "destructive"
            });
            return;
        }

        setIsSettingCode(true);
        try {
            await subdomainAPI.setDnsVerificationCode(domain._id, dnsVerifyCode.trim());
            toast({
                title: "Verification Code Set! ✅",
                description: "Now go back to dns.stackryze.com and click 'Verify Ownership' to complete the process.",
                className: "bg-[#e6f4ea] border-green-200 text-green-900"
            });
            setDnsVerifyOpen(false);
            setDnsVerifyCode("");
            await refresh();
        } catch (error) {
            toast({
                title: "Failed to Set Code",
                description: error.message || "Unable to set verification code. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsSettingCode(false);
        }
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="text-center py-20">
                    <Loader2 className="w-16 h-16 text-gray-300 mx-auto mb-4 animate-spin" />
                    <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">Loading Domain...</h2>
                    <p className="text-[#4A4A4A]">Please wait while we fetch your domain details.</p>
                </div>
            </div>
        );
    }

    // Show not found only after loading is complete
    if (!domain) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="text-center py-20">
                    <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">Domain Not Found</h2>
                    <p className="text-[#4A4A4A] mb-6">This domain doesn't exist or you don't have access to it.</p>
                    <Button asChild>
                        <Link to="/my-domains">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Domains
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    const daysUntilExpiry = domain.expiresAt
        ? Math.ceil((new Date(domain.expiresAt) - new Date()) / (1000 * 60 * 60 * 24))
        : null;

    return (
        <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex items-start gap-2 sm:gap-4 min-w-0 flex-1 w-full">
                    <Button variant="outline" asChild className="border-2 flex-shrink-0">
                        <Link to="/my-domains">
                            <ArrowLeft className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline">Back</span>
                        </Link>
                    </Button>
                    <div className="min-w-0 flex-1">
                        <h1 className="text-base sm:text-xl md:text-2xl font-bold text-[#1A1A1A] flex items-center gap-2 break-all" title={`${domain.name}.${domain.domain || 'indevs.in'}`}>
                            <Globe className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
                            <span className="leading-tight">{domain.name}<wbr />.{domain.domain || 'indevs.in'}</span>
                        </h1>
                        <p className="text-[#4A4A4A] text-[10px] sm:text-xs mt-1 truncate" title={`Domain ID: ${domain._id}`}>Domain ID: {domain._id}</p>
                    </div>
                </div>
                <div className="flex-shrink-0 w-full sm:w-auto">
                    {domain.status === 'Pending Deletion' && (
                        <div className="flex items-center text-xs sm:text-sm text-amber-600 font-medium mt-2">
                            <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            Deletion request under review
                        </div>
                    )}
                </div>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border-2 border-[#E5E3DF] rounded-xl p-4 space-y-2">
                    <div className="flex justify-between items-center">
                        <p className="text-[10px] font-bold text-[#888] uppercase">Status</p>
                        <p className={`text-base font-extrabold ${domain.status === 'Active' ? 'text-[#1e8e3e]' :
                            domain.status === 'Pending Deletion' ? 'text-amber-600' :
                                'text-[#b06000]'
                            }`}>
                            {domain.status}
                        </p>
                    </div>
                    {domain.status === 'Pending Deletion' && (
                        <p className="text-[10px] text-amber-700 mt-1">
                            Your deletion request is being reviewed
                        </p>
                    )}

                    <div className="border-t border-[#E5E3DF] pt-2 flex justify-between items-center">
                        <p className="text-[10px] font-bold text-[#888] uppercase">Registered On</p>
                        <p className="text-sm text-[#1A1A1A] font-medium">
                            {domain.createdAt ? new Date(domain.createdAt).toLocaleDateString('en-GB') : 'N/A'}
                        </p>
                    </div>

                    <div className="border-t border-[#E5E3DF] pt-2 flex justify-between items-center">
                        <p className="text-[10px] font-bold text-[#888] uppercase">Registration Period</p>
                        <p className="text-sm text-[#1A1A1A] font-medium">1 Year (Fixed)</p>
                    </div>
                </div>

                {/* Right Column - Expiry Info */}
                <div className="bg-white border-2 border-[#E5E3DF] rounded-xl p-4 flex flex-col justify-center">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-[10px] font-bold text-[#888] uppercase">Expires On</p>
                            <p className="text-xl font-extrabold text-[#1A1A1A]">
                                {domain.expiresAt ? new Date(domain.expiresAt).toLocaleDateString('en-GB') : 'Never'}
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                             <Button
                                onClick={handleRenew}
                                disabled={isRenewing || (daysUntilExpiry && daysUntilExpiry > 60) || domain.status === 'Pending Deletion'}
                                className="bg-[#e6f4ea] text-[#1e8e3e] hover:bg-[#d4edda] border border-[#ceead6] font-bold h-7 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto text-[10px] px-2.5 shadow-none"
                                title={
                                    domain.status === 'Pending Deletion'
                                        ? 'Cannot renew - deletion pending'
                                        : (daysUntilExpiry && daysUntilExpiry > 60) ? 'Check back closer to expiry' : 'Renew Domain'
                                }
                            >
                                <RefreshCw className={`w-3 h-3 justify-center ${isRenewing ? 'animate-spin mr-1' : 'mr-1'}`} />
                                {isRenewing ? 'Renewing...' : 'Renew'}
                            </Button>
                            {daysUntilExpiry && daysUntilExpiry > 60 && (
                                <p className="text-[10px] text-[#888] flex items-center gap-1 font-medium">
                                    <Clock className="w-3 h-3" />
                                    Renewal in {daysUntilExpiry - 60} days
                                </p>
                            )}
                        </div>
                    </div>

                    {daysUntilExpiry && daysUntilExpiry <= 60 && daysUntilExpiry > 0 && (
                        <div className={`mt-4 p-3 rounded-lg ${daysUntilExpiry <= 30 ? 'bg-red-50 border-l-4 border-red-500' : 'bg-amber-50 border-l-4 border-amber-500'}`}>
                            <div className="flex items-center gap-2">
                                <AlertCircle className={`w-4 h-4 ${daysUntilExpiry <= 30 ? 'text-red-500' : 'text-amber-500'}`} />
                                <p className={`text-xs font-bold ${daysUntilExpiry <= 30 ? 'text-red-800' : 'text-amber-800'}`}>
                                    Domain expires in {daysUntilExpiry} days
                                </p>
                            </div>
                            <p className={`text-xs mt-1 ${daysUntilExpiry <= 30 ? 'text-red-700' : 'text-amber-700'}`}>
                                Renew now to keep {domain.name}.{domain.domain || 'indevs.in'} active.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Single Important Notice */}
            {daysUntilExpiry && daysUntilExpiry <= 60 && (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                    <p className="text-sm font-bold text-green-900 mb-1">Renewal Available</p>
                    <p className="text-sm text-green-800">
                        You can renew your domain when it has less than 60 days until expiry. We'll email you reminders.
                    </p>
                </div>
            )}

            {/* Show lock notice for Pending Deletion */}
            {domain.status === 'Pending Deletion' && (
                <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-r-lg">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-amber-900 mb-1">Domain Locked</p>
                            <p className="text-sm text-amber-800">
                                This domain is pending deletion and cannot be modified. The deletion request will be reviewed within 48 hours.
                                If you wish to cancel the deletion, please contact support.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Show lock notice for Suspended Status */}
            {domain.status === 'Suspended' && (
                <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-lg">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-red-900 mb-1">Domain Suspended</p>
                            <p className="text-sm text-red-800">
                                This domain has been suspended by an administrator and cannot be modified. DNS resolution is disabled.
                                Please contact support if you believe this is an error.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* DNS Configuration */}
            <div className="bg-white border-2 border-[#E5E3DF] rounded-xl p-4 sm:p-5 md:p-6 mb-4">
                <div className="flex flex-col gap-2 mb-4">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                            <Globe className="w-5 h-5 text-[#1A1A1A] flex-shrink-0" />
                            <h2 className="text-lg sm:text-xl font-bold text-[#1A1A1A] truncate">DNS Configuration</h2>
                        </div>
                        {domain.status !== 'Pending Deletion' && domain.status !== 'Suspended' && (
                            <Button
                                onClick={() => {
                                    if (isEditingDNS) {
                                        // Cancel editing - reset values
                                        if (domain.recordType === 'NS' && domain.recordValue) {
                                            const ns = domain.recordValue.split(',').map(n => n.trim());
                                            setNs1(ns[0] || '');
                                            setNs2(ns[1] || '');
                                        }
                                        setIsEditingDNS(false);
                                    } else {
                                        setIsEditingDNS(true);
                                    }
                                }}
                                variant={isEditingDNS ? "outline" : "default"}
                                size="sm"
                                className={`font-bold flex-shrink-0 ${isEditingDNS ? 'border-red-500 text-red-600 hover:bg-red-50' : 'bg-[#1A1A1A] text-white hover:bg-[#333]'}`}
                            >
                                {isEditingDNS ? (
                                    <>
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Cancel
                                    </>
                                ) : (
                                    <>
                                        <SettingsIcon className="w-4 h-4 mr-2" />
                                        Edit
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className={`border rounded-lg p-6 transition-colors ${isEditingDNS ? 'bg-blue-50 border-blue-200' : 'bg-[#FFF8F0] border-[#E5E3DF]'}`}>
                        <h3 className="font-bold text-[#1A1A1A] mb-2">Nameservers (NS Records)</h3>
                        <p className="text-sm text-[#4A4A4A] mb-4">
                            Custom nameservers allow you to manage your DNS records via external providers like Cloudflare or Route53.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs uppercase font-bold">Primary Nameserver (NS1)</Label>
                                <Input
                                    value={ns1}
                                    onChange={(e) => setNs1(e.target.value)}
                               
                                    className={`font-mono transition-all ${isEditingDNS ? 'bg-white border-blue-300 focus:border-blue-500' : 'bg-gray-100 cursor-not-allowed'}`}
                                    readOnly={!isEditingDNS}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs uppercase font-bold">Secondary Nameserver (NS2)</Label>
                                <Input
                                    value={ns2}
                                    onChange={(e) => setNs2(e.target.value)}
                                  
                                    className={`font-mono transition-all ${isEditingDNS ? 'bg-white border-blue-300 focus:border-blue-500' : 'bg-gray-100 cursor-not-allowed'}`}
                                    readOnly={!isEditingDNS}
                                />
                            </div>
                        </div>

                        {isEditingDNS && (
                            <div className="flex justify-end mt-4">
                                <Button
                                    onClick={async () => {
                                        // Validate nameservers
                                        if (!ns1 || !ns2) {
                                            toast({
                                                title: "Validation Error",
                                                description: "Both nameservers are required.",
                                                variant: "destructive"
                                            });
                                            return;
                                        }

                                        try {
                                            // Update via API
                                            await subdomainAPI.update(domain._id, {
                                                recordValue: `${ns1.trim()}, ${ns2.trim()}`
                                            });

                                            toast({
                                                title: "Nameservers Updated Successfully!",
                                                description: "Changes may take up to 48 hours to propagate globally.",
                                                className: "bg-[#e6f4ea] border-green-200 text-green-900"
                                            });

                                            setIsEditingDNS(false);
                                            await refresh();
                                        } catch (error) {
                                            toast({
                                                title: "Update Failed",
                                                description: error.message || "Unable to update nameservers. Please try again.",
                                                variant: "destructive"
                                            });
                                        }
                                    }}
                                    className="bg-[#1A1A1A] text-white hover:bg-[#333] font-bold"
                                >
                                    Save Nameservers
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-blue-900 mb-1">DNS Propagation Notice</p>
                                <p className="text-sm text-blue-800">
                                    Changes to nameservers may take up to 48 hours to propagate globally.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* DNS Verification Section */}
            <div className="bg-white border-2 border-[#E5E3DF] rounded-xl p-4 sm:p-5 md:p-6 mb-4">
                <div className="flex items-center gap-2 mb-4">
                    <KeyRound className="w-5 h-5 text-[#F59E0B]" />
                    <h2 className="text-lg sm:text-xl font-bold text-[#1A1A1A]">DNS Verification</h2>
                </div>
                
                <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 space-y-3">
                    <p className="text-xs sm:text-sm text-[#4A4A4A]">
                        If you want to manage this domain's DNS records on <a href="https://dns.stackryze.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">dns.stackryze.com</a>, 
                        you need to verify ownership. Add the zone on the DNS platform, copy the verification code it gives you, and paste it here.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                        {domain.dnsVerificationCode ? (
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span className="text-sm font-bold text-green-800">Verification code is set</span>
                                </div>
                                <p className="text-xs text-[#4A4A4A]">
                                    Now go to <strong>dns.stackryze.com</strong> and click "Verify Ownership" to complete the verification.
                                </p>
                            </div>
                        ) : (
                            <div className="flex-1">
                                <p className="text-sm text-amber-800 font-medium">
                                    No verification code set yet. Add your zone on dns.stackryze.com first, then paste the code here.
                                </p>
                            </div>
                        )}
                        <Button
                            onClick={() => setDnsVerifyOpen(true)}
                            disabled={domain.status === 'Pending Deletion' || domain.status === 'Suspended'}
                            className="bg-[#F59E0B] text-black hover:bg-[#D97706] font-bold flex-shrink-0"
                        >
                            <KeyRound className="w-4 h-4 mr-2" />
                            {domain.dnsVerificationCode ? 'Update Code' : 'Add Code'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* DNS Verification Dialog */}
            <AlertDialog open={dnsVerifyOpen} onOpenChange={setDnsVerifyOpen}>
                <AlertDialogContent className="bg-white border-2 border-[#E5E3DF]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <KeyRound className="w-5 h-5 text-[#F59E0B]" />
                            DNS Verification Code
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Paste the verification code from <strong>dns.stackryze.com</strong> for <strong>{domain.name}.{domain.domain || 'indevs.in'}</strong>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800 space-y-1">
                            <p><strong>1.</strong> Go to <a href="https://dns.stackryze.com" target="_blank" rel="noopener noreferrer" className="underline">dns.stackryze.com</a></p>
                            <p><strong>2.</strong> Add zone <strong>{domain.name}.{domain.domain || 'indevs.in'}</strong></p>
                            <p><strong>3.</strong> Copy the verification code it shows you</p>
                            <p><strong>4.</strong> Paste it below and click Save</p>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs uppercase font-bold text-[#888]">Verification Code</Label>
                            <Input
                                value={dnsVerifyCode}
                                onChange={(e) => setDnsVerifyCode(e.target.value)}
                                placeholder="sryze-verify-..."
                                className="font-mono text-sm"
                            />
                        </div>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="font-bold">Cancel</AlertDialogCancel>
                        <Button
                            onClick={(e) => {
                                e.preventDefault();
                                handleSetDnsVerificationCode();
                            }}
                            disabled={isSettingCode || !dnsVerifyCode.trim()}
                            className="bg-[#F59E0B] text-black hover:bg-[#D97706] font-bold"
                        >
                            {isSettingCode ? 'Saving...' : 'Save Code'}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Danger Zone - Only show if not already pending deletion or suspended */}
            {
                domain.status !== 'Pending Deletion' && (
                    <div className="bg-white border-2 border-red-200 rounded-xl p-4 sm:p-5 md:p-6 mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <h2 className="text-lg font-bold text-red-600">Danger Zone</h2>
                        </div>
                        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex-1">
                                    <p className="font-bold text-red-900 mb-1">Request Deletion</p>
                                    <p className="text-sm text-red-700">Submit this domain for deletion. An admin will review your request.</p>
                                </div>
                                <button
                                    onClick={() => setDeleteDialogOpen(true)}
                                    className="bg-red-600 text-white hover:bg-red-700 font-bold px-6 py-2.5 rounded-md whitespace-nowrap w-full md:w-auto transition-colors flex items-center justify-center gap-2"
                                >
                                    <Trash className="w-4 h-4" />
                                    Delete Domain
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="bg-white border-2 border-[#E5E3DF]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Domain?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Your deletion request for <strong className="font-bold">{domain.name}.{domain.domain || 'indevs.in'}</strong> will be submitted for review.
                            The domain will remain active until approved.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="font-bold">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 font-bold"
                        >
                            {isDeleting ? 'Submitting...' : 'Submit Deletion Request'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div >
    );
}
