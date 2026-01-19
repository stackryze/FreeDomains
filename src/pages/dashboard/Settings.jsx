import { useAuth } from "@/context/auth-context";
import { Shield, Mail } from "lucide-react";

export default function Settings() {
    const { user } = useAuth();

    return (
        <div className="space-y-8 max-w-4xl">
            <h1 className="text-3xl font-bold text-[#1A1A1A] capitalize mb-10">Settings / Profile</h1>
            {/* User Profile Info */}
            <div className="bg-white border-2 border-[#E5E3DF] rounded-xl p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-sm">
                <img
                    src={user?.avatarUrl || "https://github.com/shadcn.png"}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-[#FFD23F] shadow-[4px_4px_0px_0px_#1A1A1A]"
                />
                <div className="text-center md:text-left flex-1 space-y-4">
                    <div>
                        <h3 className="text-3xl font-bold text-[#1A1A1A]">{user?.name || "User"}</h3>
                        <p className="text-lg text-[#4A4A4A] font-mono">@{user?.username || user?.email?.split('@')[0]}</p>
                    </div>

                    {user?.bio && <p className="text-[#4A4A4A] italic">"{user.bio}"</p>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-[#4A4A4A] font-medium">
                        {user?.company && <div className="flex items-center gap-2">🏢 {user.company}</div>}
                        {user?.location && <div className="flex items-center gap-2">📍 {user.location}</div>}
                        {user?.blog && <div className="flex items-center gap-2">🔗 <a href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`} target="_blank" rel="noreferrer" className="hover:underline">{user.blog}</a></div>}
                        {user?.twitterUsername && <div className="flex items-center gap-2">🐦 @{user.twitterUsername}</div>}
                        {user?.email && <div className="flex items-center gap-2">✉️ {user.email}</div>}
                    </div>
                </div>
            </div>

            {/* Official Channels Box */}
            <div className="bg-[#FFF8F0] border-2 border-[#E5E3DF] rounded-xl p-8 md:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Shield className="w-32 h-32 text-[#1A1A1A]" />
                </div>

                <h3 className="text-xl font-bold text-[#1A1A1A] mb-6 flex items-center gap-2">
                    <Shield className="w-6 h-6" />
                    Official Communication Channels
                </h3>

                <div className="bg-white p-6 rounded-lg border border-[#E5E3DF] mb-8 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-[#888]" />
                            <span className="font-mono text-[#1A1A1A] font-bold">support@stackryze.com</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-[#888]" />
                            <span className="font-mono text-[#1A1A1A] font-bold">reportabuse@stackryze.com</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-[#888]" />
                            <span className="font-mono text-[#1A1A1A] font-bold">security@stackryze.com</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-[#888]" />
                            <span className="font-mono text-[#1A1A1A] font-bold">no-reply@stackryze.com</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-[#fce8e6] border border-[#f5c2c7] rounded-lg text-[#c5221f]">
                    <Shield className="w-6 h-6 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold text-sm mb-1">Safety Warning</p>
                        <p className="text-sm leading-relaxed opacity-90">
                            We will <strong>NEVER</strong> contact you from any other domain or prefix. If you receive emails claiming to be from us from a @gmail.com or other address, please report it immediately to reportabuse@stackryze.com.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
