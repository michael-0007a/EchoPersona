'use client';

import Link from 'next/link';
import {
  Bot,
  ArrowLeft,
  Users,
  Target,
  Lightbulb,
  Award,
  Globe,
  Heart
} from 'lucide-react';

export default function AboutPage() {
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
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 text-glow-purple">EchoPersona</span>
            </h1>
          </div>
          <p className="text-xl text-blue-200 mb-8">
            We're revolutionizing customer service by replacing traditional phone calls with intelligent AI agents
            that provide natural, human-like conversations powered by your company's knowledge base.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-charcoal-light/20 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="text-center float-animation">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 glow-blue pulse-glow">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 text-glow">Our Mission</h3>
              <p className="text-blue-200">
                To transform customer service by making AI-powered voice interactions so natural and effective
                that customers prefer them over traditional phone support.
              </p>
            </div>
            <div className="text-center float-animation" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 glow-purple pulse-glow">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 text-glow">Our Vision</h3>
              <p className="text-blue-200">
                A world where every business can provide 24/7, multilingual customer support that's
                instant, accurate, and genuinely helpful through AI technology.
              </p>
            </div>
            <div className="text-center float-animation" style={{ animationDelay: '0.4s' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 glow-pink pulse-glow">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 text-glow">Our Values</h3>
              <p className="text-blue-200">
                Innovation, reliability, and customer-centricity drive everything we do.
                We believe technology should enhance human experiences, not replace them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-8 text-center text-glow">Our Story</h2>
          <div className="space-y-6 text-lg text-blue-200">
            <p>
              EchoPersona was born from a simple observation: customer service calls are often frustrating,
              time-consuming, and limited by human availability. We saw an opportunity to leverage advanced
              AI technology to create something better.
            </p>
            <p>
              Our team of AI researchers, voice technology experts, and customer experience professionals
              came together with a shared vision - to create AI agents that don't just answer questions,
              but truly understand context, emotion, and intent.
            </p>
            <p>
              What started as an experiment in natural language processing has evolved into a comprehensive
              platform that enables businesses to deploy intelligent voice agents that customers actually
              enjoy talking to.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-charcoal-light/20 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-16 text-center text-glow">Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Michael",
                role: "Full Stack Developer & Project Lead",
                bio: "Leads development with expertise in React, Node.js, and AI integration",
                image: "/michael.png"
              },
              {
                name: "Jayesh",
                role: "AI/ML Engineer",
                bio: "Specializes in machine learning, NLP, and AI model optimization",
                image: "/Jayesh.png"
              },
              {
                name: "Rithik",
                role: "Backend Developer & DevOps",
                bio: "Expert in Python, database architecture, and cloud deployment",
                image: "/Rithik.jpg"
              },
              {
                name: "Sunil",
                role: "Frontend Developer & UI/UX",
                bio: "Creates intuitive user experiences with modern web technologies",
                image: "/sunil.png"
              }
            ].map((member, index) => (
              <div key={index} className="bg-charcoal-light/30 backdrop-blur-sm p-6 rounded-xl border border-blue-500/20 hover:border-blue-400 glow-card group float-animation"
                   style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-blue-500/30 group-hover:border-blue-400 transition-all glow-blue">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1 text-glow">{member.name}</h3>
                  <p className="text-blue-400 font-medium mb-3 group-hover:text-blue-300 transition-colors">{member.role}</p>
                  <p className="text-blue-200 text-sm group-hover:text-blue-100 transition-colors">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-16 text-center text-glow">By the Numbers</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { number: "10M+", label: "Conversations Handled" },
              { number: "500+", label: "Enterprise Customers" },
              { number: "99.9%", label: "Uptime Achieved" },
              { number: "50+", label: "Languages Supported" }
            ].map((stat, index) => (
              <div key={index} className="float-animation" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-4xl font-bold text-blue-400 mb-2 text-glow">{stat.number}</div>
                <div className="text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-charcoal-light/20 backdrop-blur-sm relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4 text-glow">
            Ready to Join the Revolution?
          </h2>
          <p className="text-xl text-blue-200 mb-8">
            See how EchoPersona can transform your customer service experience
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all btn-glow glow-blue transform hover:scale-105"
            >
              Start Free Trial
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border border-blue-500/50 hover:border-blue-400 text-blue-200 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all glow-card shimmer"
            >
              Contact Sales
            </Link>
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
