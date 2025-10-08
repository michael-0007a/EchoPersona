'use client';

import Link from 'next/link';
import { Bot, ArrowLeft, FileText, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">EchoPersona</span>
            </Link>
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-gray-300 mb-6">Last updated: December 2024</p>
          <p className="text-lg text-gray-300">
            Please read these terms carefully before using our service.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-invert prose-blue max-w-none">

            {/* Acceptance of Terms */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  By accessing and using EchoPersona's services, you accept and agree to be bound by these Terms of Service.
                  If you do not agree to these terms, you may not use our services.
                </p>
                <p>
                  These terms apply to all users of the service, including without limitation users who are browsers,
                  vendors, customers, merchants, and contributors of content.
                </p>
              </div>
            </div>

            {/* Service Description */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">2. Service Description</h2>
              <div className="space-y-4 text-gray-300">
                <p>EchoPersona provides AI-powered voice agent services that include:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Speech-to-speech AI agents for customer service</li>
                  <li>Document-based knowledge base integration</li>
                  <li>Multi-agent management platform</li>
                  <li>Voice processing and natural language understanding</li>
                  <li>Analytics and conversation insights</li>
                </ul>
              </div>
            </div>

            {/* User Accounts */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts</h2>
              <div className="space-y-4 text-gray-300">
                <p>To use our service, you must:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate and complete registration information</li>
                  <li>Maintain the security of your password and account</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                </ul>
              </div>
            </div>

            {/* Acceptable Use */}
            <div className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-bold text-white">4. Acceptable Use</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>You agree to use our service only for lawful purposes and in accordance with these terms. You agree NOT to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use the service for any illegal or unauthorized purpose</li>
                  <li>Transmit harmful, threatening, or abusive content</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt the service or servers</li>
                  <li>Use the service to spam or send unsolicited communications</li>
                  <li>Violate any applicable laws or regulations</li>
                </ul>
              </div>
            </div>

            {/* Content and Data */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">5. Content and Data</h2>
              <div className="space-y-4 text-gray-300">
                <h3 className="text-xl font-semibold text-white">Your Content</h3>
                <p>You retain ownership of content you upload to our service. By uploading content, you grant us:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>License to use, process, and store your content to provide the service</li>
                  <li>Right to use anonymized data for service improvement</li>
                  <li>Permission to backup and secure your content</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mt-6">Our Content</h3>
                <p>Our service and its original content, features, and functionality are owned by EchoPersona and are protected by copyright, trademark, and other laws.</p>
              </div>
            </div>

            {/* Payment Terms */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">6. Payment Terms</h2>
              <div className="space-y-4 text-gray-300">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Fees are charged in advance on a monthly or annual basis</li>
                  <li>All fees are non-refundable except as required by law</li>
                  <li>We may change our fees with 30 days' notice</li>
                  <li>Failure to pay may result in service suspension</li>
                  <li>You're responsible for all taxes and additional fees</li>
                </ul>
              </div>
            </div>

            {/* Service Availability */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">7. Service Availability</h2>
              <div className="space-y-4 text-gray-300">
                <p>We strive to maintain high service availability, but we do not guarantee:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Uninterrupted or error-free service</li>
                  <li>That the service will meet your specific requirements</li>
                  <li>That defects will be corrected immediately</li>
                </ul>
                <p>We reserve the right to modify or discontinue the service with reasonable notice.</p>
              </div>
            </div>

            {/* Limitation of Liability */}
            <div className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
                <h2 className="text-2xl font-bold text-white">8. Limitation of Liability</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>
                  To the maximum extent permitted by law, EchoPersona shall not be liable for any indirect,
                  incidental, special, consequential, or punitive damages, including without limitation,
                  loss of profits, data, use, goodwill, or other intangible losses.
                </p>
                <p>
                  Our total liability to you for any claim arising from these terms or the service
                  shall not exceed the amount you paid us in the 12 months preceding the claim.
                </p>
              </div>
            </div>

            {/* Indemnification */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">9. Indemnification</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  You agree to indemnify and hold harmless EchoPersona from any claims, damages,
                  obligations, losses, liabilities, costs, or debt arising from:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your use of the service</li>
                  <li>Your violation of these terms</li>
                  <li>Your violation of any third-party rights</li>
                  <li>Any content you submit through the service</li>
                </ul>
              </div>
            </div>

            {/* Termination */}
            <div className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <XCircle className="w-6 h-6 text-red-400" />
                <h2 className="text-2xl font-bold text-white">10. Termination</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>We may terminate or suspend your account and access to the service immediately, without prior notice, for:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Breach of these terms</li>
                  <li>Non-payment of fees</li>
                  <li>Illegal or harmful use of the service</li>
                  <li>At our sole discretion for any reason</li>
                </ul>
                <p>Upon termination, your right to use the service will cease immediately.</p>
              </div>
            </div>

            {/* Governing Law */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">11. Governing Law</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  These terms shall be governed by and construed in accordance with the laws of the State of California,
                  without regard to its conflict of law provisions.
                </p>
                <p>
                  Any disputes arising from these terms or the service shall be resolved in the courts of San Francisco County, California.
                </p>
              </div>
            </div>

            {/* Changes to Terms */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">12. Changes to Terms</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  We reserve the right to modify these terms at any time. We will provide notice of material changes
                  by posting the updated terms on our website and updating the "Last updated" date.
                </p>
                <p>
                  Your continued use of the service after changes become effective constitutes acceptance of the new terms.
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-12 bg-gray-800 p-6 rounded-xl border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
              <div className="text-gray-300">
                <p className="mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <ul className="space-y-2">
                  <li><strong>Email:</strong> legal@echopersona.com</li>
                  <li><strong>Address:</strong> 123 Innovation Drive, San Francisco, CA 94105</li>
                  <li><strong>Phone:</strong> +1 (555) 123-4567</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">EchoPersona</span>
          </div>
          <p className="text-gray-400">&copy; 2024 EchoPersona. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
