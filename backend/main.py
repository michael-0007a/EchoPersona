#!/usr/bin/env python3
"""
AI Agent Platform - Speech-to-Speech AI Agents with Document-Based Knowledge
"""

from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os
import tempfile
import logging
from typing import List, Optional
from pydantic import BaseModel
import json

from ai_engine.agent_manager import AgentManager
from ai_engine.knowledge_base import KnowledgeBase
from ai_engine.conversation_engine import ConversationEngine
from ai_engine.voice_processor import VoiceProcessor
from simple_conversation_engine import SimpleConversationEngine

# Setup logging
logging.basicConfig(level=logging.INFO)

app = FastAPI(title="AI Agent Platform", version="2.0.0", description="Speech-to-Speech AI Agents with Document-Based Knowledge")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://*.vercel.app",
        "https://echo-persona.vercel.app",  # Update this with your actual Vercel domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
agent_manager = AgentManager()
knowledge_base = KnowledgeBase()
conversation_engine = ConversationEngine()
voice_processor = VoiceProcessor()
simple_conversation_engine = SimpleConversationEngine()

# Pydantic models
class AgentCreateRequest(BaseModel):
    agent_id: str
    name: str
    agent_type: str  # sales, support, healthcare, survey, reminder
    voice_settings: dict
    personality: dict
    knowledge_categories: List[str]

class SpeechChatRequest(BaseModel):
    agent_id: str
    conversation_id: Optional[str] = None

class TextChatRequest(BaseModel):
    message: str
    agent_id: str
    conversation_id: Optional[str] = None

# Agent Management Endpoints
@app.get("/api/agents")
async def list_agents():
    """Get list of all available agents"""
    try:
        agents = agent_manager.list_agents()
        return {"success": True, "agents": agents}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/agents")
async def create_agent(request: AgentCreateRequest):
    """Create a new AI agent"""
    try:
        agent_data = {
            "agent_id": request.agent_id,
            "name": request.name,
            "agent_type": request.agent_type,
            "voice_settings": request.voice_settings,
            "personality": request.personality,
            "knowledge_base": request.knowledge_categories
        }

        agent_id = agent_manager.create_custom_agent(agent_data)
        return {"success": True, "agent_id": agent_id}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/agents/{agent_id}")
