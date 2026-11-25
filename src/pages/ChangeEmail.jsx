import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { subdomainAPI } from "../lib/api";
import { useToast } from "../hooks/use-toast";
import { Loader2, Mail, AlertCircle } from "lucide-react";

export default function ChangeEmail() {
    const [searchParams] = useSearchParams();
    const currentEmail = searchParams.get("email");
    const isRequired = searchParams.get("required") === "true";

    const [newEmail, setNewEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentEmail) {
            navigate('/login');
            return;
        }

        // IMPORTANT: This page is ONLY for noreply email users
        // Normal users should change their email from Settings page
        const isNoreplyEmail = currentEmail.includes('noreply.github.com');
        if (!isNoreplyEmail) {
            toast({
                title: "Not Required",
                description: "Email change from this page is only for GitHub noreply emails. Manage your account at auth.stackryze.com.",
            });
            navigate('/dashboard');
            return;
        }
    }, [currentEmail, navigate, toast]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newEmail || !newEmail.includes('@')) {
            toast({
                variant: "destructive",
                title: "Invalid Email",
                description: "Please enter a valid email address.",
            });
            return;
        }

        if (newEmail.toLowerCase() === currentEmail.toLowerCase()) {
            toast({
                variant: "destructive",
                title: "Same Email",
                description: "Please enter a different email address.",
            });
            return;
        }

        if (newEmail.includes('noreply')) {
            toast({
                variant: "destructive",
                title: "Invalid Email",
                description: "Please use a valid personal email address, not a noreply address.",
            });
            return;
        }

        setIsLoading(true);

        try {
            await subdomainAPI.post('/auth/email/change-email', { newEmail });

            // If we got here without error, email change was successful
            toast({
                title: "Email Updated",
                description: "Redirecting to verification...",
            });

            // Redirect to verification page with the new email
            setTimeout(() => {
                window.location.href = `/verify-email?email=${encodeURIComponent(newEmail)}`;
            }, 1000);

        } catch (err) {
            console.error("Email change failed", err);

            // Handle GitHub re-authentication requirement
            if (err.data?.error === 'github_reauth_required') {
                toast({
                    variant: "destructive",
                    title: "Re-authentication Required",
                    description: "Please log in with GitHub again to change your email.",
                });
                setTimeout(() => {
                    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/auth/github`;
                }, 1500);
                return;
            }

            toast({
                variant: "destructive",
                title: "Failed to Update Email",
                description: err.data?.error || "Please try again later.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-transparent px-4 py-12 font-sans" style={{ paddingTop: 'calc(var(--incident-height, 0px) + 2rem)' }}>
            <Link to="/" className="mb-8 flex items-center gap-3 group">
                <img src="/stackryze_logo_black.png" alt="Stackryze Logo" className="h-9 w-auto dark:hidden" />
                <img src="/stackryze_logo_white.png" alt="Stackryze Logo" className="h-9 w-auto hidden dark:block" />
                <span className="text-xl font-display font-medium text-foreground tracking-tight">Stackryze Domains</span>
            </Link>

            <div className="w-full max-w-md bg-card/80 backdrop-blur-xl border border-border p-8 md:p-10 rounded-2xl shadow-sm">
                <Mail className="w-12 h-12 text-signal mx-auto mb-4" />
                <h1 className="text-3xl font-display font-medium text-foreground mb-2 text-center">Update Your Email</h1>

                {isRequired && (
                    <div className="mb-6 bg-amber-500/10 border border-amber-500/20 text-foreground p-4 rounded-xl flex gap-3 text-sm">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-500 mt-0.5" />
                        <div>
                            <p className="font-semibold text-amber-500 mb-1">Action Required</p>
                            <p className="text-xs text-muted-foreground">Your current email address is a GitHub noreply address and cannot receive verification emails. Please update it to a valid personal email to continue.</p>
                        </div>
                    </div>
                )}

                <div className="mb-6 p-4 bg-muted/40 rounded-xl border border-border">
                    <p className="text-xs text-muted-foreground mb-1 font-medium">Current Email</p>
                    <p className="font-mono text-sm text-foreground break-all">{currentEmail}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            New Email Address
                        </label>
                        <input
                            type="email"
                            required
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30 text-sm"
                            placeholder="your.email@example.com"
                            autoFocus
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                            Use a valid personal email address that you can access.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !newEmail}
                        className="w-full bg-foreground text-background py-3.5 rounded-xl font-semibold text-sm hover:bg-signal hover:text-signal-foreground transition-all duration-200 disabled:opacity-50 shadow-sm"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="animate-spin w-4 h-4" /> Updating...
                            </span>
                        ) : "Update Email"}
                    </button>
                </form>

                <div className="mt-6 text-center text-xs text-muted-foreground">
                    <p>After updating, you'll receive a verification code at your new email address.</p>
                </div>
            </div>

            <div className="mt-6 text-center text-xs text-muted-foreground">
                Need help? <a href="https://discord.gg/wr7s97cfM7" target="_blank" rel="noopener noreferrer" className="text-foreground font-medium hover:text-signal transition-colors underline-offset-4 hover:underline">Join our Discord</a> or email <a href="mailto:support@stackryze.com" className="text-foreground font-medium hover:text-signal transition-colors underline-offset-4 hover:underline">support@stackryze.com</a>
            </div>
        </div>
    );
}
