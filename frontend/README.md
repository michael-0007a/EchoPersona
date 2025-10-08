# AI Agent Platform - Frontend

A modern Next.js frontend for the Speech-to-Speech AI Agent Platform that replaces traditional customer service calls with intelligent AI agents.

## Features

### 🎯 Core Functionality
- **Speech-to-Speech Communication**: Voice input → Text transcription → AI response → Voice output
- **Document-Based Knowledge**: Upload PDFs, DOCX, TXT files for agent training
- **Multi-Agent Management**: Create and manage different types of AI agents
- **Real-time Chat Interface**: Modern chat UI with audio playback

### 🤖 Agent Types
- **Customer Support**: Help with inquiries and issues
- **Sales Assistant**: Product information and sales support
- **Healthcare Support**: Medical information and assistance
- **Survey Agent**: Conduct surveys and collect feedback
- **Reminder Service**: Automated reminders and notifications

### 🎨 Modern UI Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Clean Interface**: Modern design with Tailwind CSS
- **Interactive Components**: Smooth animations and transitions
- **Accessibility**: ARIA labels and keyboard navigation
- **Real-time Updates**: Live status indicators and progress feedback

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Language**: TypeScript
- **HTTP Client**: Axios
- **UI Components**: Headless UI

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Main dashboard
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── ChatInterface.tsx   # Voice chat component
│   │   ├── AgentDashboard.tsx  # Agent management
│   │   ├── DocumentManager.tsx # Knowledge base
│   │   ├── AgentCreator.tsx    # Create new agents
│   │   └── Navigation.tsx      # Sidebar navigation
│   ├── services/
│   │   └── api.ts              # Backend API integration
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   └── lib/
│       └── utils.ts            # Utility functions
├── .env.local                  # Environment variables
└── package.json
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend server running on port 8000

### Installation

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

### Environment Configuration

Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Components Overview

### 🎤 ChatInterface
- **Voice Recording**: Hold-to-record functionality
- **Text Input**: Alternative text-based communication
- **Audio Playback**: Auto-play agent responses
- **Agent Selection**: Choose from available agents
- **Real-time Transcription**: Live speech-to-text display

### 🤖 AgentDashboard
- **Agent Overview**: Visual cards with agent information
- **Type-based Filtering**: Filter by agent type
- **Configuration Display**: Voice settings and personality
- **Knowledge Categories**: Linked document categories
- **Agent Actions**: Edit, delete, and manage agents

### 📚 DocumentManager
- **File Upload**: Drag-and-drop or click to upload
- **Format Support**: PDF, DOCX, TXT files
- **Category Management**: Organize documents by topic
- **Search & Filter**: Find documents quickly
- **Word Count**: Track document size and content

### 🧠 AgentCreator
- **Step-by-Step Setup**: Guided agent creation process
- **Voice Configuration**: Gender, tone, speed, emotion
- **Personality Settings**: Communication style and empathy
- **Knowledge Linking**: Connect to document categories
- **Type Selection**: Choose from predefined agent types

## Key Features

### Voice Communication
- **WebRTC Audio Recording**: Browser-based microphone access
- **Real-time Processing**: Instant speech-to-text conversion
- **Audio Response**: Automatic playback of agent responses
- **Error Handling**: Graceful fallbacks for audio issues

### Document Management
- **Multi-format Support**: PDF, DOCX, TXT processing
- **Category System**: Organize knowledge by topics
- **Bulk Operations**: Upload multiple documents
- **Search Functionality**: Find relevant documents quickly

### Agent Customization
- **Personality Configuration**: Detailed personality settings
- **Voice Customization**: Multiple voice options
- **Knowledge Base Linking**: Connect agents to specific documents
- **Type-based Templates**: Pre-configured agent types

## API Integration

The frontend communicates with the FastAPI backend through:

- **Agent Management**: Create, read, update agents
- **Document Processing**: Upload and manage knowledge base
- **Speech Communication**: Handle voice chat requests
- **File Serving**: Retrieve audio responses

## Responsive Design

- **Mobile-first**: Optimized for mobile devices
- **Touch-friendly**: Large touch targets and gestures
- **Progressive Enhancement**: Works without JavaScript
- **Cross-browser**: Compatible with modern browsers

## Performance Optimizations

- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js built-in optimization
- **Bundle Analysis**: Webpack bundle analyzer
- **Lazy Loading**: Components loaded on demand

## Browser Compatibility

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers with WebRTC support

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is part of the AI Agent Platform for customer service automation.
