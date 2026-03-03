"""
Application Configuration
Loads environment variables and provides settings throughout the app
"""

from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    """
    Application settings loaded from environment variables
    """
    
    # AI API Keys (Supports Groq, OpenRouter, and Google Gemini)
    GROQ_API_KEY: str = ""
    OPENROUTER_API_KEY: str = ""
    GOOGLE_API_KEY: str = ""
    
    # Optional: Your site URL and app name (for OpenRouter)
    OPENROUTER_SITE_URL: str = "http://localhost:5173"
    OPENROUTER_APP_NAME: str = "FinChatBot"
    
    # Node.js Backend URL (for webhook callbacks)
    NODE_WEBHOOK_URL: str = "http://localhost:8000"
    
    # Server Configuration
    PORT: int = 5000
    
    # Vector Store Configuration
    VECTOR_STORE_PATH: str = "./vector_store"  # Local directory for FAISS indices
    
    # Embedding Model Configuration
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    
    # LLM Configuration
    LLM_MODEL: str = "llama-3.1-8b-instant"  # Default model
    LLM_TEMPERATURE: float = 0.0
    LLM_MAX_TOKENS: int = 2000
    
    # Document Processing Configuration
    CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 150
    
    # Retrieval Configuration
    TOP_K_RESULTS: int = 5
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"  # Allow extra fields in .env without crashing

# Create global settings instance
settings = Settings()

# Ensure vector store directory exists
os.makedirs(settings.VECTOR_STORE_PATH, exist_ok=True)
