import { LegalLayout } from "@/layouts/LegalLayout";

export function Privacy() {
    return (
        <LegalLayout title="Privacy Policy" date="January 13, 2026">
            <p className="lead">
                Welcome to <strong>Stackryze Domains</strong>, a free subdomain service operated by <strong>Stackryze</strong>, a registered MSME (Micro, Small and Medium Enterprise) in India. This Privacy Policy describes how we collect, use, store, and protect your information when you use our services.
            </p>
            <p className="font-medium">
                This policy is governed by and construed in accordance with the laws of India.
            </p>
            <p>
                We believe privacy is a fundamental right and collect only what is reasonably necessary to operate this service securely. Certain information such as full address is collected to deter abuse, establish jurisdiction, and support legal compliance.
            </p>
            <p>
                By using Stackryze Domains, you agree to the practices described below. If you do not agree with this policy, please discontinue use of the platform.
            </p>

            <h3>1. Data Controller</h3>
            <p>
                <strong>Stackryze</strong> (registered MSME, India) is the data controller for all personal information collected through our domain services. All data processing is conducted in accordance with the Information Technology Act, 2000, and applicable Indian data protection laws.
            </p>

            <h3>2. Information We Collect</h3>
            <p><strong>Information You Provide:</strong></p>
            <ul>
                <li>Username, display name, legal full name, email address, phone number (with country code), and full address</li>
                <li>Chosen subdomain and optional project descriptions</li>
                <li>DNS configuration data (nameservers, records)</li>
                <li>GitHub account information (if using OAuth authentication). <strong>GitHub OAuth scopes used:</strong> read:user, user:email. We receive only: username, email, and public profile information. We do NOT access private repositories or code. You can revoke this access anytime via GitHub settings.</li>
            </ul>

            <p><strong>KYC and Identity Verification:</strong></p>
            <p>
                In cases of abuse, legal requirements, or elevated risk, Stackryze may request additional identity verification information, including government-issued identification or proof of address. Such data is collected strictly for verification and abuse prevention purposes.
            </p>

            <p><strong>Automatically Collected Information:</strong></p>
            <ul>
                <li>IP address, browser type, and user-agent</li>
                <li>DNS query logs and request timestamps</li>
                <li>System access logs for security and abuse prevention</li>
            </ul>
            <p>
                We log DNS query activity, domain creation metadata, and nameserver propagation to ensure stability and investigate abuse. These logs are stored securely and not shared publicly.
            </p>

            <p><strong>Cookies and Third-Party Services:</strong></p>
            <p>
                We use essential cookies for session persistence and authentication. We also use:
            </p>
            <ul>
                <li><strong>Google Analytics (gtag.js):</strong> For website traffic analysis and usage statistics. Google Analytics may collect information about your device, browsing behavior, and interactions with our service. This data is subject to <a href="https://policies.google.com/privacy" className="text-[#FF6B35] hover:underline" target="_blank" rel="noopener noreferrer">Google's Privacy Policy</a>.</li>
            </ul>
            <p>
                We do NOT use advertising cookies or engage in behavioral profiling for marketing purposes.
            </p>

            <h3>3. How We Use Information</h3>
            <p><strong>Legal Basis for Processing:</strong></p>
            <ul>
                <li><strong>Contract Performance:</strong> Account management, domain registration, and DNS services</li>
                <li><strong>Legitimate Interest:</strong> Fraud prevention, abuse detection, and service security</li>
                <li><strong>Legal Obligation:</strong> Compliance with applicable laws and court orders</li>
            </ul>
            <p>
                We collect and use your information solely for:
            </p>
            <ul>
                <li>Processing subdomain requests and DNS management</li>
                <li>Maintaining platform security and preventing abuse</li>
                <li>Communicating about your account and service updates</li>
                <li>Complying with legal obligations and court orders</li>
                <li>Investigating violations of our policies</li>
            </ul>
            <p>
                We do not use your data for advertising, marketing, profiling, or commercial purposes. We do not sell, rent, or share your data with third parties for their commercial use.
            </p>

            <h3>4. Data Storage and Security</h3>
            <p>
                User data is stored in MongoDB databases hosted on secure cloud infrastructure (see Section 10 for server locations). We use industry-standard encryption and access controls to safeguard your information.
            </p>
            <p>
                <strong>Data Breach Notification:</strong> In the event of a data breach affecting your personal information, we will notify affected users via email within 72 hours of discovery where legally required, and provide information about the incident and remediation steps.
            </p>

            <h3>5. Data Retention</h3>
            <ul>
                <li><strong>Active Accounts:</strong> Data retained for as long as you actively use our service</li>
                <li><strong>Inactive/Deleted Accounts:</strong> User data is retained for 90 days after account deletion or last activity, then permanently erased without recovery options</li>
                <li><strong>Technical Logs:</strong> Automatically deleted within 30 days, except where longer retention is required by law or active investigations</li>
            </ul>
            <p>
                Once the 90-day retention period expires, data CANNOT be restored. We do not maintain backups of deleted user data beyond this period.
            </p>

            <h3>6. Data Sharing and Disclosure</h3>
            <p>
                We do not sell or rent personal information. We disclose data when:
            </p>
            <ul>
                <li>Required by Indian law, court orders, or government authorities</li>
                <li>Necessary to investigate abuse, fraud, or policy violations</li>
                <li>Required to protect Stackryze's legal rights and interests</li>
                <li>Shared with trusted service providers under confidentiality agreements</li>
            </ul>

            <h3>6.1. Third-Party Service Providers</h3>
            <p>
                We use the following services to operate our platform:
            </p>
            <ul>
                <li><strong>MongoDB Atlas:</strong> Database hosting</li>
                <li><strong>Oracle Cloud, DigitalOcean, Hetzner:</strong> Infrastructure and server hosting</li>
                <li><strong>Google Analytics:</strong> Website usage statistics</li>
                <li><strong>GitHub:</strong> OAuth authentication</li>
            </ul>
            <p>
                These providers have access to your data only as necessary to perform their functions.
            </p>

            <h3>7. Abuse Handling and Enforcement</h3>
            <p>
                We reserve the right to review user data and subdomains in response to:
            </p>
            <ul>
                <li>Verified abuse reports or legal complaints</li>
                <li>Suspected illegal activity or policy violations</li>
                <li>Law enforcement requests or court orders</li>
            </ul>
            <p>
                Stackryze may suspend or terminate services and share relevant data with authorities without prior notice when required by law or to prevent harm.
            </p>

            <h3>8. User Rights</h3>
            <p>
                All users, regardless of location, may request:
            </p>
            <ul>
                <li>Access to your personal data</li>
                <li>Correction of inaccurate information</li>
                <li>Deletion of your account and data</li>
            </ul>
            <p>
                These rights are subject to applicable Indian law and the legal requirements of your jurisdiction. Contact <a href="mailto:privacy@stackryze.com" className="text-[#FF6B35] hover:underline">privacy@stackryze.com</a> or <a href="mailto:support@stackryze.com" className="text-[#FF6B35] hover:underline">support@stackryze.com</a> to exercise these rights. Requests may require verification of account ownership before processing. Response time: 5–10 business days.
            </p>

            <h3>8.1. For European Union Users</h3>
            <p>
                EU residents have additional rights under GDPR:
            </p>
            <ul>
                <li>Right to data portability (receive your data in JSON format)</li>
                <li>Right to restrict processing</li>
                <li>Right to object to processing</li>
            </ul>
            <p>
                To exercise these rights, contact <a href="mailto:privacy@stackryze.com" className="text-[#FF6B35] hover:underline">privacy@stackryze.com</a>.
            </p>

            <h3>9. Children's Privacy</h3>
            <p>
                Our services are not directed at children under 13. We do not knowingly collect personal data from minors. If we discover such data, we will delete it immediately.
            </p>

            <h3>10. International Data Transfers</h3>
            <p>
                Our infrastructure includes servers in:
            </p>
            <ul>
                <li>India (Oracle Cloud Hyderabad, DigitalOcean Bangalore)</li>
                <li>Germany (Hetzner)</li>
            </ul>
            <p>
                Data is processed in these jurisdictions. By using our service, you consent to data transfer, storage, and processing in these regions. We implement appropriate safeguards including encryption in transit and at rest, and access controls.
            </p>

            <h3>11. Limitation of Liability for Data Incidents</h3>
            <p>
                While we implement industry-standard security measures, we cannot guarantee absolute protection against all threats. To the extent permitted by applicable law, Stackryze's liability for data incidents is limited to direct damages and does not include indirect, consequential, or punitive damages.
            </p>
            <p>
                This limitation does not apply where prohibited by law, including in cases of gross negligence or willful misconduct.
            </p>

            <h3>12. Governing Law and Jurisdiction</h3>
            <p>
                This Privacy Policy is governed by the laws of India. Any privacy-related disputes shall be resolved exclusively in the courts of Andhra Pradesh, India.
            </p>

            <h3>13. Policy Updates</h3>
            <p>
                We may update this Privacy Policy periodically. Significant changes will be announced via our website or email. Continued use after updates constitutes acceptance of the revised policy.
            </p>

            <h3>14. Contact Information</h3>
            <ul className="list-none pl-0 space-y-2">
                <li>Privacy Inquiries: <a href="mailto:privacy@stackryze.com" className="text-[#FF6B35] hover:underline">privacy@stackryze.com</a></li>
                <li>General Support: <a href="mailto:support@stackryze.com" className="text-[#FF6B35] hover:underline">support@stackryze.com</a></li>
                <li>Security Issues: <a href="mailto:security@stackryze.com" className="text-[#FF6B35] hover:underline">security@stackryze.com</a></li>
                <li>Abuse Reports: <a href="mailto:reportabuse@stackryze.com" className="text-[#FF6B35] hover:underline">reportabuse@stackryze.com</a></li>
            </ul>

            <h3>15. Acknowledgment</h3>
            <p>
                By using Stackryze Domains, you acknowledge that:
            </p>
            <ul>
                <li>You have read and understood this Privacy Policy</li>
                <li>You consent to the data collection and processing practices described above</li>
                <li>No absolute security guarantee exists for online platforms</li>
                <li>Indian law governs all data processing and privacy matters</li>
            </ul>
        </LegalLayout>
    );
}