async def get_agent(agent_id: str):
    """Get specific agent details"""
    try:
        agent = agent_manager.get_agent(agent_id)
        if not agent:
            raise HTTPException(status_code=404, detail="Agent not found")

        return {
            "success": True,
            "agent": {
                "agent_id": agent.agent_id,
                "name": agent.name,
                "type": agent.agent_type.value,
                "voice_settings": agent.voice_settings,
                "personality": agent.personality,
                "knowledge_categories": agent.knowledge_base
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/agents/{agent_id}")
async def delete_agent(agent_id: str):
    """Delete an agent"""
    try:
        success = agent_manager.delete_agent(agent_id)
        if not success:
            raise HTTPException(status_code=404, detail="Agent not found")

        return {"success": True, "message": f"Agent {agent_id} deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Document Management Endpoints
@app.post("/api/documents")
async def upload_document(
    file: UploadFile = File(...),
    title: str = Form(...),
    categories: str = Form(...)  # JSON string of categories
):
    """Upload and process a document for the knowledge base"""
    try:
        # Parse categories
        try:
            categories_list = json.loads(categories)
        except:
            categories_list = [categories]  # Single category as fallback

        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=f'.{file.filename.split(".")[-1]}') as tmp_file:
            content = await file.read()
            tmp_file.write(content)
            tmp_file_path = tmp_file.name

        # Extract text based on file type
        if file.filename.endswith('.pdf'):
            text = knowledge_base.extract_text_from_pdf(tmp_file_path)
        elif file.filename.endswith('.docx'):
            text = knowledge_base.extract_text_from_docx(tmp_file_path)
        elif file.filename.endswith('.txt'):
            with open(tmp_file_path, 'r', encoding='utf-8') as f:
                text = f.read()
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type. Use PDF, DOCX, or TXT files.")

        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from file")

        # Add to knowledge base
        doc_id = f"doc_{hash(file.filename + title)}_{len(knowledge_base.documents)}"
        success = knowledge_base.add_document(
            doc_id=doc_id,
            title=title,
            content=text,
            categories=categories_list
        )

        if not success:
            raise HTTPException(status_code=500, detail="Failed to save document")

        # Clean up temp file
        os.unlink(tmp_file_path)

        return {
            "success": True,
            "doc_id": doc_id,
            "title": title,
            "categories": categories_list,
            "word_count": len(text.split())
        }

    except Exception as e:
        logging.error(f"Document upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/documents")
async def list_documents():
    """Get list of all documents in knowledge base"""
    try:
        documents = []
        for doc_id, doc in knowledge_base.documents.items():
            documents.append({
                "doc_id": doc_id,
                "title": doc["title"],
                "categories": doc.get("categories", []),
                "word_count": doc.get("word_count", 0)
            })

        return {"success": True, "documents": documents}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/documents/{doc_id}")
async def delete_document(doc_id: str):
    """Delete a document from knowledge base"""
    try:
        success = knowledge_base.delete_document(doc_id)
        if not success:
            raise HTTPException(status_code=404, detail="Document not found")

        return {"success": True}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Speech-to-Speech Conversation Endpoints
@app.post("/api/speech-chat")
async def speech_chat(
    audio_file: UploadFile = File(...),
    agent_id: str = Form(...)
):
    """Handle speech-to-speech conversation with AI agent"""
    try:
        # Validate agent exists
        agent = agent_manager.get_agent(agent_id)
        if not agent:
            raise HTTPException(status_code=404, detail="Agent not found")

        # Read audio data
        audio_data = await audio_file.read()
        logging.info(f"Received audio file: {audio_file.filename}, size: {len(audio_data)} bytes")

        # Process speech input and generate speech response
        result = await conversation_engine.process_speech_input(audio_data, agent_id)

        if not result["success"]:
            error_msg = result.get("error", "Unknown error")
            logging.error(f"Speech processing failed: {error_msg}")

            # Return a helpful error response instead of 500
            return {
                "success": False,
                "error": error_msg,
                "transcribed_text": "",
                "response_text": "I'm sorry, I couldn't understand your audio. Please try speaking clearly and ensure your microphone is working properly.",
                "audio_url": None
            }

        logging.info(f"Speech processing successful: '{result['transcribed_text']}'")

        return {
            "success": True,
            "transcribed_text": result["transcribed_text"],
            "response_text": result["response_text"],
            "audio_url": f"/api/audio/{os.path.basename(result['audio_response'])}" if result.get('audio_response') else None
        }

    except Exception as e:
        logging.error(f"Speech chat error: {str(e)}")
        # Return structured error instead of 500
        return {
            "success": False,
            "error": f"Server error: {str(e)}",
            "transcribed_text": "",
            "response_text": "I'm experiencing technical difficulties. Please try again.",
            "audio_url": None
        }

@app.post("/api/speech-chat-simple")
async def speech_chat_simple(
    audio_file: UploadFile = File(...),
    agent_id: str = Form(...)
):
    """Handle speech-to-speech conversation with simple processor (testing)"""
    try:
        logging.info(f"🚀 Simple speech chat - Agent: {agent_id}, File: {audio_file.filename}")

        # Read audio data
        audio_data = await audio_file.read()
        logging.info(f"📁 Received audio: {len(audio_data)} bytes")

        # Process with simple engine
        result = await simple_conversation_engine.process_speech_simple(audio_data, agent_id)

        logging.info(f"📤 Simple processing result: {result['success']}")

        return {
            "success": result["success"],
            "transcribed_text": result.get("transcribed_text", ""),
            "response_text": result.get("response_text", "Sorry, something went wrong."),
            "audio_url": f"/api/audio/{os.path.basename(result['audio_response'])}" if result.get('audio_response') else None,
            "error": result.get("error", None)
        }

    except Exception as e:
        logging.error(f"❌ Simple speech chat error: {e}")
        return {
            "success": False,
            "transcribed_text": "",
            "response_text": "I'm having technical difficulties. Please try again.",
            "audio_url": None,
            "error": str(e)
        }

@app.post("/api/text-chat")
async def text_chat(request: TextChatRequest):
    """Handle text-based conversation with AI agent (for testing)"""
    try:
        # Validate agent exists
        agent = agent_manager.get_agent(request.agent_id)
        if not agent:
            raise HTTPException(status_code=404, detail="Agent not found")

        # Generate response based on knowledge base only
        conversation_log = [
            {"speaker": "human", "message": request.message, "timestamp": "2024-01-01T00:00:00"}
        ]

        response = await conversation_engine.generate_response(
            request.agent_id,
            conversation_log,
            {}
        )

        # Convert response to speech
        audio_path = await voice_processor.text_to_speech(response, request.agent_id)

        return {
            "success": True,
            "response": response,
            "audio_url": f"/api/audio/{os.path.basename(audio_path)}" if audio_path else None
        }

    except Exception as e:
        logging.error(f"Text chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/audio/{filename}")
async def get_audio(filename: str):
    """Serve audio files"""
    try:
        audio_path = os.path.join("backend/data/audio", filename)
        if not os.path.exists(audio_path):
            raise HTTPException(status_code=404, detail="Audio file not found")

        return FileResponse(
            audio_path,
            media_type="audio/mpeg",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Utility Endpoints
@app.get("/api/knowledge/categories")
async def get_knowledge_categories():
    """Get all available knowledge categories"""
    try:
        categories = knowledge_base.get_all_categories()
        return {"success": True, "categories": categories}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/voice/languages")
async def get_supported_languages():
    """Get supported voice languages"""
    try:
        languages = voice_processor.get_supported_languages()
        return {"success": True, "languages": languages}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ollama/status")
async def check_ollama_status():
    """Check if Ollama server is running and available"""
    try:
        from ai_engine.ollama_llm_service import OllamaLLMService

        ollama_service = OllamaLLMService()
        is_connected = ollama_service.test_connection()
        available_models = ollama_service.get_available_models()

        return {
            "success": True,
            "ollama_connected": is_connected,
            "available_models": available_models,
            "current_model": "llama3.2:latest" if "llama3.2:latest" in available_models else None
        }

    except Exception as e:
        return {
            "success": False,
            "ollama_connected": False,
            "error": str(e)
        }

@app.get("/api/stats")
async def get_platform_stats():
    """Get platform statistics"""
    try:
        from ai_engine.ollama_llm_service import OllamaLLMService

        ollama_service = OllamaLLMService()
        ollama_status = ollama_service.test_connection()

        stats = {
            "total_agents": len(agent_manager.agents),
            "total_documents": knowledge_base.get_documents_count(),
            "available_categories": len(knowledge_base.get_all_categories()),
            "ollama_connected": ollama_status,
            "system_ready": ollama_status and knowledge_base.get_documents_count() > 0
        }

        return {"success": True, "stats": stats}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "AI Agent Platform - Document-Based Customer Service",
        "version": "2.0.0",
        "features": [
            "Document-Only Responses (No Hallucination)",
            "Speech-to-Speech Customer Service",
            "Ollama LLM Integration (llama3.2:latest)",
            "Multiple Agent Personas",
            "Voice Conversation Processing"
        ],
        "workflow": {
            "1": "Upload company documents (PDFs, DOCX, TXT)",
            "2": "Create agent personas for different departments",
            "3": "Customer speaks to agent via /api/speech-chat",
            "4": "Agent responds ONLY from uploaded documents",
            "5": "Voice response generated and returned"
        }
    }

@app.post("/api/diagnose-audio")
async def diagnose_audio(audio_file: UploadFile = File(...)):
    """Diagnose audio recording issues"""
    try:
        audio_data = await audio_file.read()

        diagnosis = {
            "file_name": audio_file.filename,
            "file_size_bytes": len(audio_data),
            "file_size_kb": round(len(audio_data) / 1024, 2),
            "likely_issue": None,
            "recommendations": [],
            "audio_format": "unknown",
            "has_audio_stream": False,
            "estimated_duration_ms": 0
        }

        # Check file size
        if len(audio_data) < 100:
            diagnosis["likely_issue"] = "Recording failed completely - no data captured"
            diagnosis["recommendations"].extend([
                "❌ Check if microphone permissions are granted in browser",
                "❌ Verify microphone is selected in browser settings",
                "❌ Test microphone in other applications first"
            ])
        elif len(audio_data) < 1000:
            diagnosis["likely_issue"] = "Recording captured header only - no actual audio"
            diagnosis["recommendations"].extend([
                "🔇 Microphone may be muted or volume too low",
                "📢 Try speaking louder and closer to microphone",
                "⏱️ Record for at least 2-3 seconds",
                "🔍 Check browser console for recording errors"
            ])
        elif len(audio_data) < 5000:
            diagnosis["likely_issue"] = "Very short recording - insufficient audio captured"
            diagnosis["recommendations"].extend([
                "⏱️ Record for longer duration (at least 3 seconds)",
                "💬 Speak clearly and continuously",
                "⚠️ Check if recording is stopping prematurely"
            ])
        else:
            diagnosis["likely_issue"] = "File size looks reasonable"
            diagnosis["recommendations"].append("✅ Audio file size is adequate for speech recognition")

        # Analyze format
        if len(audio_data) >= 4:
            if audio_data[:4] == b'\x1a\x45\xdf\xa3':
                diagnosis["audio_format"] = "WebM"

                # Check for audio streams
                if b'OpusHead' in audio_data:
                    diagnosis["has_audio_stream"] = True
                    diagnosis["codec"] = "Opus"
                elif b'vorbis' in audio_data:
                    diagnosis["has_audio_stream"] = True
                    diagnosis["codec"] = "Vorbis"
                else:
                    diagnosis["has_audio_stream"] = False
                    diagnosis["recommendations"].append("⚠️ WebM container found but no audio stream detected")

                # Estimate duration (very rough)
                if len(audio_data) > 1000:
                    estimated_duration = (len(audio_data) / 8000) * 1000
                    diagnosis["estimated_duration_ms"] = round(estimated_duration)

            elif audio_data[:4] == b'RIFF':
                diagnosis["audio_format"] = "WAV"
                diagnosis["has_audio_stream"] = True

        # Quality assessment
        if len(audio_data) >= 10000:
            diagnosis["quality"] = "Good - should work for speech recognition"
        elif len(audio_data) >= 5000:
            diagnosis["quality"] = "Moderate - may work for short speech"
        elif len(audio_data) >= 1000:
            diagnosis["quality"] = "Poor - unlikely to contain clear speech"
        else:
            diagnosis["quality"] = "Insufficient - recording failed"

        return {"success": True, "diagnosis": diagnosis}

    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
