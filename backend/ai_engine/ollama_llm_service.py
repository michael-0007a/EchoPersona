#!/usr/bin/env python3
"""
LLM Service - Ollama integration for document-based responses only
"""

import requests
import json
import logging
from typing import List, Dict, Optional

class OllamaLLMService:
    def __init__(self, base_url: str = "http://localhost:11434"):
        self.base_url = base_url
        self.model = "llama3.2:latest"

    async def generate_response(self, agent_persona: dict, user_message: str, knowledge_context: str) -> str:
        """Generate response using Ollama based strictly on knowledge context"""

        # Create very strict prompt that forces model to use only provided context
        system_prompt = f"""You are a helpful AI assistant representing the organization/company that created the documents provided. You should speak from the perspective of the document owner.

CRITICAL RULES:
1. You must ONLY use information from the Document Content provided below
2. Speak as if you are representing the organization that created these documents (use "we", "our", "us")
3. If the user asks about anything NOT in the Document Content, respond with: "I can only provide information based on our available documentation. Please ask about topics covered in our materials."
4. Never make up information or use external knowledge
5. Keep responses conversational and speak as the document owner/organization representative
6. KEEP RESPONSES CONCISE AND CRISP - aim for 1-3 sentences maximum
7. Get straight to the point - no lengthy explanations
8. If no relevant information exists in the Document Content for the question, use the fallback response from rule 3

Your role: {agent_persona.get('personality', {}).get('goal', 'Represent the organization and provide information from our documents')}

Examples of how to speak:
- Instead of "According to the document, DeepFashion will..." say "Our DeepFashion dataset will..."
- Instead of "The dataset contains..." say "We provide..."
- Instead of "The research shows..." say "Our research demonstrates..."

RESPONSE STYLE: Concise, direct, and to the point. Maximum 2-3 sentences.
"""

        # Create the main prompt with document content embedded
        main_prompt = f"""
DOCUMENT CONTENT (These are YOUR organization's documents):
{knowledge_context}

END OF DOCUMENT CONTENT

User Question: {user_message}

Instructions: Answer the user's question using ONLY the information from YOUR organization's document content above. Speak as a representative of the organization that created these documents. Use "we", "our", "us" to refer to your organization. 

IMPORTANT: Keep your response SHORT and DIRECT - maximum 2-3 sentences. Get straight to the key points without elaboration.

Your concise response as the organization representative:"""

        try:
            # Call Ollama API with correct Ollama parameters
            response = requests.post(
                f"{self.base_url}/api/generate",
                json={
                    "model": self.model,
                    "prompt": main_prompt,
                    "system": system_prompt,
                    "stream": False,
                    "options": {
                        "temperature": 0.2,
                        "top_p": 0.8,
                        "num_predict": 150,  # Reduced for concise responses
                        "repeat_penalty": 1.1,
                        "stop": ["\n\nUser:", "Document Content:", "END OF DOCUMENT", ".", "!", "?"]  # Stop at sentence endings
                    }
                },
                timeout=45  # Increased timeout for longer responses
            )

            if response.status_code == 200:
                result = response.json()
                generated_text = result.get("response", "").strip()

                # Clean and validate the response
                cleaned_response = self._clean_and_validate_response(generated_text, knowledge_context)
                return cleaned_response

            else:
                logging.error(f"Ollama API error: {response.status_code}")
                return self._get_fallback_response(agent_persona)

        except requests.exceptions.RequestException as e:
            logging.error(f"Ollama connection error: {str(e)}")
            return self._get_fallback_response(agent_persona)
        except Exception as e:
            logging.error(f"LLM generation error: {str(e)}")
            return self._get_fallback_response(agent_persona)

    def _clean_and_validate_response(self, response: str, knowledge_context: str) -> str:
        """Clean and validate that the response is based on document content"""

        # Remove common LLM artifacts
        response = response.replace("Assistant:", "").replace("AI:", "")
        response = response.replace("Response:", "").replace("Your Response:", "").strip()

        # Check if response seems to be from documents (basic validation)
        if len(response) < 10:
            return "I can only provide information based on our available documentation. Please ask about topics covered in our materials."

        # Add helpful ending if needed
        if not response.endswith(('?', '.', '!')):
            response += "."

        return response

    def _create_system_prompt(self, agent_persona: dict, knowledge_context: str) -> str:
        """Create system prompt based on agent persona"""

        agent_type = agent_persona.get("agent_type", "support")
        personality = agent_persona.get("personality", {})

        base_prompt = f"""You are a {agent_type} representative for this company. 

Your personality: {personality.get('style', 'professional and helpful')}
Your goal: {personality.get('goal', 'assist customers effectively')}

CRITICAL RULES:
1. You can ONLY use information provided in the Context section
2. If asked about something not in the Context, say "I don't have that information in my current knowledge base, but I can help you with [mention what you do have]"
3. Stay in character as a {agent_type} agent
4. Keep responses concise and helpful
5. Never make up information not in the Context"""

        return base_prompt

    def _clean_response(self, response: str, agent_persona: dict) -> str:
        """Clean and format the LLM response"""

        # Remove common LLM artifacts
        response = response.replace("Assistant:", "").replace("AI:", "")
        response = response.replace("Response:", "").strip()

        # Ensure it's not too long (for voice synthesis)
        sentences = response.split('.')
        if len(sentences) > 3:
            response = '. '.join(sentences[:3]) + '.'

        # Add agent-specific closing if needed
        agent_type = agent_persona.get("agent_type", "support")
        if not response.endswith(('?', '.', '!')):
            if agent_type == "sales":
                response += ". Would you like to know more?"
            elif agent_type == "support":
                response += ". Can I help you with anything else?"
            else:
                response += "."

        return response

    def _get_fallback_response(self, agent_persona: dict) -> str:
        """Provide fallback response when LLM fails"""
        agent_type = agent_persona.get("agent_type", "support")

        fallback_responses = {
            "sales": "I apologize, I'm having technical difficulties right now. Let me help you with our available products and services.",
            "support": "I'm experiencing some technical issues. Let me assist you with our standard support procedures.",
            "healthcare": "I'm having connectivity issues. Let me help you with our basic health service information.",
        }

        return fallback_responses.get(agent_type, "I'm experiencing technical difficulties. Please try again in a moment.")

    def test_connection(self) -> bool:
        """Test connection to Ollama server"""
        try:
            response = requests.get(f"{self.base_url}/api/tags", timeout=5)
            return response.status_code == 200
        except:
            return False

    def get_available_models(self) -> List[str]:
        """Get list of available models from Ollama"""
        try:
            response = requests.get(f"{self.base_url}/api/tags", timeout=5)
            if response.status_code == 200:
                data = response.json()
                return [model["name"] for model in data.get("models", [])]
            return []
        except:
            return []
