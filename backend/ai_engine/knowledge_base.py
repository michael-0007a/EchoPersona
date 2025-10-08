#!/usr/bin/env python3
"""
Knowledge Base - Manages agent-specific documents and provides document-based responses only
"""

import json
import os
import logging
from typing import List, Dict, Optional
import PyPDF2
from docx import Document
import re

class KnowledgeBase:
    def __init__(self):
        self.knowledge_path = "backend/data/knowledge"
        os.makedirs(self.knowledge_path, exist_ok=True)

        # Load existing documents
        self.documents = self._load_documents()

    def _load_documents(self) -> Dict:
        """Load documents from storage"""
        documents_file = os.path.join(self.knowledge_path, "documents.json")

        if os.path.exists(documents_file):
            try:
                with open(documents_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)

                # Handle legacy array format - convert to proper dict format
                if isinstance(data, list):
                    logging.warning("Converting legacy documents format to new format")
                    converted_docs = {}
                    for i, item in enumerate(data):
                        if isinstance(item, dict):
                            # Convert old format chunks to content
                            if 'chunks' in item:
                                content = ' '.join(item['chunks']) if isinstance(item['chunks'], list) else str(item.get('chunks', ''))
                            else:
                                content = item.get('content', '')

                            doc_id = f"legacy_doc_{i}"
                            converted_docs[doc_id] = {
                                "title": item.get('title', f"Document {i+1}"),
                                "content": content,
                                "categories": item.get('categories', ['general']),
                                "created_at": "2024-01-01T00:00:00",
                                "word_count": len(content.split()) if content else 0
                            }

                    # Save in new format
                    self.documents = converted_docs
                    self._save_documents()
                    return converted_docs

                # Handle proper dict format
                elif isinstance(data, dict):
                    return data
                else:
                    logging.error(f"Invalid documents format: {type(data)}")
                    return {}

            except Exception as e:
                logging.error(f"Error loading documents: {str(e)}")
                return {}

        return {}

    def _save_documents(self):
        """Save documents to storage"""
        documents_file = os.path.join(self.knowledge_path, "documents.json")

        try:
            with open(documents_file, 'w', encoding='utf-8') as f:
                json.dump(self.documents, f, indent=2, ensure_ascii=False)
        except Exception as e:
            logging.error(f"Error saving documents: {str(e)}")

    def add_document(self, doc_id: str, title: str, content: str, categories: List[str]) -> bool:
        """Add a document to the knowledge base"""
        try:
            # Ensure categories is a list
            if isinstance(categories, str):
                categories = [categories]
            elif not isinstance(categories, list):
                categories = ['general']

            self.documents[doc_id] = {
                "title": title,
                "content": content,
                "categories": categories,
                "created_at": "2024-01-01T00:00:00",
                "word_count": len(content.split())
            }

            self._save_documents()
            return True

        except Exception as e:
            logging.error(f"Error adding document: {str(e)}")
            return False

    def get_documents_count(self) -> int:
        """Get the total number of documents"""
        return len(self.documents)

    def delete_document(self, doc_id: str) -> bool:
        """Delete a document from the knowledge base"""
        try:
            if doc_id in self.documents:
                del self.documents[doc_id]
                self._save_documents()
                return True
            return False
        except Exception as e:
            logging.error(f"Error deleting document: {str(e)}")
            return False

    async def search_documents(self, query: str, categories: List[str] = None) -> List[Dict]:
        """Search documents based on query and return relevant content"""
        try:
            query_words = query.lower().split()
            relevant_docs = []

            for doc_id, doc in self.documents.items():
                # Ensure doc is a dictionary
                if not isinstance(doc, dict):
                    continue

                # Filter by categories if specified
                if categories:
                    doc_categories = doc.get("categories", [])
                    if not isinstance(doc_categories, list):
                        doc_categories = [doc_categories] if doc_categories else []

                    if not any(cat in doc_categories for cat in categories):
                        continue

                content = doc.get("content", "")
                title = doc.get("title", "")

                if not isinstance(content, str):
                    content = str(content)
                if not isinstance(title, str):
                    title = str(title)

                content_lower = content.lower()
                title_lower = title.lower()

                # Calculate relevance score
                score = 0

                # Check title matches (higher weight)
                for word in query_words:
                    if len(word) > 2:  # Skip very short words
                        if word in title_lower:
                            score += 3
                        if word in content_lower:
                            score += 1

                if score > 0:
                    relevant_docs.append({
                        "doc_id": doc_id,
                        "title": title,
                        "content": content,
                        "categories": doc.get("categories", []),
                        "relevance_score": score
                    })

            # Sort by relevance score
            relevant_docs.sort(key=lambda x: x["relevance_score"], reverse=True)

            return relevant_docs[:5]  # Return top 5 most relevant

        except Exception as e:
            logging.error(f"Error searching documents: {str(e)}")
            return []

    def extract_text_from_pdf(self, file_path: str) -> str:
        """Extract text from PDF file"""
        try:
            text = ""
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
            return text.strip()
        except Exception as e:
            logging.error(f"Error extracting PDF text: {str(e)}")
            return ""

    def extract_text_from_docx(self, file_path: str) -> str:
        """Extract text from DOCX file"""
        try:
            doc = Document(file_path)
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text.strip()
        except Exception as e:
            logging.error(f"Error extracting DOCX text: {str(e)}")
            return ""
