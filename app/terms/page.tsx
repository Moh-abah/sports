import Header from "@/components/header"
import Footer from "@/components/footer"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | Live Sports Results - Terms and Conditions",
  description:
    "Read our terms of service to understand the rules and guidelines for using Live Sports Results platform and services.",
  keywords: "terms of service, terms and conditions, user agreement, live sports results terms",
}

export default function TermsPage() {
  const lastUpdated = "January 15, 2024"

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl opacity-90">
            Please read these terms and conditions carefully before using our service.
          </p>
          <p className="text-sm opacity-75 mt-4">Last updated: {lastUpdated}</p>
        </div>

      

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-300">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">1. Acceptance of Terms</h2>
            <p className="mb-6">
              By accessing and using Live Sports Results ("Service," "we," "us," or "our"), you accept and agree to be
              bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do
              not use this service.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">2. Description of Service</h2>
            <p className="mb-4">Live Sports Results is a web-based platform that provides:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Real-time sports scores and statistics</li>
              <li>Game schedules and results for major American sports leagues</li>
              <li>Team and player information</li>
              <li>Sports news and updates</li>
              <li>Historical sports data and records</li>
            </ul>
            <p className="mb-6">
              Our service covers Major League Baseball (MLB), National Basketball Association (NBA), National Football
              League (NFL), National Hockey League (NHL), and Major League Soccer (MLS).
            </p>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">3. User Responsibilities</h2>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">3.1 Acceptable Use</h3>
            <p className="mb-4">
              You agree to use our Service only for lawful purposes and in accordance with these Terms. You agree not
              to:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Use the Service for any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>
                Violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances
              </li>
              <li>
                Infringe upon or violate our intellectual property rights or the intellectual property rights of others
              </li>
              <li>Harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>Submit false or misleading information</li>
              <li>Upload or transmit viruses or any other type of malicious code</li>
              <li>Spam, phish, pharm, pretext, spider, crawl, or scrape</li>
              <li>Interfere with or circumvent the security features of the Service</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">3.2 Account Security</h3>
            <p className="mb-6">
              While our Service does not require account creation for basic use, if you choose to create an account or
              provide personal information, you are responsible for maintaining the confidentiality of any login
              credentials and for all activities that occur under your account.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">4. Intellectual Property Rights</h2>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">4.1 Our Content</h3>
            <p className="mb-4">
              The Service and its original content, features, and functionality are and will remain the exclusive
              property of Live Sports Results and its licensors. The Service is protected by copyright, trademark, and
              other laws. Our trademarks and trade dress may not be used in connection with any product or service
              without our prior written consent.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">4.2 Sports Data</h3>
            <p className="mb-4">
              Sports statistics, scores, and related data displayed on our Service are obtained from third-party data
              providers and are subject to their respective terms and conditions. We do not claim ownership of the
              underlying sports data, but we do own the compilation, presentation, and analysis of such data.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">4.3 User-Generated Content</h3>
            <p className="mb-6">
              If you submit any content to our Service (such as feedback, comments, or suggestions), you grant us a
              non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and distribute such content in
              connection with our Service.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">5. Privacy Policy</h2>
            <p className="mb-6">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the
              Service, to understand our practices regarding the collection and use of your information.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">6. Disclaimers and Limitations</h2>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">6.1 Service Availability</h3>
            <p className="mb-4">We strive to provide accurate and up-to-date information, but we cannot guarantee:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>The accuracy, completeness, or timeliness of any information</li>
              <li>Uninterrupted or error-free operation of the Service</li>
              <li>That defects will be corrected</li>
              <li>That the Service is free of viruses or other harmful components</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">6.2 Third-Party Content</h3>
            <p className="mb-6">
              Our Service may contain links to third-party websites or services that are not owned or controlled by Live
              Sports Results. We have no control over and assume no responsibility for the content, privacy policies, or
              practices of any third-party websites or services.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">6.3 Limitation of Liability</h3>
            <p className="mb-6">
              In no event shall Live Sports Results, its directors, employees, partners, agents, suppliers, or
              affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including
              without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your
              use of the Service.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              7. Advertising and Third-Party Services
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">7.1 Advertisements</h3>
            <p className="mb-4">
              Our Service is supported by advertising. By using our Service, you acknowledge and agree that:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>We may display advertisements and promotional content</li>
              <li>Advertisements may be targeted based on your interests and usage patterns</li>
              <li>We are not responsible for the content of third-party advertisements</li>
              <li>Your interactions with advertisers are solely between you and the advertiser</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">7.2 Google AdSense</h3>
            <p className="mb-6">
              We use Google AdSense to display advertisements. Google's use of advertising cookies enables it and its
              partners to serve ads based on your visits to our site and other sites on the Internet. You may opt out of
              personalized advertising by visiting Google's Ads Settings.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">8. Termination</h2>
            <p className="mb-6">
              We may terminate or suspend your access to our Service immediately, without prior notice or liability, for
              any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right
              to use the Service will cease immediately.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">9. Changes to Terms</h2>
            <p className="mb-6">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision
              is material, we will try to provide at least 30 days notice prior to any new terms taking effect. What
              constitutes a material change will be determined at our sole discretion.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">10. Governing Law</h2>
            <p className="mb-6">
              These Terms shall be interpreted and governed by the laws of the United States, without regard to its
              conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be
              considered a waiver of those rights.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">11. Severability</h2>
            <p className="mb-6">
              If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining
              provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us
              regarding our Service and supersede and replace any prior agreements.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">12. Contact Information</h2>
            <p className="mb-4">If you have any questions about these Terms of Service, please contact us:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Email: legal@livesportsresults.com</li>
              <li>Contact Form: Available on our Contact page</li>
              <li>Response Time: We typically respond within 48-72 hours</li>
            </ul>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-6 mt-8">
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Important Notice</h3>
              <p className="text-yellow-700 dark:text-yellow-400">
                By continuing to access or use our Service after any revisions become effective, you agree to be bound
                by the revised terms. If you do not agree to the new terms, please stop using the Service.
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-6 mt-6">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">Fair Use</h3>
              <p className="text-green-700 dark:text-green-400">
                We encourage fair use of our Service for personal, non-commercial purposes. For commercial use or data
                licensing opportunities, please contact us to discuss appropriate licensing arrangements.
              </p>
            </div>
          </div>
        </div>

      
      </main>

      <Footer />
    </div>
  )
}
