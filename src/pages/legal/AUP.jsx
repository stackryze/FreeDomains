import { LegalLayout } from "@/layouts/LegalLayout";

export function AUP() {
    return (
        <LegalLayout title="Acceptable Use Policy" date="December 11, 2025">
            <p className="lead">
                At <strong>Indevs.in</strong>, our mission is to provide a safe, open, and collaborative space for developers, students, and creators to host projects and personal websites. To maintain the integrity and security of the platform, all users must comply with this Acceptable Use Policy (AUP).
            </p>
            <p>
                Any violation of this policy may result in immediate suspension or permanent termination of your subdomain and related access.
            </p>

            <h3>1. Prohibited Content</h3>
            <p>
                You may not use an Indevs subdomain to host, redirect, or otherwise facilitate any content that:
            </p>

            <p><strong>Malware & Phishing</strong></p>
            <ul>
                <li>Distributes or links to malware, viruses, ransomware, or Trojan horses.</li>
                <li>Hosts or facilitates phishing pages or deceptive login portals.</li>
            </ul>

            <p><strong>Deceptive or Harmful Content</strong></p>
            <ul>
                <li>Engages in scams, impersonation, or social engineering attacks.</li>
                <li>Hosts fraudulent, misleading, or manipulative websites.</li>
            </ul>

            <p><strong>Adult or Pornographic Material</strong></p>
            <ul>
                <li>Contains or promotes pornography, sexually explicit content, or adult material of any form.</li>
            </ul>

            <p><strong>Illegal Activity</strong></p>
            <ul>
                <li>Promotes, depicts, or enables activities that violate applicable laws of India, the United States, or international regulations.</li>
                <li>Infringes upon intellectual property rights, including copyright, trademark, or patent laws.</li>
            </ul>

            <p><strong>Hate Speech or Violence</strong></p>
            <ul>
                <li>Encourages or glorifies violence, terrorism, or self-harm.</li>
                <li>Promotes hatred or discrimination based on race, religion, nationality, gender, sexual orientation, or any other protected status.</li>
            </ul>

            <h3>2. Prohibited Actions</h3>
            <p>
                You may not use Indevs subdomains or services to perform any of the following actions:
            </p>

            <p><strong>Spam and Unsolicited Messaging</strong></p>
            <ul>
                <li>Sending or facilitating unsolicited bulk messages (“spam”).</li>
                <li>Hosting spam-related landing pages, mailing lists, or referral scams.</li>
            </ul>

            <p><strong>Abusive or Malicious Behavior</strong></p>
            <ul>
                <li>Operating or controlling botnets, command-and-control servers, or exploit infrastructure.</li>
                <li>Performing or participating in DDoS attacks, stress testing, or unauthorized scanning.</li>
                <li>Interfering with or attempting to disrupt Indevs systems, DNS infrastructure, or other users’ domains.</li>
            </ul>

            <p><strong>Resource Misuse</strong></p>
            <ul>
                <li>Generating excessive or abusive network traffic that degrades platform stability.</li>
                <li>Hosting cryptocurrency mining, proxy tunneling, or bandwidth abuse operations.</li>
            </ul>

            <h3>3. Enforcement and Reporting</h3>
            <p>
                Violations of this policy are taken seriously. We may take the following actions at our sole discretion:
            </p>
            <ul>
                <li>Suspend, disable, or permanently remove subdomains in violation.</li>
                <li>Revoke user access or prevent future registrations.</li>
                <li>Share relevant data with abuse prevention networks or law enforcement, if legally required.</li>
            </ul>
            <p>
                We collaborate with security researchers and authorities to ensure rapid takedowns of malicious or harmful content.
            </p>
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg my-8">
                <p className="font-bold text-red-900 mb-2">To report abuse, please email:</p>
                <a href="mailto:reportabuse@admin.indevs.in" className="text-xl font-bold text-red-700 hover:underline">reportabuse@admin.indevs.in</a>
                <p className="text-red-800 mt-2 text-sm">
                    Provide the full subdomain URL and a brief description of the suspected violation. All reports are reviewed within 24 hours.
                </p>
            </div>

            <h3>4. Responsibility</h3>
            <p>
                You are responsible for all content, links, and activity associated with your subdomain. Failure to comply with this policy or attempts to circumvent enforcement actions will result in permanent suspension and potential legal reporting.
            </p>

            <h3>5. Policy Updates</h3>
            <p>
                We may revise this Acceptable Use Policy periodically to reflect evolving security standards and community expectations. The updated version will be published on this page with a new “Last Updated” date. Continued use of the platform constitutes acceptance of any changes.
            </p>
            <p className="mt-8 font-medium">
                By using Indevs.in, you agree to abide by this Acceptable Use Policy. Together, we can maintain a secure, trusted, and developer-friendly space for everyone.
            </p>
        </LegalLayout>
    );
}
