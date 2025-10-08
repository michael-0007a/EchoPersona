'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Bot,
  User,
  Volume2,
  VolumeX,
  Square,
  Play
} from 'lucide-react';
import { Agent, ChatMessage, SpeechChatResponse } from '@/types';
import { agentService, chatService } from '@/services/api';
import { API_BASE_URL } from '@/lib/utils';

export default function ChatInterface() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordingStartTime = useRef<number>(0);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadAgents();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadAgents = async () => {
    try {
      const agentList = await agentService.getAgents();
      setAgents(agentList);
      if (agentList.length > 0) {
        setSelectedAgent(agentList[0]);
      }
    } catch (error) {
      console.error('Failed to load agents:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,  // Match working test - use browser default
          channelCount: 1
        }
      });

      // Reset audio chunks before starting new recording
      setAudioChunks([]);

      // Use same MIME type selection as working test
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm';
      }

      const recorder = new MediaRecorder(stream, {
        mimeType: mimeType,
        audioBitsPerSecond: 128000  // Match working test
      });

      // Use a ref to store chunks to avoid state timing issues
      const chunksRef: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log('📊 Audio chunk received:', event.data.size, 'bytes');
          chunksRef.push(event.data);
          setAudioChunks(prev => [...prev, event.data]);
        }
      };

      recorder.onstop = async () => {
        console.log('⏹️ Recording stopped, chunks:', chunksRef.length);

        // Clear the recording timer
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }

        // Calculate actual recording duration
        const actualDuration = (Date.now() - recordingStartTime.current) / 1000;
        console.log(`⏱️ Recording duration: ${actualDuration.toFixed(2)} seconds`);

        if (chunksRef.length === 0) {
          console.error('❌ No audio data recorded');
          alert('No audio was recorded. Please try speaking longer and try again.');
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        const audioBlob = new Blob(chunksRef, { type: mimeType });
        console.log('📦 Final audio blob:', audioBlob.size, 'bytes, type:', audioBlob.type);

        if (audioBlob.size === 0) {
          console.error('❌ Audio blob is empty');
          alert('Audio recording failed. Please try again.');
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        // Check minimum duration and size
        if (actualDuration < 1.5) {
          console.warn(`⚠️ Recording too short: ${actualDuration.toFixed(2)}s`);
          alert('⚠️ Recording too short! Please hold the microphone button for at least 2-3 seconds while speaking clearly.');
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        if (audioBlob.size < 5000) {
          console.warn('⚠️ Audio blob is very small - may not contain clear speech');
          alert('⚠️ Recording seems too quiet or short. Please:\n• Hold the button for at least 2-3 seconds\n• Speak clearly and loudly\n• Check your microphone volume');
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        await sendAudioMessage(audioBlob);

        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.onerror = (event) => {
        console.error('❌ MediaRecorder error:', event);
        alert('Recording error occurred. Please try again.');
        stream.getTracks().forEach(track => track.stop());
      };

      // Start recording with 100ms timeslice (same as working test)
      recorder.start(100);
      setMediaRecorder(recorder);
      setIsRecording(true);
      recordingStartTime.current = Date.now();

      // Update: Set a timer to check recording status every 100ms
      recordingTimerRef.current = setInterval(() => {
        const elapsed = (Date.now() - recordingStartTime.current) / 1000;
        console.log(`⏱️ Recording... ${elapsed.toFixed(1)}s`);
      }, 100);

      console.log('✅ Recording started with mime type:', mimeType);
    } catch (error) {
      console.error('❌ Error starting recording:', error);
      alert('Failed to access microphone. Please check permissions and try again.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      console.log('Stopping recording...');
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const sendAudioMessage = async (audioBlob: Blob) => {
    if (!selectedAgent) return;

    console.log('Sending audio message, blob size:', audioBlob.size);
    setIsLoading(true);

    // Add user message placeholder
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: 'Voice message...',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Create proper audio file with correct extension based on type
      let filename = 'audio.wav';
      let fileType = 'audio/wav';

      if (audioBlob.type.includes('webm')) {
        filename = 'audio.webm';
        fileType = 'audio/webm';
      }

      const audioFile = new File([audioBlob], filename, { type: fileType });
      console.log('Created audio file:', audioFile.name, audioFile.size, 'bytes');

      const response = await chatService.speechChat(audioFile, selectedAgent.agent_id);

      // Update user message with transcription
      setMessages(prev => prev.map(msg =>
        msg.id === userMessage.id
          ? { ...msg, content: response.transcribed_text || 'Could not transcribe audio' }
          : msg
      ));

      // Add agent response
      const agentMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: response.response_text,
        timestamp: new Date(),
        audio_url: response.audio_url ? `${API_BASE_URL}${response.audio_url}` : undefined
      };
      setMessages(prev => [...prev, agentMessage]);

      // Auto-play response if audio is available
      if (agentMessage.audio_url) {
        playAudio(agentMessage.audio_url);
      }
    } catch (error) {
      console.error('Error sending audio message:', error);
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: 'Sorry, I encountered an error processing your message. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendTextMessage = async () => {
    if (!selectedAgent || !textInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: textInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setTextInput('');
    setIsLoading(true);

    try {
      const response = await chatService.textChat(textInput, selectedAgent.agent_id);

      const agentMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: response.response,
        timestamp: new Date(),
        audio_url: response.audio_url ? `${API_BASE_URL}${response.audio_url}` : undefined
      };

      setMessages(prev => [...prev, agentMessage]);

      // Auto-play response if audio is available
      if (agentMessage.audio_url) {
        playAudio(agentMessage.audio_url);
      }
    } catch (error) {
      console.error('Error sending text message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play().catch(error => {
      console.error('Error playing audio:', error);
    });
  };

  const clearChat = () => {
    setMessages([]);
  };

  if (!selectedAgent) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Bot className="w-16 h-16 mx-auto text-gray-500 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No agents available</h3>
          <p className="text-gray-400">Create an agent first to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <select
              value={selectedAgent?.agent_id || ''}
              onChange={(e) => {
                const agent = agents.find(a => a.agent_id === e.target.value);
                setSelectedAgent(agent || null);
              }}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {agents.map(agent => (
                <option key={agent.agent_id} value={agent.agent_id}>
                  {agent.name} ({agent.type})
                </option>
              ))}
            </select>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Ready</span>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Clear Chat
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <Mic className="w-12 h-12 mx-auto text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Start a conversation</h3>
            <p className="text-gray-400">Click the microphone to speak or type a message</p>
          </div>
        ) : (
          messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md xl:max-w-lg flex items-start space-x-3 ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user'
                      ? 'bg-blue-600'
                      : 'bg-gradient-to-br from-purple-600 to-blue-600'
                  }`}
                >
                  {message.type === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-white'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  {message.audio_url && message.type === 'agent' && (
                    <button
                      onClick={() => playAudio(message.audio_url!)}
                      className="mt-2 flex items-center space-x-2 text-xs text-gray-300 hover:text-white transition-colors"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Play audio</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-700 rounded-2xl px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-gray-700">
        <div className="flex items-center space-x-4">
          {/* Voice Recording */}
          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onMouseLeave={stopRecording}
            disabled={isLoading}
            className={`p-3 rounded-full transition-all duration-200 ${
              isRecording
                ? 'bg-red-600 text-white shadow-lg scale-110'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isRecording ? (
              <Square className="w-6 h-6" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </button>

          {/* Text Input */}
          <div className="flex-1 flex items-center space-x-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendTextMessage()}
              placeholder="Type a message or hold to speak..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            />
            <button
              onClick={sendTextMessage}
              disabled={!textInput.trim() || isLoading}
              className="p-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full shadow-md hover:shadow-lg transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isRecording && (
          <div className="mt-4 flex items-center justify-center space-x-2 text-red-400">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Recording... Release to send</span>
          </div>
        )}
      </div>
    </div>
  );
}
