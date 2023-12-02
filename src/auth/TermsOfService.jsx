// TermsOfService.jsx
import React from 'react';
import './TermsOfService.scss'; // Import the stylesheet for styling
import { Link } from 'react-router-dom';

const TermsOfService = () => {
    return (
        <div className="terms-container">
            <h1>Terms of Service for Accordee Dashboard Creator</h1>
            <p className="last-updated">Last Updated: December 2, 2023</p>

            <h2>1. Acceptance of Terms</h2>
            <p>By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the service.</p>

            <h2>2. Description of Service</h2>
            <p>Accordee is a web-based dashboard creation tool designed to enable users to build and manage custom dashboards. Features include customizable layouts, user management, data integration capabilities, and more.</p>

            <h2>3. Beta Version Disclaimer</h2>
            <p>The service is currently in a beta/testing state. This means that the software is still under development and may contain bugs or errors. We do not guarantee that the service will be uninterrupted or error-free, and we are not liable for any data loss or damage arising from the use of the service. Your use of the service is at your own risk.</p>

            <h2>4. Account Registration and Use</h2>
            <p>To access certain features of the service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.</p>

            <h2>5. User Responsibilities</h2>
            <p>You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</p>

            <h2>6. Content Ownership and Responsibility</h2>
            <p>You retain ownership of any content that you submit or post to the service. However, by posting content to the service, you grant us the right to use, modify, publicly perform, publicly display, reproduce, and distribute such content on and through the service.</p>

            <h2>7. Prohibited Use</h2>
            <p>You agree not to use the service:
                <ul>
                    <li>For any unlawful purpose.</li>
                    <li>To solicit others to perform or participate in any unlawful acts.</li>
                    <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others.</li>
                </ul>
            </p>
            <h2>8. Limitation of Liability</h2>
            <p>In no event shall Accordee, its creator Erik Reiblein, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.</p>

            <h2>9. Changes</h2>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>

            <h2>10. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact me at <Link to="mailto:erik@accord.ee">erik@accord.ee</Link>.</p>

        </div>
    );
}

export default TermsOfService;
