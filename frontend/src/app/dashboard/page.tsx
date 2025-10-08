'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Bot,
  FileText,
  MessageSquare,
  Settings,
  Upload,
  Mic,
  Users,
  Brain,
  ArrowLeft,
  Menu,
  X
} from 'lucide-react';
import AgentDashboard from '@/components/AgentDashboard';
import DocumentManager from '@/components/DocumentManager';
import ChatInterface from '@/components/ChatInterface';
import AgentCreator from '@/components/AgentCreator';

type ActiveTab = 'chat' | 'agents' | 'documents' | 'create-agent';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tabs = [
    {
      id: 'chat' as ActiveTab,
      label: 'Voice Chat',
      icon: MessageSquare,
      description: 'Talk with AI agents'
    },
    {
      id: 'agents' as ActiveTab,
      label: 'Agents',
      icon: Bot,
      description: 'Manage AI agents'
    },
    {
      id: 'documents' as ActiveTab,
      label: 'Knowledge Base',
      icon: FileText,
      description: 'Upload documents'
    },
    {
      id: 'create-agent' as ActiveTab,
      label: 'Create Agent',
      icon: Brain,
      description: 'Build new agents'
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatInterface />;
      case 'agents':
        return <AgentDashboard />;
      case 'documents':
        return <DocumentManager />;
      case 'create-agent':
        return <AgentCreator />;
      default:
        return <ChatInterface />;
    }
  };

  return (
    <div className="min-h-screen bg-charcoal">
      {/* Header */}
      <header className="bg-charcoal-light shadow-sm border-b border-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-gray-400 hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">EchoPersona</h1>
                  <p className="text-sm text-gray-400">AI Agent Dashboard</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Connected</span>
              </div>
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-charcoal-light shadow-sm border-r border-charcoal transition-transform duration-300 ease-in-out`}>
          <div className="p-6">
            <div className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white border border-blue-500'
                        : 'text-gray-300 hover:bg-charcoal-lighter hover:text-white'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    <div>
                      <div className="font-medium">{tab.label}</div>
                      <div className="text-xs opacity-75">{tab.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-8 bg-charcoal min-h-screen">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
