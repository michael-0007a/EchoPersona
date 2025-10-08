import axios from 'axios';
import { API_BASE_URL } from '@/lib/utils';
import { Agent, Document, SpeechChatResponse, TextChatResponse } from '@/types';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Agent API
export const agentService = {
  async getAgents(): Promise<Agent[]> {
    const response = await api.get('/api/agents');
    return response.data.agents;
  },

  async getAgent(agentId: string): Promise<Agent> {
    const response = await api.get(`/api/agents/${agentId}`);
    return response.data.agent;
  },

  async createAgent(agentData: {
    agent_id: string;
    name: string;
    agent_type: string;
    voice_settings: any;
    personality: any;
    knowledge_categories: string[];
  }): Promise<string> {
    const response = await api.post('/api/agents', agentData);
    return response.data.agent_id;
  },

  async deleteAgent(agentId: string): Promise<void> {
    await api.delete(`/api/agents/${agentId}`);
  },
};

// Document API
export const documentService = {
  async getDocuments(): Promise<Document[]> {
    const response = await api.get('/api/documents');
    return response.data.documents;
  },

  async uploadDocument(
    file: File,
    title: string,
    categories: string[]
  ): Promise<Document> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('categories', JSON.stringify(categories));

    const response = await api.post('/api/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteDocument(docId: string): Promise<void> {
    await api.delete(`/api/documents/${docId}`);
  },
};

// Chat API
export const chatService = {
  async speechChat(audioFile: File, agentId: string): Promise<SpeechChatResponse> {
    const formData = new FormData();
    formData.append('audio_file', audioFile);
    formData.append('agent_id', agentId);

    const response = await api.post('/api/speech-chat', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async textChat(message: string, agentId: string): Promise<TextChatResponse> {
    const response = await api.post('/api/text-chat', {
      message,
      agent_id: agentId,
    });
    return response.data;
  },
};

export default api;
