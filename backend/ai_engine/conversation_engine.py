#!/usr/bin/env python3
"""
Conversation Engine - Handles speech-to-speech AI conversations based on knowledge base
"""

import asyncio
import json
import logging
from typing import List, Dict, Optional
from datetime import datetime

class ConversationEngine:
    def __init__(self):
        self.active_conversations = {}

    async def generate_opening(self, agent_id: str, script: str, contact: dict) -> str:
        """Generate opening message for the conversation"""
        from .agent_manager import AgentManager

        agent_manager = AgentManager()
        agent = agent_manager.get_agent(agent_id)

        if not agent:
            return "Hello! How can I help you today?"

        # Use agent's greeting with personalization
        greeting = agent.personality["greeting"]

        # Replace placeholders
        if hasattr(contact, 'name'):
            greeting = greeting.replace("{name}", contact.name)
        elif 'name' in contact:
            greeting = greeting.replace("{name}", contact['name'])

        return greeting

    async def generate_response(self, agent_id: str, conversation_log: List[dict], contact: dict) -> str:
        """Generate AI response using Hybrid LLM (Ollama with Gemini fallback)"""
        from .agent_manager import AgentManager
        from .knowledge_base import KnowledgeBase
        from .hybrid_llm_service import HybridLLMService

        try:
            agent_manager = AgentManager()
            agent = agent_manager.get_agent(agent_id)

            if not agent:
                logging.error(f"❌ Agent not found: {agent_id}")
                available_agents = agent_manager.list_agents()
                logging.info(f"📋 Available agents: {[a.get('agent_id', 'unknown') for a in available_agents]}")
                return "I'm sorry, I'm not able to help with that right now."

            logging.info(f"✅ Found agent: {agent.name} ({agent.agent_id})")

            # Get the latest human message
            latest_human_message = None
            for entry in reversed(conversation_log):
                if entry["speaker"] == "human":
                    latest_human_message = entry["message"]
                    break

            if not latest_human_message:
                return "I didn't catch that. Could you please repeat?"

            logging.info(f"💬 User message: '{latest_human_message}'")

            # Get ALL documents from knowledge base (not just relevant ones)
            knowledge_base = KnowledgeBase()

            # Check if we have any documents
            documents_count = knowledge_base.get_documents_count()
            logging.info(f"📚 Found {documents_count} documents in knowledge base")

            if documents_count == 0:
                logging.warning("No documents found in knowledge base")
                return "I don't have any documents loaded yet. Please upload some company documents first so I can help you."

            # Get all documents and send full content to LLM
            all_documents = []
            for doc_id, doc in knowledge_base.documents.items():
                logging.info(f"📄 Loading document: {doc_id} - {doc.get('title', 'Untitled')}")
                all_documents.append({
                    "title": doc["title"],
                    "content": doc["content"],
                    "categories": doc.get("categories", [])
                })

            # Prepare complete knowledge context
            knowledge_context = self._prepare_full_knowledge_context(all_documents)
            logging.info(f"📖 Prepared knowledge context: {len(knowledge_context)} characters")

            # Generate response using Hybrid LLM service (Ollama with Gemini fallback)
            llm_service = HybridLLMService()

            # Create agent persona dict for LLM
            agent_persona = {
                "agent_type": agent.agent_type.value,
                "personality": agent.personality,
                "name": agent.name
            }

            logging.info(f"🤖 Generating response with {agent.name} ({agent.agent_type.value})")
            response = await llm_service.generate_response(
                agent_persona,
                latest_human_message,
                knowledge_context
            )
            logging.info(f"✅ Generated response: {response[:100]}...")
            return response

        except Exception as e:
            logging.error(f"❌ Conversation engine error: {str(e)}")
            import traceback
            logging.error(f"Traceback: {traceback.format_exc()}")
            return f"I'm having trouble processing your request. Please try again."

    def _prepare_full_knowledge_context(self, all_documents: List[dict]) -> str:
        """Prepare complete knowledge context from all documents"""
        context_parts = []

        for doc in all_documents:
            title = doc.get('title', 'Document')
            content = doc.get('content', '')
            categories = doc.get('categories', [])

            # Include full document content (truncate only if extremely long)
            if len(content) > 5000:  # Only truncate if extremely long
                content = content[:5000] + "... [content truncated]"

            context_parts.append(f"Document Title: {title}")
            context_parts.append(f"Categories: {', '.join(categories)}")
            context_parts.append(f"Content: {content}")
            context_parts.append("---")

        return "\n".join(context_parts)

    async def _generate_knowledge_based_response(self, agent, human_message: str, relevant_docs: List[dict], conversation_log: List[dict]) -> str:
        """Generate response strictly based on knowledge base documents"""

        # Simple keyword matching and response generation
        response_parts = []

        for doc in relevant_docs[:2]:  # Use top 2 most relevant documents
            content = doc.get('content', '')
            title = doc.get('title', 'Document')

            # Extract relevant sentences
            sentences = content.split('.')
            relevant_sentences = []

            message_words = human_message.lower().split()

            for sentence in sentences:
                sentence_lower = sentence.lower()
                # Check if sentence contains keywords from human message
                if any(word in sentence_lower for word in message_words if len(word) > 3):
                    relevant_sentences.append(sentence.strip())
                    if len(relevant_sentences) >= 2:  # Max 2 sentences per doc
                        break

            if relevant_sentences:
                response_parts.extend(relevant_sentences)
            elif len(response_parts) == 0:
                # If no exact matches, provide a summary from the document
                first_sentences = sentences[:2]
                response_parts.extend([s.strip() for s in first_sentences if s.strip()])

        if not response_parts:
            return self._get_no_knowledge_response(agent)

        # Combine and format response in agent's style
        base_response = '. '.join(response_parts)

        # Keep response concise (max 200 chars for better voice synthesis)
        if len(base_response) > 200:
            base_response = base_response[:200] + "..."

        # Add agent personality
        if agent.agent_type.value == "sales":
            response = f"{base_response}. Would you like to know more about this?"
        elif agent.agent_type.value == "support":
            response = f"{base_response}. Does this help answer your question?"
        elif agent.agent_type.value == "healthcare":
            response = f"{base_response}. Do you have any other health-related questions?"
        else:
            response = f"{base_response}. Is there anything else you'd like to know?"

        return response

    async def process_speech_input(self, audio_data: bytes, agent_id: str) -> dict:
        """Process speech input and return speech response"""
        from .voice_processor import VoiceProcessor

        voice_processor = VoiceProcessor()

        try:
            # First validate the audio to provide better user guidance
            validation = voice_processor._validate_audio_data(audio_data)

            # Convert speech to text
            transcribed_text = await voice_processor.speech_to_text(audio_data)

            if not transcribed_text:
                # Provide specific guidance based on the audio validation
                if validation.get("recommendation"):
                    error_message = validation["error"]
                    fallback_response = validation["recommendation"]
                else:
                    # Generic fallback for other issues
                    if len(audio_data) < 1000:
                        error_message = "The audio recording is too short or contains only silence."
                        fallback_response = "I didn't hear any speech in your recording. Please try again - make sure to speak clearly for at least 2-3 seconds, and check that your microphone is working."
                    else:
                        error_message = "Could not understand the audio content."
                        fallback_response = "I'm having trouble understanding your audio. Please try speaking more clearly or check your microphone settings."

                logging.warning(f"Speech recognition failed for {len(audio_data)} bytes of audio: {error_message}")

                # Generate a helpful audio response
                try:
                    audio_response = await voice_processor.text_to_speech(fallback_response, agent_id)
                except Exception as e:
                    logging.error(f"Failed to generate TTS for error message: {e}")
                    audio_response = None

                return {
                    "success": False,
                    "error": error_message,
                    "transcribed_text": None,
                    "response_text": fallback_response,
                    "audio_response": audio_response,
                    "audio_validation": validation  # Include validation details for debugging
                }

            logging.info(f"✅ User said: '{transcribed_text}'")

            # Generate text response using LLM
            conversation_log = [{"speaker": "human", "message": transcribed_text, "timestamp": datetime.now().isoformat()}]
            response_text = await self.generate_response(agent_id, conversation_log, {})

            logging.info(f"✅ Agent response: '{response_text}'")

            # Convert response to speech
            audio_response = await voice_processor.text_to_speech(response_text, agent_id)

            return {
                "success": True,
                "transcribed_text": transcribed_text,
                "response_text": response_text,
                "audio_response": audio_response,
                "audio_validation": validation
            }

        except Exception as e:
            logging.error(f"❌ Speech processing error: {str(e)}")

            # Generate a fallback response
            fallback_response = "I'm experiencing technical difficulties with speech processing. Please try again or contact support if the problem persists."

            try:
                audio_response = await voice_processor.text_to_speech(fallback_response, agent_id)
            except Exception as tts_error:
                logging.error(f"Failed to generate TTS for fallback: {tts_error}")
                audio_response = None

            return {
                "success": False,
                "error": f"Speech processing failed: {str(e)}",
                "transcribed_text": None,
                "response_text": fallback_response,
                "audio_response": audio_response
            }
