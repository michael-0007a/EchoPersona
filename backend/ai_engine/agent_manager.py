#!/usr/bin/env python3
"""
AI Agent Manager - Core system for managing multiple AI personas
"""

import json
import os
from typing import Dict, List, Optional
from datetime import datetime
from enum import Enum

class AgentType(Enum):
    SALES = "sales"
    SUPPORT = "support"
    HEALTHCARE = "healthcare"
    SURVEY = "survey"
    REMINDER = "reminder"
    LEAD_GENERATION = "lead_generation"

class AgentPersona:
    def __init__(self, agent_id: str, name: str, agent_type: AgentType,
                 voice_settings: dict, personality: dict, knowledge_base: List[str]):
        self.agent_id = agent_id
        self.name = name
        self.agent_type = agent_type
        self.voice_settings = voice_settings
        self.personality = personality
        self.knowledge_base = knowledge_base
        self.created_at = datetime.now()
        self.conversation_memory = {}

class AgentManager:
    def __init__(self):
        self.agents = {}
        self.agents_file = "backend/data/agents.json"
        self._ensure_data_dir()
        self.load_agents()

    def _ensure_data_dir(self):
        """Ensure data directory exists"""
        os.makedirs("backend/data", exist_ok=True)

    def load_agents(self):
        """Load agents from file or create defaults"""
        if os.path.exists(self.agents_file):
            try:
                with open(self.agents_file, 'r', encoding='utf-8') as f:
                    agents_data = json.load(f)

                for agent_data in agents_data:
                    agent = AgentPersona(
                        agent_id=agent_data["agent_id"],
                        name=agent_data["name"],
                        agent_type=AgentType(agent_data["agent_type"]),
                        voice_settings=agent_data["voice_settings"],
                        personality=agent_data["personality"],
                        knowledge_base=agent_data.get("knowledge_base", [])
                    )
                    self.agents[agent.agent_id] = agent

                print(f"✅ Loaded {len(self.agents)} agents from storage")
            except Exception as e:
                print(f"⚠️ Error loading agents: {e}, creating defaults")
                self.load_default_agents()
        else:
            self.load_default_agents()

    def save_agents(self):
        """Save agents to file"""
        try:
            agents_data = []
            for agent in self.agents.values():
                agents_data.append({
                    "agent_id": agent.agent_id,
                    "name": agent.name,
                    "agent_type": agent.agent_type.value,
                    "voice_settings": agent.voice_settings,
                    "personality": agent.personality,
                    "knowledge_base": agent.knowledge_base
                })

            with open(self.agents_file, 'w', encoding='utf-8') as f:
                json.dump(agents_data, f, indent=2, ensure_ascii=False)

            print(f"✅ Saved {len(agents_data)} agents to storage")
        except Exception as e:
            print(f"❌ Error saving agents: {e}")

    def load_default_agents(self):
        """Load default agent personas"""
        default_agents = [
            {
                "agent_id": "support_agent",
                "name": "AI Assistant",
                "agent_type": AgentType.SUPPORT,
                "voice_settings": {
                    "language": "en",
                    "gender": "female",
                    "tone": "helpful",
                    "speed": 1.0,
                    "emotion": "professional"
                },
                "personality": {
                    "greeting": "Hello! I'm your AI assistant. I can help you with questions based on the documents I have access to.",
                    "style": "helpful, professional, document-focused",
                    "goal": "Provide accurate information based only on available documents",
                    "approach": "strict adherence to document content only"
                },
                "knowledge_base": ["support", "general", "documentation"]
            }
        ]

        for agent_data in default_agents:
            agent = AgentPersona(**agent_data)
            self.agents[agent.agent_id] = agent

        # Save defaults to file
        self.save_agents()

    def create_custom_agent(self, agent_data: dict) -> str:
        """Create a custom agent persona"""
        agent = AgentPersona(
            agent_id=agent_data["agent_id"],
            name=agent_data["name"],
            agent_type=AgentType(agent_data["agent_type"]),
            voice_settings=agent_data["voice_settings"],
            personality=agent_data["personality"],
            knowledge_base=agent_data.get("knowledge_base", [])
        )
        self.agents[agent.agent_id] = agent

        # Save to persistent storage
        self.save_agents()

        return agent.agent_id

    def get_agent(self, agent_id: str) -> Optional[AgentPersona]:
        """Get agent by ID"""
        return self.agents.get(agent_id)

    def list_agents(self) -> List[dict]:
        """List all available agents"""
        return [
            {
                "agent_id": agent.agent_id,
                "name": agent.name,
                "type": agent.agent_type.value,
                "voice_settings": agent.voice_settings
            }
            for agent in self.agents.values()
        ]

    def update_agent_memory(self, agent_id: str, contact_id: str, conversation_data: dict):
        """Update agent's conversation memory for persistent context"""
        if agent_id in self.agents:
            if contact_id not in self.agents[agent_id].conversation_memory:
                self.agents[agent_id].conversation_memory[contact_id] = []

            self.agents[agent_id].conversation_memory[contact_id].append({
                "timestamp": datetime.now().isoformat(),
                "data": conversation_data
            })

    def get_agent_memory(self, agent_id: str, contact_id: str) -> List[dict]:
        """Get conversation history for persistent context"""
        if agent_id in self.agents:
            return self.agents[agent_id].conversation_memory.get(contact_id, [])
        return []

    def delete_agent(self, agent_id: str) -> bool:
        """Delete an agent by ID"""
        if agent_id in self.agents:
            del self.agents[agent_id]
            self.save_agents()
            print(f"✅ Deleted agent: {agent_id}")
            return True
        print(f"❌ Agent not found: {agent_id}")
        return False
