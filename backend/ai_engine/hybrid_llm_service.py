#!/usr/bin/env python3
"""
Hybrid LLM Service - Ollama with Gemini API fallback
Tests for Ollama availability for 10 seconds, then falls back to Gemini API
"""

import requests
import json
import logging
import asyncio
import google.generativeai as genai
from typing import List, Dict, Optional

class HybridLLMService:
    def __init__(self, ollama_base_url: str = "http://localhost:11434", gemini_api_key: str = "AIzaSyDJyXuRJ1XS7gFJ4iCOWBR02WhPSlPDVmI"):
        self.ollama_base_url = ollama_base_url
        self.ollama_model = "llama3.2:latest"
        self.gemini_api_key = gemini_api_key
        self.use_ollama = None  # Will be determined after health check

        # Configure Gemini with free tier model
        genai.configure(api_key=self.gemini_api_key)
        self.gemini_model = genai.GenerativeModel('gemini-2.0-flash-exp')  # Free tier model

    async def _check_ollama_availability(self) -> bool:
        """Check if Ollama is available with 10-second timeout"""
        try:
            response = await asyncio.wait_for(
                asyncio.to_thread(
                    requests.get,
                    f"{self.ollama_base_url}/api/tags",
                    timeout=10
                ),
                timeout=10.0
            )
            return response.status_code == 200
        except Exception as e:
            logging.warning(f"Ollama not available: {str(e)}")
            return False

    async def generate_response(self, agent_persona: dict, user_message: str, knowledge_context: str) -> str:
        """Generate response using Ollama or Gemini fallback"""

        # Check Ollama availability if not already determined
        if self.use_ollama is None:
            logging.info("Testing Ollama availability...")
            self.use_ollama = await self._check_ollama_availability()
            if self.use_ollama:
                logging.info("Using Ollama for LLM generation")
            else:
                logging.info("Ollama not available, using Gemini API fallback")

        if self.use_ollama:
            try:
                return await self._generate_ollama_response(agent_persona, user_message, knowledge_context)
            except Exception as e:
                logging.error(f"Ollama failed: {str(e)}, switching to Gemini")
                self.use_ollama = False  # Switch to Gemini for future requests
                return await self._generate_gemini_response(agent_persona, user_message, knowledge_context)
        else:
            return await self._generate_gemini_response(agent_persona, user_message, knowledge_context)

    async def _generate_ollama_response(self, agent_persona: dict, user_message: str, knowledge_context: str) -> str:
        """Generate response using Ollama"""

        # Create improved prompt that encourages meaningful extraction from documents
        system_prompt = f"""You are representing the organization that created the documents provided below. Speak as "we" and "our".

CRITICAL RULES:
1. ONLY use information from the Document Content below
2. When asked about differences, uniqueness, or comparisons, extract SPECIFIC features, numbers, and capabilities from the documents
3. Speak as the organization: use "we", "our", "us"
4. If documents contain NO relevant information, say: "I can only provide information based on our available documentation."
5. Be SPECIFIC - mention actual features, numbers, capabilities from the documents
6. Keep responses 2-4 sentences, but pack them with ACTUAL INFORMATION from documents
7. Never say generic things like "I'm here to help" - always provide real content from documents

Your role: {agent_persona.get('personality', {}).get('goal', 'Represent the organization')}"""

        # Create the main prompt with document content embedded
        main_prompt = f"""
DOCUMENT CONTENT:
{knowledge_context}

END OF DOCUMENT CONTENT

User Question: {user_message}

TASK: Answer using SPECIFIC details from the documents above. If asked about differences or uniqueness, extract and mention CONCRETE features, numbers, or capabilities. Speak as the organization representative using "we/our".

Response:"""

        try:
            # Call Ollama API with correct Ollama parameters
            response = requests.post(
                f"{self.ollama_base_url}/api/generate",
                json={
                    "model": self.ollama_model,
                    "prompt": main_prompt,
                    "system": system_prompt,
                    "stream": False,
                    "options": {
                        "temperature": 0.3,
                        "top_p": 0.9,
                        "num_predict": 200,
                        "repeat_penalty": 1.1,
                    }
                },
                timeout=45
            )

            if response.status_code == 200:
                result = response.json()
                generated_text = result.get("response", "").strip()

                # Clean and validate the response
                cleaned_response = self._clean_and_validate_response(generated_text, knowledge_context, user_message)
                return cleaned_response

            else:
                logging.error(f"Ollama API error: {response.status_code}, falling back to Gemini")
                self.use_ollama = False  # Switch to Gemini for future requests
                return await self._generate_gemini_response(agent_persona, user_message, knowledge_context)

        except Exception as e:
            logging.error(f"Ollama error: {str(e)}, falling back to Gemini")
            self.use_ollama = False  # Switch to Gemini for future requests
            return await self._generate_gemini_response(agent_persona, user_message, knowledge_context)

    async def _generate_gemini_response(self, agent_persona: dict, user_message: str, knowledge_context: str) -> str:
        """Generate response using Gemini API"""

        # Combine everything into a single well-structured prompt for Gemini
        full_prompt = f"""You are representing the organization that created these documents. Answer the user's question using ONLY information from the documents below.

RULES:
1. Extract SPECIFIC features, numbers, and capabilities from the documents
2. Speak as the organization using "we", "our", "us"
3. If asked about differences or uniqueness, mention CONCRETE details from the documents
4. If no relevant information exists, say: "I can only provide information based on our available documentation."
5. Keep response 2-4 sentences with ACTUAL INFORMATION
6. NEVER say "Understood" or "I will represent" - JUST ANSWER THE QUESTION DIRECTLY

===== DOCUMENT CONTENT =====
{knowledge_context}
===== END OF DOCUMENTS =====

USER QUESTION: {user_message}

YOUR RESPONSE (speak as the organization, extract specific details from documents above):"""

        try:
            # Generate response using Gemini
            response = await asyncio.to_thread(
                self.gemini_model.generate_content,
                full_prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.4,
                    top_p=0.95,
                    max_output_tokens=250,
                )
            )

            generated_text = response.text.strip() if response.text else ""

            # Log what we got
            logging.info(f"📝 Gemini raw response: {generated_text[:150]}...")

            # Clean and validate the response
            cleaned_response = self._clean_and_validate_response(generated_text, knowledge_context, user_message)
            return cleaned_response

        except Exception as e:
            logging.error(f"Gemini API error: {str(e)}")
            return "I apologize, but I'm having trouble processing your request right now. Please try again."

    def _clean_and_validate_response(self, response: str, knowledge_context: str, user_message: str = "") -> str:
        """Clean and validate that the response is based on document content"""

        # Remove common LLM artifacts
        response = response.replace("Assistant:", "").replace("AI:", "")
        response = response.replace("Response:", "").replace("Your Response:", "").strip()

        # Remove the generic fallback if it appears
        if "I'm here to provide support based on our documentation" in response:
            # This means the LLM couldn't find relevant info, which is actually valid
            # But we should return a more specific message
            return "I can only provide information based on our available documentation. Please ask about topics covered in our materials."

        # Check if response is too short (but not the valid fallback message)
        if len(response) < 15 and "documentation" not in response.lower():
            logging.warning(f"Response too short: '{response}'")
            return "I can only provide information based on our available documentation. Please ask about topics covered in our materials."

        # Add period if needed
        if not response.endswith(('?', '.', '!', ')', '"')):
            response += "."

        logging.info(f"✅ Agent response: '{response[:100]}...'")
        return response

    def _get_fallback_response(self, agent_persona: dict) -> str:
        """Get fallback response when both services fail"""
        agent_type = agent_persona.get("agent_type", "support")

        if agent_type == "sales":
            return "I'm here to help you with information about our products and services. How can I assist you today?"
        elif agent_type == "support":
            return "I'm here to provide support based on our documentation. How can I help you?"
        else:
            return "I'm here to assist you with information from our knowledge base. What would you like to know?"
