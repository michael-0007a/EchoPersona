// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Agent Types
export interface Agent {
  agent_id: string;
  name: string;
  type: string;
  voice_settings: VoiceSettings;
  personality: Personality;
  knowledge_categories: string[];
}

export interface VoiceSettings {
  language: string;
  gender: string;
  tone: string;
  speed: number;
  emotion: string;
}

export interface Personality {
  greeting: string;
  communication_style: string;
  expertise_focus: string;
  response_length: string;
  empathy_level: string;
}

// Document Types
export interface Document {
  doc_id: string;
  title: string;
  categories: string[];
  word_count: number;
}

// Chat Types
export interface ChatMessage {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
  audio_url?: string;
}

export interface SpeechChatResponse {
  success: boolean;
  transcribed_text: string;
  response_text: string;
  audio_url?: string;
  error?: string;
}

export interface TextChatResponse {
  success: boolean;
  response: string;
  audio_url?: string;
}
