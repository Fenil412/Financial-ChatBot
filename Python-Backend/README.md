# FinChatBot — Python AI Service

FastAPI-based AI service with RAG (Retrieval Augmented Generation), real chart generation, multi-language support, and agentic financial tools.

---

## Overview

- **Framework**: FastAPI + Uvicorn
- **LLM**: Groq (`llama-3.3-70b-versatile`)
- **Embeddings**: HuggingFace (`all-MiniLM-L6-v2`)
- **Vector DB**: FAISS (local, per-document namespace)
- **Port**: `8001`

---

## Setup

```bash
cd Python-Backend

# Activate your environment
conda activate your-env   # OR: venv\Scripts\activate

pip install -r requirements.txt

cp .env.example .env      # Fill in your API keys

python -m app.main
```

---

## Environment Variables

```env
GROQ_API_KEY=your_groq_key
OPENROUTER_API_KEY=your_openrouter_key
VISION_PROVIDER=openrouter
VISION_MODEL=qwen/qwen2.5-vl-72b-instruct:free
MODEL_NAME=llama-3.3-70b-versatile
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
NODE_BACKEND_URL=http://localhost:8000
PORT=8001
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/process-document` | Ingest document into FAISS vector store |
| `POST` | `/query` | RAG query with chart + suggestion generation |
| `POST` | `/delete-document` | Remove document vectors + file |
| `POST` | `/delete-documents` | Batch delete documents |
| `POST` | `/test-tools` | Test financial calculator tools |

### POST `/query` — Full Request/Response

**Request:**
```json
{
  "question": "Show me a pie chart of sales by region",
  "chatHistory": [{"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}],
  "vectorNamespaces": ["doc-uuid-abc123"],
  "featureUsed": "Smart_Chart"
}
```

**Response:**
```json
{
  "answer": "Here is your Pie Chart based on the document.",
  "chart_data": {
    "type": "pie",
    "title": "Sales By Region",
    "labels": ["North America", "Europe", "Asia"],
    "datasets": [{"label": "Sales", "data": [400000, 300000, 200000], "color": "#3b82f6"}]
  },
  "citations": [{"page": 3, "snippet": "North America: 400,000", "confidence": 0.97}],
  "tool_calls": [],
  "suggestions": ["Show bar chart instead", "What is the total sales?", "Compare with Q3"]
}
```

### `featureUsed` Values

| Mode | Value |
|------|-------|
| General Q&A | `General` |
| Document Analysis | `Document_Analysis` |
| Smart Chart | `Smart_Chart` |
| Insights | `Insights` |

---

## Query Pipeline

```
User Question
     │
     ▼
_is_pure_chart_request()?
     │
 YES ├──────────────────────────────────────────────────┐
     │                                                  │
     │  CHART BYPASS PIPELINE                           │
     │  _handle_chart_request()                         │
     │  ┌─ LLM: JSON-extraction-only prompt             │
     │  ├─ Fallback: _build_fallback_chart() (regex)    │
     │  └─ Returns: short text + ChartData JSON         │
     │                                                  │
 NO  │  RAG PIPELINE                                    │
     │  ┌─ FAISS vector search (top-K chunks)           │
     │  ├─ Needs calculation? → agent with tools        │
     │  ├─ Else → standard RAG prompt                   │
     │  ├─ _detect_chart_opportunity() → chart gen      │
     │  └─ _clean_answer() strips ASCII art             │
     │                                                  │
     └──────────────────────────────────────────────────┘
           │
           ▼
    _generate_suggestions() → 3 follow-up questions
           │
           ▼
      QueryResponse{answer, chart_data, citations, suggestions}
```

---

## Project Structure

```
Python-Backend/
├── app/
│   ├── main.py                   # FastAPI entry point
│   ├── api/
│   │   └── routes.py             # All HTTP endpoints
│   ├── agent/
│   │   ├── calculator.py         # Financial math tools
│   │   └── orchestrator.py       # Agent with tool calling
│   ├── config/
│   │   ├── settings.py           # Environment config (Pydantic)
│   │   └── prompts.py            # System prompts
│   ├── models/
│   │   └── schemas.py            # Request/Response Pydantic models
│   └── services/
│       ├── enhanced_rag_service.py  # Main RAG + chart service
│       ├── document_processor.py   # PDF → chunks → FAISS
│       ├── vector_store.py         # FAISS wrapper
│       └── rag_service.py          # Legacy simple RAG
├── vector_store/                 # FAISS indices (gitignored)
├── uploads/                      # Uploaded PDFs (gitignored)
├── requirements.txt
└── .env
```

---

## Chart Types Supported

| User says | Chart type |
|-----------|-----------|
| "bar chart", "bar graph", "column" | `bar` |
| "line chart", "line graph", "trend" | `line` |
| "pie chart", "pie", "donut" | `pie` |
| "area chart", "area graph" | `area` |

---

## Financial Tools (Agent)

| Tool | Description |
|------|-------------|
| `calculate(expr)` | Evaluate math expressions safely |
| `calculate_growth(old, new)` | YoY growth percentage |
| `calculate_ratio(num, den, name)` | Financial ratios (ROE, etc.) |
| `calculate_cagr(start, end, years)` | CAGR calculation |
| `calculate_margin(profit, revenue, type)` | Profit/net margin |
