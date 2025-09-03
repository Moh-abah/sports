import Header from "@/components/header"
import Footer from "@/components/footer"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Live Sports Results - Your Privacy Matters",
  description:
    "Read our comprehensive privacy policy to understand how Live Sports Results collects, uses, and protects your personal information.",
  keywords: "privacy policy, data protection, user privacy, live sports results privacy",
}

export default function PrivacyPage() {
  const lastUpdated = "January 15, 2024"

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl opacity-90">
            Your privacy is important to us. Learn how we collect, use, and protect your information.
          </p>
          <p className="text-sm opacity-75 mt-4">Last updated: {lastUpdated}</p>
        </div>

       

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-300">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">1. Introduction</h2>
            <p className="mb-6">
              Welcome to Live Sports Results ("we," "our," or "us"). This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you visit our website livesportsresults.vercel.app (the
              "Service"). Please read this privacy policy carefully. If you do not agree with the terms of this privacy
              policy, please do not access the site.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">2.1 Information You Provide</h3>
            <p className="mb-4">We may collect information that you voluntarily provide to us when you:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Contact us through our contact form</li>
              <li>Subscribe to our newsletter or updates</li>
              <li>Participate in surveys or feedback forms</li>
              <li>Report bugs or technical issues</li>
              <li>Request customer support</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              2.2 Automatically Collected Information
            </h3>
            <p className="mb-4">
              When you visit our Service, we may automatically collect certain information about your device and usage
              patterns, including:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>IP address and general location information</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages visited and time spent on pages</li>
              <li>Referring website addresses</li>
              <li>Device identifiers and characteristics</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              2.3 Cookies and Tracking Technologies
            </h3>
            <p className="mb-6">
              We use cookies, web beacons, and similar tracking technologies to enhance your experience on our Service.
              These technologies help us understand user behavior, remember preferences, and provide personalized
              content and advertisements.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">3. How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect for various purposes, including:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Providing and maintaining our Service</li>
              <li>Improving user experience and Service functionality</li>
              <li>Responding to your inquiries and providing customer support</li>
              <li>Sending administrative information and updates</li>
              <li>Analyzing usage patterns and trends</li>
              <li>Detecting and preventing fraud or abuse</li>
              <li>Complying with legal obligations</li>
              <li>Displaying relevant advertisements</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              4. Information Sharing and Disclosure
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              4.1 Third-Party Service Providers
            </h3>
            <p className="mb-4">
              We may share your information with trusted third-party service providers who assist us in operating our
              Service, including:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Web hosting and cloud storage providers</li>
              <li>Analytics services (such as Google Analytics)</li>
              <li>Advertising networks and partners</li>
              <li>Customer support platforms</li>
              <li>Email service providers</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">4.2 Legal Requirements</h3>
            <p className="mb-6">
              We may disclose your information if required to do so by law or in response to valid requests by public
              authorities, such as a court order or government agency.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">4.3 Business Transfers</h3>
            <p className="mb-6">
              In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of
              the business transaction.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">5. Data Security</h2>
            <p className="mb-6">
              We implement appropriate technical and organizational security measures to protect your personal
              information against unauthorized access, alteration, disclosure, or destruction. However, no method of
              transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute
              security.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">6. Your Privacy Rights</h2>
            <p className="mb-4">
              Depending on your location, you may have the following rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Right to access your personal information</li>
              <li>Right to correct inaccurate information</li>
              <li>Right to delete your personal information</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
              <li>Right to withdraw consent</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">7. Cookies Policy</h2>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">7.1 What Are Cookies</h3>
            <p className="mb-4">
              Cookies are small text files stored on your device when you visit our website. They help us provide a
              better user experience by remembering your preferences and analyzing site usage.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">7.2 Types of Cookies We Use</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>
                <strong>Essential Cookies:</strong> Necessary for the website to function properly
              </li>
              <li>
                <strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website
              </li>
              <li>
                <strong>Advertising Cookies:</strong> Used to display relevant advertisements
              </li>
              <li>
                <strong>Preference Cookies:</strong> Remember your settings and preferences
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">7.3 Managing Cookies</h3>
            <p className="mb-6">
              You can control and manage cookies through your browser settings. However, disabling certain cookies may
              affect the functionality of our Service.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">8. Third-Party Links</h2>
            <p className="mb-6">
              Our Service may contain links to third-party websites. We are not responsible for the privacy practices or
              content of these external sites. We encourage you to review the privacy policies of any third-party sites
              you visit.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">9. Children's Privacy</h2>
            <p className="mb-6">
              Our Service is not intended for children under the age of 13. We do not knowingly collect personal
              information from children under 13. If we become aware that we have collected personal information from a
              child under 13, we will take steps to delete such information.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">10. International Data Transfers</h2>
            <p className="mb-6">
              Your information may be transferred to and processed in countries other than your own. We ensure that such
              transfers comply with applicable data protection laws and implement appropriate safeguards to protect your
              information.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">11. Data Retention</h2>
            <p className="mb-6">
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this
              Privacy Policy, unless a longer retention period is required or permitted by law.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              12. Changes to This Privacy Policy
            </h2>
            <p className="mb-6">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy
              Policy periodically for any changes.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">13. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Email: privacy@livesportsresults.com</li>
              <li>Contact Form: Available on our Contact page</li>
              <li>Response Time: We typically respond within 48 hours</li>
            </ul>

            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-6 mt-8">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">Your Privacy Matters</h3>
              <p className="text-blue-700 dark:text-blue-400">
                We are committed to protecting your privacy and being transparent about our data practices. If you have
                any concerns or questions about how we handle your information, please don't hesitate to reach out to
                us.
              </p>
            </div>
          </div>
        </div>

        
      </main>

      <Footer />
    </div>
  )
}
