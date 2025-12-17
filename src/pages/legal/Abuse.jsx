import { LegalLayout } from "@/layouts/LegalLayout";

export function Abuse() {
    return (
        <LegalLayout title="Abuse Policy" date="December 2025">
            <p className="lead">
                At <strong>Indevs.in</strong>, we have a zero-tolerance policy for abuse, malicious behavior, or illegal activity. We are committed to maintaining a safe, transparent, and developer-friendly environment while protecting the integrity of the internet.
            </p>
            <p>
                This page outlines how to report abuse and how we handle such reports.
            </p>

            <h3>1. Our Commitment</h3>
            <p>
                Indevs.in exists to support creativity, learning, and open collaboration. However, the service must not be used to distribute malware, engage in phishing, host harmful content, or otherwise violate laws or our <a href="/aup" className="text-[#FF6B35] hover:underline">Acceptable Use Policy</a>.
            </p>
            <p>
                We take abuse reports seriously and investigate every case as quickly and fairly as possible.
            </p>

            <div className="bg-red-50 border-l-4 border-red-500 p-6 md:p-8 rounded-r-xl my-10 shadow-sm">
                <h3 className="!mt-0 !text-red-700 flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    2. Report Abuse
                </h3>
                <p className="!text-red-900 font-medium">
                    If you believe a subdomain under *.indevs.in is being used for phishing, malware distribution, impersonation, or any other form of abuse, please report it immediately.
                </p>
                <div className="bg-white/50 p-4 rounded-lg border border-red-100 my-6">
                    <p className="!mb-0 text-xl font-bold flex items-center gap-2 text-red-700">
                        <span></span>
                        <span className="opacity-75">Email:</span>
                        <a href="mailto:reportabuse@admin.indevs.in" className="!text-red-700 underline decoration-red-300 hover:decoration-red-700">reportabuse@admin.indevs.in</a>
                    </p>
                </div>
                <p className="!mb-3 !text-red-900">
                    When submitting a report, please include:
                </p>
                <ul className="!text-red-800 !mb-4 marker:text-red-400">
                    <li>The full URL or subdomain (e.g., example.indevs.in)</li>
                    <li>A brief description of the issue or suspicious behavior</li>
                    <li>Any evidence or screenshots supporting your claim</li>
                </ul>
                <p className="!mb-0 text-sm italic text-red-700/80">
                    Incomplete reports may take longer to verify, so please provide as much detail as possible.
                </p>
            </div>

            <h3>3. How We Handle Reports</h3>

            <p><strong>a. Review and Investigation</strong></p>
            <p>
                All abuse reports are reviewed within 24 hours of submission. Our volunteer moderation team evaluates the evidence, checks DNS and hosting activity, and determines whether the subdomain violates our Terms or Acceptable Use Policy.
            </p>

            <p><strong>b. Enforcement Actions</strong></p>
            <p>
                If a violation is confirmed, we take immediate action. Possible actions include:
            </p>
            <ul>
                <li>Temporary or permanent suspension of the subdomain</li>
                <li>Revocation of the domain record and removal from DNS</li>
                <li>Blacklisting of the account or IP responsible for abuse</li>
            </ul>
            <p>
                Severe or repeated abuse may result in permanent denial of future registrations.
            </p>

            <p><strong>c. Transparency and Privacy</strong></p>
            <p>
                We acknowledge all valid reports once received. However, due to privacy and operational policies, we may not share detailed outcomes of investigations with reporters. Our focus is on quickly neutralizing threats and protecting users across the platform.
            </p>

            <h3>4. False or Malicious Reports</h3>
            <p>
                Submitting false, misleading, or bad-faith abuse reports is itself a violation of our Terms of Service. We may restrict or block individuals who repeatedly submit baseless complaints to disrupt or defame legitimate users.
            </p>

            <h3>5. Collaboration with Authorities</h3>
            <p>
                In serious cases involving criminal activity, phishing networks, or threats to public safety, we may cooperate with law enforcement, hosting providers, or relevant cybersecurity agencies to resolve the issue swiftly and responsibly.
            </p>

            <h3>6. Contact</h3>
            <p>
                For all abuse-related inquiries, reach us at:<br />
                <a href="mailto:reportabuse@admin.indevs.in" className="text-[#FF6B35] hover:underline">reportabuse@admin.indevs.in</a>
            </p>
            <p>
                Please use this email only for abuse-related matters. For general questions or support, contact <a href="mailto:support@admin.indevs.in" className="text-[#FF6B35] hover:underline">support@admin.indevs.in</a> instead.
            </p>
            <p>
                <strong>Indevs.in</strong> is committed to keeping the web safe, open, and trustworthy for all users. Together, we can maintain a secure environment for developers and learners around the world.
            </p>
        </LegalLayout>
    );
}
