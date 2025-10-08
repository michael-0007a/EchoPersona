'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Bot,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Clock,
  Globe
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    setSubmitted(true);
    setIsSubmitting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-charcoal text-white flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 glow-green pulse-glow">
            <Send className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4 text-glow">Message Sent!</h2>
          <p className="text-blue-200 mb-6">
            Thank you for reaching out. We'll get back to you within 24 hours.
          </p>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all btn-glow glow-blue transform hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    );
  }

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
            <h1 className="text-5xl font-bold text-white mb-6 text-glow">
              Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 text-glow-purple">Touch</span>
            </h1>
          </div>
          <p className="text-xl text-blue-200 mb-8">
            Ready to transform your customer service? We'd love to hear from you.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative z-10">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-white mb-8 text-glow">Contact Information</h2>

            <div className="space-y-6">
              <div className="flex items-start space-x-4 float-animation">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 glow-blue">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1 text-glow">Email Us</h3>
                  <p className="text-blue-200">hello@echopersona.com</p>
                  <p className="text-blue-200">support@echopersona.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 float-animation" style={{ animationDelay: '0.1s' }}>
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 glow-purple">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1 text-glow">Call Us</h3>
                  <p className="text-blue-200">+1 (555) 123-4567</p>
                  <p className="text-blue-300 text-sm">Mon-Fri, 9AM-6PM PST</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 float-animation" style={{ animationDelay: '0.2s' }}>
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0 glow-green">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1 text-glow">Visit Us</h3>
                  <p className="text-blue-200">123 Innovation Drive</p>
                  <p className="text-blue-200">San Francisco, CA 94105</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 float-animation" style={{ animationDelay: '0.3s' }}>
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0 glow-orange">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1 text-glow">Live Chat</h3>
                  <p className="text-blue-200">Available 24/7 on our website</p>
                  <p className="text-blue-300 text-sm">Average response: 2 minutes</p>
                </div>
              </div>
            </div>

            {/* Office Hours */}
            <div className="mt-12 bg-charcoal-light/30 backdrop-blur-sm p-6 rounded-xl border border-blue-500/20 glow-card">
              <h3 className="text-white font-semibold mb-4 flex items-center text-glow">
                <Clock className="w-5 h-5 mr-2" />
                Office Hours
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-200">Monday - Friday</span>
                  <span className="text-white">9:00 AM - 6:00 PM PST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Saturday</span>
                  <span className="text-white">10:00 AM - 4:00 PM PST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Sunday</span>
                  <span className="text-blue-300">Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-charcoal-light/30 backdrop-blur-sm p-8 rounded-xl border border-blue-500/20 glow-card">
              <h2 className="text-2xl font-bold text-white mb-6 text-glow">Send us a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-charcoal-light/50 border border-blue-500/30 rounded-lg text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-charcoal-light/50 border border-blue-500/30 rounded-lg text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-charcoal-light/50 border border-blue-500/30 rounded-lg text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                      placeholder="Your company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-charcoal-light/50 border border-blue-500/30 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    >
                      <option value="">Select a subject</option>
                      <option value="sales">Sales Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership</option>
                      <option value="demo">Request Demo</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-charcoal-light/50 border border-blue-500/30 rounded-lg text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    placeholder="Tell us about your project and how we can help..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 btn-glow glow-blue transform hover:scale-105"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-charcoal-light/20 backdrop-blur-sm relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center text-glow">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                question: "How quickly can I get started with EchoPersona?",
                answer: "You can have your first AI agent up and running in under 15 minutes. Simply sign up, upload your knowledge base documents, and configure your agent's personality."
              },
              {
                question: "What file formats do you support for knowledge base?",
                answer: "We support PDF, DOCX, and TXT files. Our system can extract and process text from these formats to train your AI agents."
              },
              {
                question: "Is there a free trial available?",
                answer: "Yes! We offer a 14-day free trial with full access to all features. No credit card required to get started."
              },
              {
                question: "How does pricing work?",
                answer: "Our pricing is based on the number of conversations per month and the number of AI agents. We offer flexible plans from starter to enterprise level."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-charcoal-light/30 backdrop-blur-sm p-6 rounded-xl border border-blue-500/20 glow-card float-animation"
                   style={{ animationDelay: `${index * 0.1}s` }}>
                <h3 className="text-white font-semibold mb-3 text-glow">{faq.question}</h3>
                <p className="text-blue-200">{faq.answer}</p>
              </div>
            ))}
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
