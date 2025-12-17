import { LegalLayout } from "@/layouts/LegalLayout";

export function Terms() {
    return (
        <LegalLayout title="Terms of Service" date="December 11 2025">
            <p className="lead">
                Welcome to <strong>Indevs.in</strong> (“we”, “our”, or “the Platform”), a student-operated public-interest project offering free subdomain registration for developers and learners worldwide.
            </p>
            <p>
                By using this service, you agree to comply with these Terms of Service (“Terms”). If you do not accept any part of these terms, you must discontinue use of our platform.
            </p>

            <h3>1. Purpose & Community Commitment</h3>
            <p>
                Indevs.in operates under a non-commercial, educational model. Our mission is to empower students, developers, and independent creators by offering a free and open subdomain service under .indevs.in.
            </p>
            <p>
                The platform is maintained voluntarily by students and operates on a best-effort basis meaning service reliability, availability, and response times may vary.
            </p>

            <h3>2. Service Availability & Disclaimer</h3>
            <p>
                We do not guarantee uptime, DNS propagation, or uninterrupted service. Your subdomain may be affected by factors beyond our control, such as:
            </p>
            <ul>
                <li>DNS registry issues or policy changes</li>
                <li>Abuse complaints or takedown requests</li>
                <li>Inclusion or removal from the Public Suffix List (PSL)</li>
                <li>Technical maintenance or server outages</li>
            </ul>
            <p>
                The service is provided <strong>“AS IS”</strong> and <strong>“AS AVAILABLE”</strong>, without warranties of any kind. Indevs.in and its maintainers are not liable for data loss, downtime, or indirect damages.
            </p>

            <h3>3. User Responsibility</h3>
            <p>
                You are fully responsible for all content and activity associated with your subdomain, including:
            </p>
            <ul>
                <li>Ensuring hosted content complies with local and international law</li>
                <li>Responding to abuse or policy inquiries promptly</li>
                <li>Avoiding impersonation, fraud, or misuse</li>
                <li>Keeping your contact information accurate and up to date</li>
            </ul>
            <p>
                You are expected to maintain control and security of your domain and any linked content.
            </p>

            <h3>4. Acceptable Use</h3>
            <p>
                We reserve the right to deny, suspend, or delete subdomains that violate our <strong>Acceptable Use Policy</strong>, including:
            </p>
            <ul>
                <li>Hosting malware, phishing, or scam content</li>
                <li>Engaging in impersonation or trademark abuse</li>
                <li>Hosting illegal, violent, or adult content</li>
                <li>Misusing system resources or automating registrations</li>
                <li>Reverse-proxying third-party services or mimicking brands</li>
            </ul>
            <p>
                Violations may result in immediate removal without prior notice.
            </p>

            <h3>5. Review & Verification</h3>
            <p>
                To preserve platform integrity, subdomain requests may undergo manual or automated review. We may reject, delay, or suspend requests that appear suspicious, misleading, or abusive.
            </p>
            <p>
                We do not charge any fees and do not collect payment information.
            </p>

            <h3>6. Suspension & Abuse Handling</h3>
            <p>
                We strive to contact users before taking enforcement action but may suspend or revoke subdomains immediately when:
            </p>
            <ul>
                <li>Serious abuse or harm is detected</li>
                <li>Abuse reports are verified</li>
                <li>Contact attempts fail</li>
                <li>Technical or legal intervention is required</li>
            </ul>
            <p>
                Failure to respond to abuse notices may lead to permanent suspension.
            </p>

            <h3>7. Privacy & Data</h3>
            <p>
                Indevs.in collects minimal personal data — typically just an email address, IP logs, and DNS configuration details — strictly for operational and abuse-prevention purposes.
            </p>
            <p>
                We do not sell, share, or monetize user data. All personal information is handled according to our <a href="/privacy" className="text-[#FF6B35] hover:underline">Privacy Policy</a>.
            </p>

            <h3>8. Governing Law</h3>
            <p>
                These Terms are governed by the laws of India. You agree that any disputes shall be resolved under the jurisdiction of the courts located in <strong>Andhra Pradesh, India</strong>.
            </p>

            <h3>9. Contact</h3>
            <ul className="list-none pl-0 space-y-2">
                <li> Support: <a href="mailto:support@admin.indevs.in" className="text-[#FF6B35] hover:underline">support@admin.indevs.in</a></li>
                <li> Abuse Reports: <a href="mailto:reportabuse@admin.indevs.in" className="text-[#FF6B35] hover:underline">reportabuse@admin.indevs.in</a></li>
                <li> Legal Inquiries: <a href="mailto:legal@admin.indevs.in" className="text-[#FF6B35] hover:underline">legal@admin.indevs.in</a></li>
            </ul>
            <p>
                We aim to respond within 5–7 business days, subject to volunteer availability.
            </p>

            <h3>10. Acknowledgment</h3>
            <p>
                By continuing to use Indevs.in, you acknowledge that:
            </p>
            <ul>
                <li>The service is free and operated by students</li>
                <li>There are no guarantees of uptime or data permanence</li>
                <li>You are responsible for the content and behavior associated with your subdomain</li>
                <li>Your subdomain may be suspended or removed if it violates policies or laws</li>
            </ul>
            <p className="font-bold mt-8">
                Thank you for supporting an open and developer-friendly web.
            </p>
        </LegalLayout>
    );
}
