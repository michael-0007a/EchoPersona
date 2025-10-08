'use client';

import Link from 'next/link';
import {
  Bot,
  ArrowRight,
  Phone,
  MessageSquare,
  Brain,
  Shield,
  Zap,
  Users,
  Star,
  CheckCircle,
  PlayCircle
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen space-bg">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-charcoal-light/20 backdrop-blur-md border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center glow-blue pulse-glow">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white text-glow">EchoPersona</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-blue-200 hover:text-blue-100 transition-colors hover:text-glow">
                Features
              </Link>
              <Link href="#pricing" className="text-blue-200 hover:text-blue-100 transition-colors hover:text-glow">
                Pricing
              </Link>
              <Link href="/about" className="text-blue-200 hover:text-blue-100 transition-colors hover:text-glow">
                About
              </Link>
              <Link href="/contact" className="text-blue-200 hover:text-blue-100 transition-colors hover:text-glow">
                Contact
              </Link>
              <Link
                href="/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all btn-glow glow-blue"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8 float-animation">
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 text-blue-300 text-sm glow-card">
              <Zap className="w-4 h-4" />
              <span>Revolutionary AI Customer Service</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Replace Customer Service
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 text-glow-purple">
              with AI Agents
            </span>
          </h1>

          <p className="text-xl text-blue-200 mb-10 max-w-3xl mx-auto">
            Transform your customer service with intelligent AI agents that provide natural,
            voice-to-voice conversations powered by your company's knowledge base.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all btn-glow glow-blue transform hover:scale-105"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="inline-flex items-center justify-center space-x-2 border border-blue-500/50 hover:border-blue-400 text-blue-200 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all glow-card shimmer">
              <PlayCircle className="w-5 h-5" />
              <span>Watch Demo</span>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 text-glow">
              Why Choose EchoPersona?
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Our AI agents provide human-like customer service experiences that scale infinitely
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: MessageSquare,
                title: "Natural Conversations",
                description: "Voice-to-voice communication that feels completely natural and human-like",
                delay: "0s"
              },
              {
                icon: Brain,
                title: "Smart Knowledge Base",
                description: "AI agents trained on your company documents and policies for accurate responses",
                delay: "0.1s"
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "Bank-level security with encrypted communications and data protection",
                delay: "0.2s"
              },
              {
                icon: Zap,
                title: "Instant Deployment",
                description: "Get your AI agents up and running in minutes, not months",
                delay: "0.3s"
              },
              {
                icon: Users,
                title: "Multi-Agent Support",
                description: "Create specialized agents for sales, support, healthcare, and more",
                delay: "0.4s"
              },
              {
                icon: Phone,
                title: "24/7 Availability",
                description: "Never miss a customer call with AI agents that work around the clock",
                delay: "0.5s"
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-charcoal-light/30 backdrop-blur-sm p-6 rounded-xl border border-blue-500/20 glow-card float-animation"
                style={{ animationDelay: feature.delay }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 glow-blue">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 text-glow">{feature.title}</h3>
                <p className="text-blue-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { number: "99.9%", label: "Uptime Guarantee" },
              { number: "< 200ms", label: "Response Time" },
              { number: "50+", label: "Languages Supported" }
            ].map((stat, index) => (
              <div key={index} className="glow-card bg-charcoal-light/20 backdrop-blur-sm p-8 rounded-xl border border-blue-500/20">
                <div className="text-4xl font-bold text-blue-300 mb-2 text-glow">{stat.number}</div>
                <div className="text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 text-glow">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-blue-200">
              Choose the plan that fits your business needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "$99",
                period: "/month",
                description: "Perfect for small businesses",
                features: [
                  "1 AI Agent",
                  "1,000 conversations/month",
                  "Basic knowledge base",
                  "Email support"
                ],
                popular: false
              },
              {
                name: "Professional",
                price: "$299",
                period: "/month",
                description: "For growing companies",
                features: [
                  "5 AI Agents",
                  "10,000 conversations/month",
                  "Advanced knowledge base",
                  "Priority support",
                  "Custom personalities"
                ],
                popular: true
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "",
                description: "For large organizations",
                features: [
                  "Unlimited AI Agents",
                  "Unlimited conversations",
                  "Advanced analytics",
                  "24/7 dedicated support",
                  "Custom integrations"
                ],
                popular: false
              }
            ].map((plan, index) => (
              <div key={index} className={`relative bg-charcoal-light/30 backdrop-blur-sm p-8 rounded-xl border transition-all glow-card ${
                plan.popular 
                  ? 'border-blue-400 glow-blue pulse-glow transform scale-105' 
                  : 'border-blue-500/20'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold glow-blue">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2 text-glow">{plan.name}</h3>
                  <div className="text-4xl font-bold text-blue-300 text-glow">
                    {plan.price}
                    <span className="text-lg text-blue-200">{plan.period}</span>
                  </div>
                  <p className="text-blue-200 mt-2">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-blue-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-lg font-semibold transition-all btn-glow ${
                  plan.popular
                    ? 'bg-blue-600 hover:bg-blue-700 text-white glow-blue'
                    : 'border border-blue-500/50 hover:border-blue-400 text-blue-200 hover:text-white glow-card'
                }`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-charcoal-light/20 backdrop-blur-sm p-12 rounded-2xl border border-blue-500/20 glow-card">
            <h2 className="text-4xl font-bold text-white mb-4 text-glow">
              Ready to Transform Your Customer Service?
            </h2>
            <p className="text-xl text-blue-200 mb-8">
              Join thousands of companies already using EchoPersona to deliver exceptional customer experiences
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all btn-glow glow-blue transform hover:scale-105"
            >
              <span>Start Your Free Trial</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-charcoal/80 backdrop-blur-sm border-t border-blue-500/20 py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center glow-blue">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white text-glow">EchoPersona</span>
              </div>
              <p className="text-blue-300">
                Revolutionizing customer service with AI-powered voice agents.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-glow">Product</h4>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-blue-200 hover:text-blue-100 transition-colors hover:text-glow">Features</Link></li>
                <li><Link href="#pricing" className="text-blue-200 hover:text-blue-100 transition-colors hover:text-glow">Pricing</Link></li>
                <li><Link href="/dashboard" className="text-blue-200 hover:text-blue-100 transition-colors hover:text-glow">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-glow">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-blue-200 hover:text-blue-100 transition-colors hover:text-glow">About</Link></li>
                <li><Link href="/contact" className="text-blue-200 hover:text-blue-100 transition-colors hover:text-glow">Contact</Link></li>
                <li><Link href="/privacy" className="text-blue-200 hover:text-blue-100 transition-colors hover:text-glow">Privacy</Link></li>
                <li><Link href="/terms" className="text-blue-200 hover:text-blue-100 transition-colors hover:text-glow">Terms</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-glow">Support</h4>
              <ul className="space-y-2">
                <li><Link href="/help" className="text-blue-200 hover:text-blue-100 transition-colors hover:text-glow">Help Center</Link></li>
                <li><Link href="/docs" className="text-blue-200 hover:text-blue-100 transition-colors hover:text-glow">Documentation</Link></li>
                <li><Link href="/status" className="text-blue-200 hover:text-blue-100 transition-colors hover:text-glow">Status</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-500/20 mt-8 pt-8 text-center">
            <p className="text-blue-300">&copy; 2024 EchoPersona. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}