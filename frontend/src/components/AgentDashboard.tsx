'use client';

import React, { useState, useEffect } from 'react';
import {
  Bot,
  Settings,
  Trash2,
  Plus,
  User,
  MessageSquare,
  Volume2,
  Brain,
  Clock,
  Tag
} from 'lucide-react';
import { Agent } from '@/types';
import { agentService } from '@/services/api';

export default function AgentDashboard() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      setLoading(true);
      const agentList = await agentService.getAgents();
      setAgents(agentList);
    } catch (error) {
      console.error('Failed to load agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAgent = async (agentId: string, agentName: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the agent details modal

    const confirmed = window.confirm(`Are you sure you want to delete "${agentName}"? This action cannot be undone.`);

    if (confirmed) {
      try {
        await agentService.deleteAgent(agentId);
        // Reload agents list after successful deletion
        await loadAgents();
        // Close modal if the deleted agent was selected
        if (selectedAgent?.agent_id === agentId) {
          setSelectedAgent(null);
        }
        console.log(`✅ Agent "${agentName}" deleted successfully`);
      } catch (error) {
        console.error('Failed to delete agent:', error);
        alert('Failed to delete agent. Please try again.');
      }
    }
  };

  const getAgentTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'support':
        return MessageSquare;
      case 'sales':
        return User;
      case 'healthcare':
        return Brain;
      default:
        return Bot;
    }
  };

  const getAgentTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'support':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'sales':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'healthcare':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'survey':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reminder':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">AI Agents</h2>
          <p className="text-gray-400">Manage your AI customer service agents</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-400">
            {agents.length} {agents.length === 1 ? 'agent' : 'agents'} active
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      {agents.length === 0 ? (
        <div className="text-center py-12 bg-charcoal-light rounded-xl border-2 border-dashed border-charcoal-light">
          <Bot className="w-16 h-16 mx-auto text-gray-500 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No agents created yet</h3>
          <p className="text-gray-400 mb-6">Create your first AI agent to get started</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => {
            const IconComponent = getAgentTypeIcon(agent.type);
            const typeColor = getAgentTypeColor(agent.type);

            return (
              <div
                key={agent.agent_id}
                className="bg-charcoal-light rounded-xl shadow-sm border border-charcoal-light p-6 hover:shadow-md hover:border-charcoal transition-all cursor-pointer"
                onClick={() => setSelectedAgent(agent)}
              >
                {/* Agent Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{agent.name}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${typeColor}`}>
                        {agent.type}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Agent Stats */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Voice Language:</span>
                    <span className="font-medium text-gray-300">{agent.voice_settings?.language || 'en'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Voice Gender:</span>
                    <span className="font-medium capitalize text-gray-300">{agent.voice_settings?.gender || 'female'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Communication Style:</span>
                    <span className="font-medium capitalize text-gray-300">{agent.personality?.communication_style || 'professional'}</span>
                  </div>
                </div>

                {/* Knowledge Categories */}
                {agent.knowledge_categories && agent.knowledge_categories.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs text-gray-400 mb-2">Knowledge Areas:</div>
                    <div className="flex flex-wrap gap-1">
                      {agent.knowledge_categories.slice(0, 3).map((category, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-charcoal-lighter text-gray-300"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {category}
                        </span>
                      ))}
                      {agent.knowledge_categories.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-charcoal-lighter text-gray-300">
                          +{agent.knowledge_categories.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-charcoal">
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>Ready to chat</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-400 transition-colors">
                      <Settings className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      onClick={(e) => handleDeleteAgent(agent.agent_id, agent.name, e)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Agent Details Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-charcoal-light rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-charcoal">
            <div className="p-6 border-b border-charcoal">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    {React.createElement(getAgentTypeIcon(selectedAgent.type), {
                      className: "w-6 h-6 text-white"
                    })}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedAgent.name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getAgentTypeColor(selectedAgent.type)}`}>
                      {selectedAgent.type}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Voice Settings */}
              <div>
                <h4 className="text-lg font-medium text-white mb-3 flex items-center">
                  <Volume2 className="w-5 h-5 mr-2" />
                  Voice Settings
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Language</label>
                    <p className="mt-1 text-sm text-gray-300">{selectedAgent.voice_settings?.language || 'English'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Gender</label>
                    <p className="mt-1 text-sm text-gray-300 capitalize">{selectedAgent.voice_settings?.gender || 'Female'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Tone</label>
                    <p className="mt-1 text-sm text-gray-300 capitalize">{selectedAgent.voice_settings?.tone || 'Helpful'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Speed</label>
                    <p className="mt-1 text-sm text-gray-300">{selectedAgent.voice_settings?.speed || 1.0}x</p>
                  </div>
                </div>
              </div>

              {/* Personality */}
              <div>
                <h4 className="text-lg font-medium text-white mb-3 flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  Personality
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Greeting</label>
                    <p className="mt-1 text-sm text-gray-300">{selectedAgent.personality?.greeting || 'Hello! How can I help you today?'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Communication Style</label>
                    <p className="mt-1 text-sm text-gray-300 capitalize">{selectedAgent.personality?.communication_style || 'Professional'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Expertise Focus</label>
                    <p className="mt-1 text-sm text-gray-300">{selectedAgent.personality?.expertise_focus || 'General assistance'}</p>
                  </div>
                </div>
              </div>

              {/* Knowledge Categories */}
              <div>
                <h4 className="text-lg font-medium text-white mb-3 flex items-center">
                  <Tag className="w-5 h-5 mr-2" />
                  Knowledge Base
                </h4>
                {selectedAgent.knowledge_categories && selectedAgent.knowledge_categories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedAgent.knowledge_categories.map((category, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-600/20 text-blue-400 border border-blue-600/30"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No specific knowledge categories configured</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
