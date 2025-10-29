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
    
    # Google Gemini API Key (required for AI responses)
    GOOGLE_API_KEY: str
    
    # Node.js Backend URL (for webhook callbacks)
    NODE_WEBHOOK_URL: str = "http://localhost:8000"
    
    # Server Configuration
    PORT: int = 5000
    
    # Vector Store Configuration
    VECTOR_STORE_PATH: str = "./vector_store"  # Local directory for FAISS indices
    
    # Embedding Model Configuration
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    
    # LLM Configuration
    LLM_MODEL: str = "gemini-2.0-flash-exp"
    LLM_TEMPERATURE: float = 0.0
    
    # Document Processing Configuration
    CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 150
    
    # Retrieval Configuration
    TOP_K_RESULTS: int = 5  # Number of relevant chunks to retrieve
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create global settings instance
settings = Settings()

# Ensure vector store directory exists
os.makedirs(settings.VECTOR_STORE_PATH, exist_ok=True)
