'use client';

import { useState, useEffect } from 'react';
import {
  Bot,
  Save,
  ArrowLeft,
  Volume2,
  Brain,
  Tag,
  User,
  MessageSquare,
  Heart,
  Briefcase,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { agentService, documentService } from '@/services/api';
import { Document } from '@/types';

export default function AgentCreator() {
  const [formData, setFormData] = useState({
    agent_id: '',
    name: '',
    agent_type: 'support',
    voice_settings: {
      language: 'en',
      gender: 'female',
      tone: 'helpful',
      speed: 1.0,
      emotion: 'professional'
    },
    personality: {
      greeting: 'Hello! How can I help you today?',
      communication_style: 'professional',
      expertise_focus: 'customer service',
      response_length: 'concise',
      empathy_level: 'high'
    },
    knowledge_categories: [] as string[]
  });

  const [documents, setDocuments] = useState<Document[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadDocuments();
    generateAgentId();
  }, []);

  const loadDocuments = async () => {
    try {
      const documentList = await documentService.getDocuments();
      setDocuments(documentList);

      // Extract unique categories
      const categories = Array.from(
        new Set(documentList.flatMap(doc => doc.categories))
      );
      setAvailableCategories(categories);
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
  };

  const generateAgentId = () => {
    const timestamp = Date.now().toString().slice(-6);
    setFormData(prev => ({
      ...prev,
      agent_id: `agent_${timestamp}`
    }));
  };

  const agentTypes = [
    { value: 'support', label: 'Customer Support', icon: MessageSquare, description: 'Help customers with inquiries and issues' },
    { value: 'sales', label: 'Sales Assistant', icon: Briefcase, description: 'Assist with product information and sales' },
    { value: 'healthcare', label: 'Healthcare Support', icon: Heart, description: 'Provide healthcare information and support' },
    { value: 'survey', label: 'Survey Agent', icon: User, description: 'Conduct surveys and collect feedback' },
    { value: 'reminder', label: 'Reminder Service', icon: Clock, description: 'Send reminders and notifications' }
  ];

  const voiceGenders = ['female', 'male'];
  const voiceTones = ['helpful', 'friendly', 'professional', 'warm', 'confident'];
  const communicationStyles = ['professional', 'casual', 'friendly', 'formal', 'empathetic'];
  const responseLengths = ['brief', 'concise', 'detailed', 'comprehensive'];
  const empathyLevels = ['low', 'medium', 'high', 'very_high'];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleVoiceSettingChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      voice_settings: { ...prev.voice_settings, [field]: value }
    }));
  };

  const handlePersonalityChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      personality: { ...prev.personality, [field]: value }
    }));
  };

  const toggleKnowledgeCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      knowledge_categories: prev.knowledge_categories.includes(category)
        ? prev.knowledge_categories.filter(cat => cat !== category)
        : [...prev.knowledge_categories, category]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCreating(true);

    try {
      // Validation
      if (!formData.name.trim()) {
        throw new Error('Agent name is required');
      }

      await agentService.createAgent(formData);
      setSuccess(`Agent "${formData.name}" created successfully!`);

      // Reset form
      setTimeout(() => {
        generateAgentId();
        setFormData(prev => ({
          ...prev,
          name: '',
          personality: {
            ...prev.personality,
            greeting: 'Hello! How can I help you today?'
          },
          knowledge_categories: []
        }));
        setSuccess(null);
      }, 2000);

    } catch (error: any) {
      setError(error.message || 'Failed to create agent');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-700">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Create AI Agent</h2>
              <p className="text-gray-400">Configure a new customer service agent</p>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="m-6 p-4 bg-green-900/50 border border-green-700 rounded-lg text-green-300">
            {success}
          </div>
        )}

        {error && (
          <div className="m-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-300 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4 flex items-center">
              <Bot className="w-5 h-5 mr-2" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Agent ID
                </label>
                <input
                  type="text"
                  value={formData.agent_id}
                  onChange={(e) => handleInputChange('agent_id', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-400"
                  readOnly
                />
                <p className="mt-1 text-xs text-gray-500">Auto-generated unique identifier</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Agent Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter agent name..."
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Agent Type */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">
              Agent Type
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agentTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div
                    key={type.value}
                    className={`relative rounded-lg border-2 p-4 cursor-pointer transition-colors ${
                      formData.agent_type === type.value
                        ? 'border-blue-500 bg-blue-900/30'
                        : 'border-gray-600 hover:border-gray-500 bg-gray-800'
                    }`}
                    onClick={() => handleInputChange('agent_type', type.value)}
                  >
                    <div className="flex items-start space-x-3">
                      <Icon className={`w-6 h-6 flex-shrink-0 ${
                        formData.agent_type === type.value ? 'text-blue-400' : 'text-gray-400'
                      }`} />
                      <div>
                        <h4 className={`font-medium ${
                          formData.agent_type === type.value ? 'text-blue-300' : 'text-white'
                        }`}>
                          {type.label}
                        </h4>
                        <p className="text-sm text-gray-400 mt-1">
                          {type.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Voice Settings */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4 flex items-center">
              <Volume2 className="w-5 h-5 mr-2" />
              Voice Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Gender
                </label>
                <select
                  value={formData.voice_settings.gender}
                  onChange={(e) => handleVoiceSettingChange('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {voiceGenders.map(gender => (
                    <option key={gender} value={gender} className="bg-gray-800">
                      {gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tone
                </label>
                <select
                  value={formData.voice_settings.tone}
                  onChange={(e) => handleVoiceSettingChange('tone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {voiceTones.map(tone => (
                    <option key={tone} value={tone} className="bg-gray-800">
                      {tone.charAt(0).toUpperCase() + tone.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Speed: {formData.voice_settings.speed}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={formData.voice_settings.speed}
                  onChange={(e) => handleVoiceSettingChange('speed', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>

          {/* Personality Settings */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Personality
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Greeting Message
                </label>
                <textarea
                  value={formData.personality.greeting}
                  onChange={(e) => handlePersonalityChange('greeting', e.target.value)}
                  placeholder="Enter the agent's greeting message..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Communication Style
                  </label>
                  <select
                    value={formData.personality.communication_style}
                    onChange={(e) => handlePersonalityChange('communication_style', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {communicationStyles.map(style => (
                      <option key={style} value={style} className="bg-gray-800">
                        {style.charAt(0).toUpperCase() + style.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Response Length
                  </label>
                  <select
                    value={formData.personality.response_length}
                    onChange={(e) => handlePersonalityChange('response_length', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {responseLengths.map(length => (
                      <option key={length} value={length} className="bg-gray-800">
                        {length.charAt(0).toUpperCase() + length.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Expertise Focus
                  </label>
                  <input
                    type="text"
                    value={formData.personality.expertise_focus}
                    onChange={(e) => handlePersonalityChange('expertise_focus', e.target.value)}
                    placeholder="e.g., customer service, technical support..."
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Empathy Level
                  </label>
                  <select
                    value={formData.personality.empathy_level}
                    onChange={(e) => handlePersonalityChange('empathy_level', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {empathyLevels.map(level => (
                      <option key={level} value={level} className="bg-gray-800">
                        {level.replace('_', ' ').charAt(0).toUpperCase() + level.replace('_', ' ').slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Knowledge Categories */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4 flex items-center">
              <Tag className="w-5 h-5 mr-2" />
              Knowledge Categories
            </h3>
            {availableCategories.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableCategories.map(category => (
                  <label key={category} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.knowledge_categories.includes(category)}
                      onChange={() => toggleKnowledgeCategory(category)}
                      className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-sm text-gray-300">{category}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-800 rounded-lg border border-gray-700">
                <Tag className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-400">No documents uploaded yet</p>
                <p className="text-sm text-gray-500 mt-1">Upload documents to see available categories</p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
            <button
              type="submit"
              disabled={creating}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {creating ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{creating ? 'Creating...' : 'Create Agent'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
