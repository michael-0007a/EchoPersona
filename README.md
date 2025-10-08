# AIGNITE 2K25

<!-- AIGNITE Banner (centered) -->
<div align="center">
  <h1>🎙️ EchoPersona - AI Voice Agent Platform</h1>
  <p><strong>Powered by MLSC AIGNITE 2K25</strong></p>
</div>

---

<p align="center">
  <strong>🚀 Document-Based AI Customer Service</strong><br/>
  <em>Revolutionary AI Agents with Voice-to-Voice Communication - No Hallucinations, Only Facts</em>
</p>

---

## 📖 Project Description

✨ **Problem Statement:** Traditional customer service systems suffer from:
- Limited availability (business hours only)
- Inconsistent information across support channels
- Long wait times and language barriers
- AI agents that "hallucinate" incorrect information
- Lack of voice-based interaction

💡 **Proposed Solution:** EchoPersona is an AI-powered voice agent platform that:
- Provides 24/7 instant voice-to-voice customer support
- Responds ONLY from uploaded company documents (zero hallucination)
- Supports multiple specialized AI agent personas
- Enables natural speech conversations with real-time transcription
- Integrates company knowledge bases for accurate responses

🎯 **Target Users / Use Cases:**
- **Small to Enterprise Businesses** - Automated customer support
- **E-commerce Companies** - Product information and FAQs
- **Healthcare Organizations** - Patient information (HIPAA-compliant)
- **SaaS Companies** - Technical documentation support
- **Educational Institutions** - Student queries and course information

---

## 🔬 Methodology

1. **Research & Ideation** – Analyzed customer service challenges and voice AI capabilities
2. **Design** – Created intuitive UI/UX with modern dark theme, architected microservices
3. **Develop** – Built core features: voice processing, document RAG, agent management
4. **Test** – Extensive testing of speech recognition accuracy and response quality
5. **Deploy** – Cloud-ready architecture with containerization support
6. **Future Scope** – Multi-language support, sentiment analysis, CRM integrations

---

## 👥 Team Details

**Team Name:** `EchoPersona Innovators`

| Name | Role | GitHub |
|---|---|---|
| Michael | Full Stack Developer & Project Lead | @michael |
| Jayesh | AI/ML Engineer & Voice Processing | @jayesh |
| Rithik | Backend Developer & API Design | @rithik |
| Sunil | Frontend Developer & UI/UX | @sunil |

---

## 🛠️ Technology Stack

**Frontend:**
- `Next.js 14` with `TypeScript` - React framework with SSR
- `Tailwind CSS` - Utility-first styling
- `Lucide React` - Icon library
- `Axios` - HTTP client
- `Web Audio API` - Browser audio recording

**Backend:**
- `FastAPI` (Python) - High-performance async API framework
- `Pydantic` - Data validation and settings management
- `Speech Recognition` - Google Speech-to-Text
- `gTTS` - Google Text-to-Speech synthesis
- `PyPDF2` & `python-docx` - Document processing
- `Pydub` - Audio processing and conversion

**AI/ML Stack:**
- `Ollama` (llama3.2:latest) - Local LLM inference for privacy
- `Google Gemini 2.0 Flash` - Cloud LLM fallback (free tier)
- `Hybrid LLM Service` - Automatic Ollama → Gemini failover
- Document-based RAG (Retrieval Augmented Generation)
- Zero-hallucination prompt engineering

**Infrastructure:**
- `CORS` enabled for cross-origin requests
- `File-based storage` for knowledge base and agents
- `WebM audio` with Opus codec for efficient streaming
- `RESTful API` architecture

---

## ✨ Key Features

