import React from 'react';
import { Mail, Shield, Scale, LifeBuoy, AlertTriangle, MessageCircle, FileText } from 'lucide-react';

const ContactRow = ({ icon: Icon, title, email }) => (
    <div className="flex flex-col sm:flex-row items-center gap-4 py-4 border-b border-dashed border-gray-200 last:border-0 sticky mx-auto max-w-lg">
        <div className="flex items-center gap-3 min-w-[200px]">
            <Icon className="w-5 h-5 text-[#FF6B35]" />
            <span className="font-bold text-[#1A1A1A]">{title}</span>
        </div>
        <span className="hidden sm:inline text-gray-300">-</span>
        <a
            href={`mailto:${email}`}
            className="font-mono text-blue-600 hover:underline"
        >
            {email}
        </a>
    </div>
);

export default function Help() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <h1 className="text-2xl font-bold text-center mb-8">Contact Us</h1>

            <div className="flex flex-col items-center mb-10">
                <a
                    href="https://discord.gg/wr7s97cfM7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold rounded-lg transition-colors text-sm"
                >
                    <MessageCircle className="w-4 h-4" />
                    Join Discord Community
                </a>
            </div>

            <div className="space-y-2">
                <ContactRow
                    icon={LifeBuoy}
                    title="General Support"
                    email="support@stackryze.com"
                />
                <ContactRow
                    icon={AlertTriangle}
                    title="Report Abuse"
                    email="reportabuse@stackryze.com"
                />
                <ContactRow
                    icon={Shield}
                    title="Security"
                    email="security@stackryze.com"
                />
                <ContactRow
                    icon={Scale}
                    title="Privacy Inquiries"
                    email="privacy@stackryze.com"
                />
                <ContactRow
                    icon={FileText}
                    title="Legal Notices"
                    email="legal@stackryze.com"
                />
            </div>
        </div>
    );
}
