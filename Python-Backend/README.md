# FinChatBot - Python AI Service

The AI engine of the Financial ChatBot, providing Retrieval-Augmented Generation (RAG) capabilities for deep document analysis.

## Tech Stack

- **FastAPI** - High-performance web framework
- **LangChain** - RAG pipeline orchestration
- **FAISS** - Local vector database
- **Groq/OpenRouter** - LLM providers (Llama 3.1)
- **HuggingFace** - Local embeddings (`all-MiniLM-L6-v2`)
- **PyPDF/MuPDF** - PDF processing

## Project Structure

```text
Python-Backend/
├── app/
│   ├── api/              # FastAPI route handlers
│   ├── config/           # Application settings and prompt templates
│   ├── models/           # Pydantic data models
│   ├── services/         # Core RAG, Vector Store, and Doc processing logic
│   └── main.py           # Application entry point
├── vector_store/         # Local storage for FAISS indices
├── requirements.txt      # Python dependencies
└── .env                  # Environment variables (API Keys)
```

## Getting Started

### Prerequisites

- Python 3.10 or 3.11 (Recommended)
  - *Note: Python 3.14 is currently too new for some dependencies.*
- Anaconda or Miniconda (Recommended for environment management)

### Installation (via Anaconda)

1. Create a stable environment:
   ```powershell
   conda create -n finchatbot python=3.12 -y
   conda activate finchatbot
   ```

2. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```

3. Configure Environment:
   Rename `.env.example` to `.env` and add your **GROQ_API_KEY**.

### Running the Service

Start the service using the interpreter from your environment:
```powershell
python -m app.main
```

The service will be available at [http://localhost:5000](http://localhost:5000).
Interactive documentation: [http://localhost:5000/docs](http://localhost:5000/docs)

## Key Features

- **Multi-Mode RAG**: Supports Smart Chat, Document Analysis, and Analytical Insights.
- **Local Embeddings**: Uses Sentence-Transformers for fast, privacy-preserving vector search.
- **High Performance**: Powered by Groq for ultra-fast LLM responses.
- **Scalable Document Processing**: Efficiently chunks and indexes large financial documents.