- 🎙️ **Voice-to-Voice AI Conversations** - Natural speech interactions
- 📄 **Document-Only Responses** - Zero hallucination, only factual information
- 🤖 **Multiple AI Agent Personas** - Support, Sales, Healthcare agents
- 📚 **Smart Knowledge Base** - Upload PDFs, DOCX, TXT files
- 🗣️ **Real-time Speech Processing** - Instant transcription and response
- 🎨 **Modern Dark UI** - Beautiful, responsive interface
- 🔄 **Hybrid LLM System** - Ollama + Gemini automatic fallback
- ⚡ **Fast Response Times** - Optimized for low latency
- 🔒 **Document Privacy** - Local processing option with Ollama
- 📊 **Agent Management** - Create, view, and delete AI agents

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** (for frontend)
- **Python 3.9+** (for backend)
- **Ollama** (optional - for local LLM)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-team/aignite-proj
   cd aignite-proj
   ```

2. **Setup Backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   python main.py
   ```
   Backend will run on `http://localhost:8000`

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

4. **Optional: Install Ollama (for local LLM)**
   ```bash
   # Visit https://ollama.ai/download
   # After installation:
   ollama pull llama3.2:latest
   ```

---

## 📖 Usage Guide

### 1. Upload Knowledge Documents
- Navigate to "Documents" section
- Upload PDF, DOCX, or TXT files with your company information
- Add categories/tags for organization

### 2. Create AI Agents
- Go to "Create Agent" section
- Configure agent personality, voice settings, and knowledge areas
- Agent types: Support, Sales, Healthcare, Survey, Reminder

### 3. Start Voice Conversations
- Select an agent from "Chat" section
- **Hold the microphone button for 2-3 seconds** while speaking
- Release to send - AI will respond with voice

### 4. Manage Agents
- View all agents in "AI Agents" dashboard
- Click on an agent to see details
- Delete agents using the trash icon

---

## 🎯 API Endpoints

### Agents
- `GET /api/agents` - List all agents
- `POST /api/agents` - Create new agent
- `GET /api/agents/{agent_id}` - Get agent details
- `DELETE /api/agents/{agent_id}` - Delete agent

### Documents
- `GET /api/documents` - List all documents
- `POST /api/documents` - Upload document
- `DELETE /api/documents/{doc_id}` - Delete document

### Chat
- `POST /api/speech-chat` - Voice-to-voice conversation
- `POST /api/text-chat` - Text-based conversation

### Utilities
- `POST /api/diagnose-audio` - Audio recording diagnostics
- `GET /api/stats` - Platform statistics

---

## 🎬 Demo Video

▶️ [Watch Demo Video](https://youtube.com/watch?v=demo-link)

---

## 🌐 Live Demo

🔗 [EchoPersona Platform](https://echopersona-demo.vercel.app) *(Coming Soon)*

---

## 📝 Known Issues & Solutions

### Voice Recording Issues
- **Problem:** Recording too short or no audio captured
- **Solution:** Hold microphone button for at least 2-3 seconds while speaking clearly

### LLM Connection
- **Problem:** Ollama not responding
- **Solution:** System automatically falls back to Gemini API (free tier)

### Generic Responses
- **Problem:** AI giving "I'm here to help" responses
- **Solution:** Fixed with improved prompt engineering (v2.0)

---

## 🔮 Future Enhancements

- 🌍 Multi-language support (Spanish, French, Hindi, etc.)
- 📊 Advanced analytics dashboard
- 🔗 CRM integrations (Salesforce, HubSpot)
- 📱 Mobile app (iOS & Android)
- 🎭 Custom voice cloning for agents
- 🔐 Enterprise SSO authentication
- 🤝 Multi-agent collaboration
- 📈 Sentiment analysis and emotion detection

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **MLSC AIGNITE 2K25** - For organizing this amazing hackathon
- **Ollama Team** - For open-source LLM infrastructure
- **Google** - For Gemini API and Speech services
- **FastAPI & Next.js Communities** - For excellent documentation

---

## 📞 Contact

**Project Link:** [https://github.com/your-team/aignite-proj](https://github.com/your-team/aignite-proj)

For questions or support, please open an issue on GitHub.

---

<div align="center">
  <p>Made with ❤️ by EchoPersona Innovators</p>
  <p><strong>AIGNITE 2K25 - MLSC</strong></p>
</div>
