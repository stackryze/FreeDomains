import { Link, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { subdomainAPI } from "../lib/api";
import { useToast } from "../hooks/use-toast";

export default function CompleteProfile() {
    const [searchParams] = useSearchParams();
    const emailParam = searchParams.get('email') || '';

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: emailParam,
        password: '', // We need password to authenticate the update
        legalName: '',
        address: {
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: ''
        }
    });

    const { toast } = useToast();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validation
            if (!formData.legalName || !formData.address.street || !formData.address.city ||
                !formData.address.state || !formData.address.postalCode || !formData.address.country) {
                throw new Error("Please fill in all profile fields");
            }
            // Password validation: Not required if user is already authenticated via session
            // The backend will handle session-based authentication
            // if (!formData.password) {
            //     throw new Error("Please enter your password to confirm changes");
            // }

            const res = await subdomainAPI.post('/auth/email/complete-profile', formData);

            if (res.message) {
                toast({
                    title: "Profile Updated",
                    description: "Redirecting to verification...",
                });
                window.location.href = `/verify-email?email=${encodeURIComponent(formData.email)}`;
            }

        } catch (err) {
            console.error(err);
            toast({
                variant: "destructive",
                title: "Update Failed",
                description: err.message || "Something went wrong",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-transparent px-4 font-sans py-12" style={{ paddingTop: 'calc(var(--incident-height, 0px) + 2rem)' }}>
            <Link to="/" className="mb-8 flex items-center gap-3 group">
                <img src="/stackryze_logo_black.png" alt="Stackryze Logo" className="h-9 w-auto dark:hidden" />
                <img src="/stackryze_logo_white.png" alt="Stackryze Logo" className="h-9 w-auto hidden dark:block" />
                <span className="text-lg font-semibold text-foreground tracking-[-0.02em]">Stackryze Domains</span>
            </Link>

            <div className="w-full max-w-2xl bg-card/80 backdrop-blur-xl border border-border p-8 md:p-10 rounded-2xl shadow-sm">
                <div className="mb-6 bg-amber-500/10 border border-amber-500/20 text-foreground p-4 rounded-xl flex gap-3 text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-500 mt-0.5" />
                    <div>
                        <p className="font-semibold text-amber-500 mb-1">Action Required</p>
                        <p className="text-xs text-muted-foreground">To continue using Stackryze Domains, please complete your profile with your legal registrant name and address in accordance with ICANN registry standards.</p>
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight mb-2">Complete Your Profile</h1>
                    <p className="text-sm text-muted-foreground">Please provide the missing registry details below</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Account Verification */}
                    <div className="bg-muted/30 p-5 rounded-xl border border-border space-y-3">
                        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Account Credentials</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    readOnly
                                    className="w-full px-3.5 py-2.5 border border-border bg-muted/50 text-muted-foreground rounded-xl cursor-not-allowed text-sm font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Confirm Password <span className="text-muted-foreground/70">(optional)</span></label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-3.5 py-2.5 border border-border bg-background rounded-xl text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-foreground/30"
                                    placeholder="Enter password if needed"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Personal Info */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-semibold text-foreground border-b border-border pb-2 uppercase tracking-wider">Registrant Details</h3>
                        <div>
                            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Full Legal Name</label>
                            <input
                                type="text"
                                name="legalName"
                                required
                                value={formData.legalName}
                                onChange={handleChange}
                                className="w-full px-3.5 py-2.5 border border-border bg-background rounded-xl text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-foreground/30"
                                placeholder="Jane Doe"
                            />
                            <p className="text-xs text-muted-foreground mt-1">Required for domain registration compliance.</p>
                        </div>

                        {/* Address Fields */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Street Address</label>
                                <input
                                    type="text"
                                    name="address.street"
                                    required
                                    value={formData.address.street}
                                    onChange={handleChange}
                                    className="w-full px-3.5 py-2.5 border border-border bg-background rounded-xl text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-foreground/30"
                                    placeholder="123 Innovation Way"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">City</label>
                                    <input
                                        type="text"
                                        name="address.city"
                                        required
                                        value={formData.address.city}
                                        onChange={handleChange}
                                        className="w-full px-3.5 py-2.5 border border-border bg-background rounded-xl text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-foreground/30"
                                        placeholder="San Francisco"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">State / Province</label>
                                    <input
                                        type="text"
                                        name="address.state"
                                        required
                                        value={formData.address.state}
                                        onChange={handleChange}
                                        className="w-full px-3.5 py-2.5 border border-border bg-background rounded-xl text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-foreground/30"
                                        placeholder="CA"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Postal Code</label>
                                    <input
                                        type="text"
                                        name="address.postalCode"
                                        required
                                        value={formData.address.postalCode}
                                        onChange={handleChange}
                                        className="w-full px-3.5 py-2.5 border border-border bg-background rounded-xl text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-foreground/30"
                                        placeholder="94107"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Country</label>
                                    <input
                                        type="text"
                                        name="address.country"
                                        required
                                        value={formData.address.country}
                                        onChange={handleChange}
                                        className="w-full px-3.5 py-2.5 border border-border bg-background rounded-xl text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-foreground/30"
                                        placeholder="United States"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-foreground text-background py-3.5 rounded-xl font-semibold text-sm hover:bg-signal hover:text-signal-foreground transition-all duration-200 disabled:opacity-50 shadow-sm mt-6"
                    >
                        {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin w-4 h-4" /> Updating Profile...</span> : "Save & Verify Email"}
                    </button>

                    <div className="text-center mt-4">
                        <Link to="/login" className="text-xs text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline">Cancel and return to login</Link>
                    </div>

                </form>
            </div>

            <div className="mt-6 text-center text-xs text-muted-foreground">
                Need help? <a href="https://discord.gg/wr7s97cfM7" target="_blank" rel="noopener noreferrer" className="text-foreground font-medium hover:text-signal transition-colors underline-offset-4 hover:underline">Join our Discord</a> or email <a href="mailto:support@stackryze.com" className="text-foreground font-medium hover:text-signal transition-colors underline-offset-4 hover:underline">support@stackryze.com</a>
            </div>

            <p className="mt-8 text-xs text-muted-foreground/60">
                &copy; 2026 Stackryze domains · All rights reserved
            </p>
        </div>
    );
}
