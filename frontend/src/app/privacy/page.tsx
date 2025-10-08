'use client';

import Link from 'next/link';
import { Bot, ArrowLeft, Shield, Eye, Lock, Database } from 'lucide-react';

export default function PrivacyPage() {
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
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-300 mb-6">Last updated: December 2024</p>
          <p className="text-lg text-gray-300">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-invert prose-blue max-w-none">

            {/* Information We Collect */}
            <div className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <Eye className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Information We Collect</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <h3 className="text-xl font-semibold text-white">Personal Information</h3>
                <p>We collect information you provide directly to us, such as:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Name, email address, and contact information</li>
                  <li>Company information and job title</li>
                  <li>Account credentials and preferences</li>
                  <li>Payment and billing information</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mt-6">Usage Information</h3>
                <p>We automatically collect certain information when you use our service:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Voice recordings and transcriptions (when you use our service)</li>
                  <li>Log data, including IP addresses and browser information</li>
                  <li>Usage patterns and feature interactions</li>
                  <li>Device information and technical specifications</li>
                </ul>
              </div>
            </div>

            {/* How We Use Information */}
            <div className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <Database className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">How We Use Your Information</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide, maintain, and improve our AI agent services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send technical notices, updates, and support messages</li>
                  <li>Respond to your comments, questions, and customer service requests</li>
                  <li>Train and improve our AI models (with your consent)</li>
                  <li>Monitor usage and detect technical issues</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </div>

            {/* Data Security */}
            <div className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <Lock className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Data Security</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>We implement appropriate technical and organizational measures to protect your personal information:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>End-to-end encryption for all voice communications</li>
                  <li>SOC 2 Type II compliance and regular security audits</li>
                  <li>Multi-factor authentication and access controls</li>
                  <li>Regular security training for all employees</li>
                  <li>Data minimization and retention policies</li>
                </ul>
              </div>
            </div>

            {/* Information Sharing */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">Information Sharing</h2>
              <div className="space-y-4 text-gray-300">
                <p>We do not sell, trade, or rent your personal information. We may share information in these limited circumstances:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Service Providers:</strong> With trusted third parties who assist in operating our service</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
                </ul>
              </div>
            </div>

            {/* Your Rights */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
              <div className="space-y-4 text-gray-300">
                <p>You have the following rights regarding your personal information:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Access:</strong> Request copies of your personal information</li>
                  <li><strong>Rectification:</strong> Request correction of inaccurate information</li>
                  <li><strong>Erasure:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Request transfer of your data in a structured format</li>
                  <li><strong>Objection:</strong> Object to processing of your personal information</li>
                  <li><strong>Withdrawal:</strong> Withdraw consent at any time</li>
                </ul>
              </div>
            </div>

            {/* Data Retention */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">Data Retention</h2>
              <div className="space-y-4 text-gray-300">
                <p>We retain your information for as long as necessary to provide our services and fulfill legal obligations:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Account information: Until account deletion plus 30 days</li>
                  <li>Voice recordings: 90 days unless explicitly saved by user</li>
                  <li>Usage logs: 2 years for security and analytics purposes</li>
                  <li>Financial records: 7 years as required by law</li>
                </ul>
              </div>
            </div>

            {/* International Transfers */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">International Transfers</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  Your information may be transferred to and processed in countries other than your own.
                  We ensure appropriate safeguards are in place through:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Standard Contractual Clauses approved by regulatory authorities</li>
                  <li>Adequacy decisions for data protection</li>
                  <li>Certification under recognized privacy frameworks</li>
                </ul>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-12 bg-gray-800 p-6 rounded-xl border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <div className="text-gray-300">
                <p className="mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <ul className="space-y-2">
                  <li><strong>Email:</strong> privacy@echopersona.com</li>
                  <li><strong>Address:</strong> 123 Innovation Drive, San Francisco, CA 94105</li>
                  <li><strong>Phone:</strong> +1 (555) 123-4567</li>
                </ul>
              </div>
            </div>

            {/* Updates */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">Policy Updates</h2>
              <div className="text-gray-300">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any material
                  changes by posting the new policy on this page and updating the "Last updated" date.
                  We encourage you to review this policy periodically.
                </p>
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
