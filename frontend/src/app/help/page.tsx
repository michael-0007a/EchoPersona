'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Bot,
  ArrowLeft,
  Search,
  Book,
  MessageSquare,
  Settings,
  Upload,
  Mic,
  Users,
  ChevronDown,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>('getting-started');

  const helpSections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Book,
      articles: [
        'Creating your first AI agent',
        'Uploading knowledge base documents',
        'Setting up voice preferences',
        'Testing your agent'
      ]
    },
    {
      id: 'voice-chat',
      title: 'Voice Chat',
      icon: Mic,
      articles: [
        'How to start a voice conversation',
        'Improving speech recognition accuracy',
        'Managing audio settings',
        'Troubleshooting microphone issues'
      ]
    },
    {
      id: 'agents',
      title: 'Agent Management',
      icon: Bot,
      articles: [
        'Creating different agent types',
        'Customizing agent personalities',
        'Managing multiple agents',
        'Agent performance optimization'
      ]
    },
    {
      id: 'documents',
      title: 'Knowledge Base',
      icon: Upload,
      articles: [
        'Supported file formats',
        'Organizing documents with categories',
        'Best practices for document preparation',
        'Updating and managing content'
      ]
    },
    {
      id: 'account',
      title: 'Account & Billing',
      icon: Settings,
      articles: [
        'Managing your subscription',
        'Understanding usage limits',
        'Billing and payment options',
        'Account security settings'
      ]
    }
  ];

  const quickLinks = [
    {
      title: 'API Documentation',
      description: 'Integrate EchoPersona with your applications',
      icon: ExternalLink,
      href: '/docs'
    },
    {
      title: 'Community Forum',
      description: 'Connect with other users and share tips',
      icon: Users,
      href: '/community'
    },
    {
      title: 'Contact Support',
      description: 'Get help from our support team',
      icon: MessageSquare,
      href: '/contact'
    }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <div className="min-h-screen bg-charcoal text-white">
      {/* Navigation */}
      <nav className="bg-charcoal-light/20 backdrop-blur-md border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center glow-blue pulse-glow">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white text-glow">EchoPersona</span>
            </Link>
            <Link
              href="/"
              className="flex items-center space-x-2 text-blue-200 hover:text-blue-100 transition-colors hover:text-glow"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="float-animation">
            <h1 className="text-4xl font-bold text-white mb-4 text-glow">
              Help <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 text-glow-purple">Center</span>
            </h1>
          </div>
          <p className="text-xl text-blue-200 mb-8">
            Find answers, guides, and resources to help you get the most out of EchoPersona
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-charcoal-light/30 backdrop-blur-sm border border-blue-500/30 rounded-lg text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent glow-card"
            />
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center text-glow">Quick Links</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="bg-charcoal-light/30 backdrop-blur-sm p-6 rounded-xl border border-blue-500/20 hover:border-blue-400 glow-card group float-animation"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <link.icon className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
                  <h3 className="text-lg font-semibold text-white text-glow">{link.title}</h3>
                </div>
                <p className="text-blue-300 group-hover:text-blue-200 transition-colors">{link.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Help Sections */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center text-glow">Browse by Category</h2>

          <div className="space-y-4">
            {helpSections.map((section, sectionIndex) => {
              const Icon = section.icon;
              const isExpanded = expandedSection === section.id;

              return (
                <div key={section.id} className="bg-charcoal-light/30 backdrop-blur-sm rounded-xl border border-blue-500/20 overflow-hidden glow-card float-animation"
                     style={{ animationDelay: `${sectionIndex * 0.1}s` }}>
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-charcoal-light/50 transition-all group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center glow-blue group-hover:glow-purple transition-all">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white text-glow">{section.title}</h3>
                        <p className="text-blue-300">{section.articles.length} articles</p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-blue-300 group-hover:text-blue-200 transition-all transform group-hover:scale-110" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-blue-300 group-hover:text-blue-200 transition-all transform group-hover:scale-110" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-6">
                      <div className="border-t border-blue-500/20 pt-4">
                        <ul className="space-y-3">
                          {section.articles.map((article, index) => (
                            <li key={index}>
                              <Link
                                href={`/help/${section.id}/${article.toLowerCase().replace(/\s+/g, '-')}`}
                                className="block text-blue-200 hover:text-blue-100 transition-colors py-2 hover:text-glow transform hover:translate-x-2 duration-200"
                              >
                                {article}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center text-glow">Frequently Asked Questions</h2>

          <div className="space-y-6">
            {[
              {
                question: "How do I get started with EchoPersona?",
                answer: "Sign up for a free account, upload your knowledge base documents, create your first AI agent, and start testing conversations. The entire process takes less than 15 minutes."
              },
              {
                question: "What file formats are supported for the knowledge base?",
                answer: "We support PDF, DOCX, and TXT files. Our system automatically extracts and processes text from these formats to train your AI agents."
              },
              {
                question: "Can I customize my AI agent's personality?",
                answer: "Yes! You can customize your agent's greeting, communication style, empathy level, response length, and expertise focus to match your brand and customer needs."
              },
              {
                question: "How does the speech-to-speech feature work?",
                answer: "Our system converts your speech to text, processes it through your AI agent, generates a response, and converts it back to speech. The entire process typically takes less than 3 seconds."
              },
              {
                question: "Is there a limit on conversation length?",
                answer: "Conversation length depends on your plan. Starter plans include 1,000 conversations per month, while Enterprise plans offer unlimited conversations."
              },
              {
                question: "How secure is my data?",
                answer: "We use end-to-end encryption, SOC 2 Type II compliance, and follow strict data retention policies. Your data is never shared with third parties without your consent."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-charcoal-light/30 backdrop-blur-sm p-6 rounded-xl border border-blue-500/20 glow-card float-animation"
                   style={{ animationDelay: `${index * 0.1}s` }}>
                <h3 className="text-lg font-semibold text-white mb-3 text-glow">{faq.question}</h3>
                <p className="text-blue-200">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-charcoal-light/20 backdrop-blur-sm p-12 rounded-2xl border border-blue-500/20 glow-card">
            <h2 className="text-3xl font-bold text-white mb-4 text-glow">Still Need Help?</h2>
            <p className="text-xl text-blue-200 mb-8">
              Our support team is here to help you succeed with EchoPersona
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all btn-glow glow-blue transform hover:scale-105"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Contact Support</span>
              </Link>
              <button className="inline-flex items-center justify-center space-x-2 border border-blue-500/50 hover:border-blue-400 text-blue-200 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all glow-card shimmer">
                <Bot className="w-5 h-5" />
                <span>Chat with AI Assistant</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-charcoal/80 backdrop-blur-sm border-t border-blue-500/20 py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center glow-blue">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white text-glow">EchoPersona</span>
          </div>
          <p className="text-blue-300">&copy; 2024 EchoPersona. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
