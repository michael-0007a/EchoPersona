#!/usr/bin/env python3
"""
Simple Conversation Engine - From Scratch
Basic implementation that actually works
"""

import logging
from datetime import datetime
from typing import Optional

class SimpleConversationEngine:
    def __init__(self):
        self.simple_speech_processor = None

    def get_speech_processor(self):
        """Get the simple speech processor"""
        if self.simple_speech_processor is None:
            from simple_speech_processor import SimpleSpeechProcessor
            self.simple_speech_processor = SimpleSpeechProcessor()
        return self.simple_speech_processor

    async def process_speech_simple(self, audio_data: bytes, agent_id: str) -> dict:
        """Simple speech processing that actually works"""
        try:
            logging.info(f"🚀 SimpleConversationEngine: Processing speech for agent {agent_id}")

            # Get speech processor
            speech_processor = self.get_speech_processor()

            # Process audio to text
            transcribed_text = await speech_processor.process_audio(audio_data)

            if not transcribed_text:
                return {
                    "success": False,
                    "error": "Failed to process audio",
                    "transcribed_text": None,
                    "response_text": "I couldn't understand that. Please try again.",
                    "audio_response": None
                }

            logging.info(f"✅ Transcribed: '{transcribed_text}'")

            # Generate simple response (no complex LLM for now)
            response_text = self._generate_simple_response(transcribed_text, agent_id)

            logging.info(f"✅ Generated response: '{response_text}'")

            # Convert response to speech
            audio_response = await speech_processor.text_to_speech(response_text)

            return {
                "success": True,
                "transcribed_text": transcribed_text,
                "response_text": response_text,
                "audio_response": audio_response
            }

        except Exception as e:
            logging.error(f"❌ SimpleConversationEngine error: {e}")

            # Always return something for testing
            fallback_response = "I'm having some technical difficulties, but I'm here to help you."

            try:
                speech_processor = self.get_speech_processor()
                audio_response = await speech_processor.text_to_speech(fallback_response)
            except:
                audio_response = None

            return {
                "success": False,
                "error": str(e),
                "transcribed_text": None,
                "response_text": fallback_response,
                "audio_response": audio_response
            }

    def _generate_simple_response(self, user_input: str, agent_id: str) -> str:
        """Generate simple rule-based responses"""
        user_lower = user_input.lower()

        # Handle mock testing scenarios
        if any(word in user_lower for word in ['testing', 'microphone', 'test', 'can you hear']):
            return "Yes, I can hear you perfectly! Your microphone is working great. What can I help you with today?"

        # Simple keyword-based responses
        if any(word in user_lower for word in ['hello', 'hi', 'hey', 'good morning', 'good afternoon']):
            return "Hello! Welcome! I'm here to help you with any questions about our services or products. What would you like to know?"

        elif any(word in user_lower for word in ['help', 'support', 'assist', 'problem']):
            return "I'm here to help you! I can provide information about our services, products, pricing, and business hours. What specific assistance do you need?"

        elif any(word in user_lower for word in ['services', 'products', 'what do you do', 'business', 'company']):
            return "We offer a variety of services and products designed to meet your needs. I can provide detailed information about any specific area you're interested in. What would you like to learn more about?"

        elif any(word in user_lower for word in ['hours', 'time', 'when', 'open', 'available']):
            return "Our business hours are Monday through Friday, 9 AM to 5 PM. We're also available for online support. Is there something specific you need help with right now?"

        elif any(word in user_lower for word in ['price', 'cost', 'pricing', 'how much', 'expensive', 'cheap']):
            return "I'd be happy to discuss pricing options with you. Our rates vary depending on the specific services you need. Could you tell me what particular service or product you're interested in?"

        elif any(word in user_lower for word in ['thank', 'thanks', 'appreciate']):
            return "You're very welcome! I'm glad I could help. Is there anything else you'd like to know about our services or products?"

        elif any(word in user_lower for word in ['bye', 'goodbye', 'see you', 'have a good']):
            return "Thank you for contacting us today! It was great talking with you. Have a wonderful day, and don't hesitate to reach out if you need anything else!"

        elif any(word in user_lower for word in ['who are you', 'what are you', 'about you']):
            return "I'm your AI assistant, here to help answer questions and provide information about our company's services and products. How can I assist you today?"

        elif any(word in user_lower for word in ['contact', 'phone', 'email', 'reach']):
            return "You can contact us through this chat system, or during business hours at our main office. What's the best way we can help you right now?"

        else:
            # More engaging generic response
            return f"I heard you say '{user_input}'. That's interesting! I'd love to help you with that. Could you tell me a bit more about what you're looking for or how I can assist you?"
