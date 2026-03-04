# 💰 FinChatBot — AI-Powered Financial Analysis Chatbot

> An intelligent, multi-language financial chatbot that analyzes uploaded documents, generates real-time charts, answers questions in 3 languages, and exports reports to PDF, Excel, and Word.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [ER Diagram](#er-diagram)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Features](#features)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

---

## 🧠 Overview

FinChatBot is a full-stack AI application that lets users:
1. Upload financial PDFs/documents
2. Ask questions in **English, Hindi, or Gujarati**
3. Get AI-powered answers with **real rendered charts** (bar, line, pie, area)
4. Receive **smart follow-up suggestions** after every response
5. Switch between **4 feature modes**: General, Document Analysis, Smart Chart, Insights
6. Export conversations to **PDF, Excel (.xlsx), or Word (.doc)**

### Architecture Overview

```
╔══════════════════════════════════════════════════════════════╗
║                        FRONTEND (React)                      ║
║            Port 5173 — Vite + Tailwind + Recharts            ║
╚══════════════════╦══════════════════════════════════════════╝
                   ║ HTTP / WebSocket
       ┌───────────▼───────────┐
       │   NODE.JS BACKEND      │  ← REST API + Socket.IO
       │     Port 8000          │  ← Conversations, Documents, Auth
       │   Express + MongoDB    │
       └───────────┬────────────┘
                   ║ HTTP (internal)
       ┌───────────▼───────────┐
       │   PYTHON AI SERVICE    │  ← FastAPI + RAG
       │     Port 8001          │  ← LLM, Charts, Vector Search
       │ LangChain + FAISS      │
       └───────────────────────┘
```

---

## 🔩 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS, Recharts, jsPDF, xlsx, html2canvas |
| **Node.js API** | Express.js, MongoDB, Mongoose, Socket.IO, Multer, Axios |
| **Python AI** | FastAPI, LangChain, FAISS, Groq LLM, HuggingFace Embeddings |
| **Database** | MongoDB Atlas (cloud) |
| **AI/LLM** | Groq (llama-3.3-70b), OpenRouter (vision models) |
| **Vector DB** | FAISS (local, per document namespace) |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER (Browser)                           │
└──────────────────────────┬──────────────────────────────────────┘
                           │  HTTPS
┌──────────────────────────▼──────────────────────────────────────┐
│                    FRONTEND  :5173                               │
│  ┌─────────────┐ ┌────────────┐ ┌───────────┐ ┌─────────────┐  │
│  │ ChatPageNew │ │ ChatWindow │ │ ChartCard │ │ExportReports│  │
│  │ (state mgmt)│ │(UI + modes)│ │(Recharts) │ │(PDF/Excel)  │  │
│  └──────┬──────┘ └─────┬──────┘ └─────┬─────┘ └─────────────┘  │
│         │              │              │                          │
│  ┌──────▼──────────────▼──────────────▼──────────────────────┐  │
│  │              api.js (Axios client)                         │  │
│  │   conversationAPI | documentAPI | aiAPI (Python direct)    │  │
│  └──────────────┬─────────────────────┬───────────────────────┘  │
└─────────────────┼─────────────────────┼─────────────────────────┘
                  │ :8000                │ :8001
┌─────────────────▼────────────┐  ┌─────▼──────────────────────────┐
│     NODE.JS BACKEND          │  │     PYTHON AI SERVICE           │
│  Express + Socket.IO         │  │  FastAPI + LangChain + FAISS   │
│                              │  │                                 │
│  ┌─────────────────────────┐ │  │ ┌──────────────────────────┐   │
│  │ /api/conversations      │ │  │ │ EnhancedRAGService       │   │
│  │ /api/documents          │ │  │ │ - query_with_agent()     │   │
│  └─────────────────────────┘ │  │ │ - _handle_chart_request()│   │
│  ┌─────────────────────────┐ │  │ │ - _generate_suggestions()│   │
│  │    MongoDB Models        │ │  │ └─────────┬────────────────┘   │
│  │  Conversation | Message  │ │  │           │                    │
│  │  Document                │ │  │ ┌─────────▼────────────────┐   │
│  └──────────┬───────────────┘ │  │ │  FAISS Vector Store      │   │
│             │ Socket.IO       │  │ │  (per-document namespace) │   │
│  ┌──────────▼───────────────┐ │  │ └──────────────────────────┘   │
│  │    Socket.IO Events      │ │  │ ┌──────────────────────────┐   │
│  │ document:processing      │ │  │ │  Groq LLM API            │   │
│  │ document:completed       │ │  │ │  llama-3.3-70b-versatile │   │
│  └─────────────────────────┘ │  │ └──────────────────────────┘   │
└─────────────────┬────────────┘  └────────────────────────────────┘
                  │
         ┌────────▼────────┐
         │  MongoDB Atlas   │
         │  Collections:    │
         │  - conversations │
         │  - messages      │
         │  - documents     │
         └─────────────────┘
```

---

## 🗄️ ER Diagram

```
┌──────────────────────────────────────────┐
│               CONVERSATION               │
├──────────────────────────────────────────┤
│  _id          ObjectId  (PK)             │
│  title        String                     │
│  status       String  [active|archived]  │
│  createdAt    Date                       │
│  updatedAt    Date                       │
└───────────────────┬──────────────────────┘
                    │ 1
                    │
            ┌───────┴──────────────────────────────┐
            │                                      │
            │ *                                    │ *
┌───────────▼──────────────────────┐  ┌───────────▼──────────────────────┐
│            MESSAGE               │  │           DOCUMENT               │
├──────────────────────────────────┤  ├──────────────────────────────────┤
│  _id           ObjectId  (PK)    │  │  _id           ObjectId  (PK)    │
│  conversationId ObjectId (FK)    │  │  conversationId ObjectId (FK)    │
│  role          String            │  │  fileName       String           │
│                [user|assistant   │  │  originalName   String           │
│                 |system]         │  │  filePath       String           │
│  content       String            │  │  fileType       String           │
│  timestamp     Date              │  │  fileSize       Number           │
│  feedback      String (optional) │  │  vectorNamespace String         │
│  chart_data    Object (optional) │  │  status         String           │
│  citations     Array  (optional) │  │           [pending|processing    │
│  suggestions   Array  (optional) │  │            |processed|failed]    │
└──────────────────────────────────┘  │  uploadedAt     Date             │
                                      │  processedAt    Date             │
                                      │  pageCount      Number           │
                                      │  chunkCount     Number           │
                                      └──────────────────────────────────┘
```

---

## 📡 API Reference

### 🟢 Node.js Backend (Port 8000)

#### Conversations

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/api/conversations` | Get all conversations | — |
| `POST` | `/api/conversations` | Create new conversation | `{ title }` |
| `GET` | `/api/conversations/:id` | Get conversation + messages | — |
| `PATCH` | `/api/conversations/:id` | Update conversation title | `{ title }` |
| `DELETE` | `/api/conversations/:id` | Delete conversation + docs | — |
| `POST` | `/api/conversations/:id/messages` | Save a message | `{ role, content, chart_data?, citations?, suggestions? }` |

#### Documents

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `POST` | `/api/documents/upload` | Upload 1-10 PDFs | `multipart/form-data` files + `conversationId` |
| `GET` | `/api/documents/conversation/:id` | List docs for conversation | — |
| `DELETE` | `/api/documents/:documentId` | Delete document + vectors | — |
| `PATCH` | `/api/documents/:documentId/status` | Webhook: update processing status | `{ status, pageCount?, chunkCount? }` |

---

### 🟣 Python AI Service (Port 8001)

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/health` | Health check | — |
| `POST` | `/process-document` | Trigger document ingestion into FAISS | `{ documentId, filePath, fileName, vectorNamespace }` |
| `POST` | `/query` | Ask question with RAG + chart generation | `{ question, chatHistory, vectorNamespaces, featureUsed }` |
| `POST` | `/delete-document` | Remove document vectors + file | `{ filePath, vectorNamespace }` |
| `POST` | `/delete-documents` | Batch delete documents | `[{ filePath, vectorNamespace }]` |
| `POST` | `/test-tools` | Test financial calculator tools | — |

#### Query Request Schema
```json
{
  "question": "Give me a bar chart of revenue",
  "chatHistory": [
    { "role": "user", "content": "Hello" },
    { "role": "assistant", "content": "Hi! How can I help?" }
  ],
  "vectorNamespaces": ["doc-uuid-1", "doc-uuid-2"],
  "featureUsed": "Smart_Chart"
}
```

#### Query Response Schema
```json
{
  "answer": "Here is your Bar Chart based on the document.",
  "chart_data": {
    "type": "bar",
    "title": "Revenue By Month",
    "labels": ["Jan", "Feb", "Mar"],
    "datasets": [
      { "label": "Revenue", "data": [85000, 103000, 92000], "color": "#3b82f6" }
    ]
  },
  "citations": [{ "page": 2, "snippet": "...", "confidence": 0.95 }],
  "tool_calls": [],
  "suggestions": [
    "Show me a pie chart of expenses",
    "What is the profit margin?",
    "Compare revenue with last year"
  ]
}
```

---

## 📁 Project Structure

```
Financial-ChatBot/
├── Frontend/                         # React App (Vite)
│   └── src/
│       ├── components/
│       │   ├── chat/                 # ChatWindow, MessageBubble, SuggestionChips...
│       │   ├── charts/               # ChartCard (Recharts)
│       │   ├── export/               # ExportReports (PDF/Excel/Word)
│       │   ├── layout/               # Navbar, Sidebar, CustomCursor
│       │   ├── panels/               # CitationPanel, ToolCallsPanel
│       │   ├── ui/                   # FeatureModeBar, LanguageSelector...
│       │   └── voice/                # VoiceInputButton
│       ├── context/                  # ThemeContext, SettingsContext
│       ├── hooks/                    # useAutoScroll
│       ├── pages/                    # ChatPageNew, AboutPage, LandingPage
│       └── utils/                    # api.js (Axios client)
│
├── Backend/                          # Node.js (Express)
│   └── src/
│       ├── controllers/              # conversation, document, analytics
│       ├── models/                   # Conversation, Message, Document
│       ├── routes/                   # conversation.routes, document.routes
│       ├── middlewares/              # upload.middleware, error.middleware
│       ├── config/                   # db.js
│       └── utils/                   # helpers
│
├── Python-Backend/                   # FastAPI AI Service
│   └── app/
│       ├── api/                      # routes.py
│       ├── agent/                    # calculator.py, orchestrator.py
│       ├── config/                   # settings.py, prompts.py
│       ├── models/                   # schemas.py (Pydantic)
│       └── services/
│           ├── enhanced_rag_service.py  # Main RAG + chart pipeline
│           ├── document_processor.py   # PDF parsing + embedding
│           └── vector_store.py         # FAISS wrapper
│
├── .gitignore
└── README.md
```

---

## 🚀 Setup & Installation

### Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 18+ | Backend + Frontend |
| Python | 3.9+ | AI Service |
| MongoDB | Atlas or Local | Database |
| Anaconda / pip | latest | Python env management |

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/Fenil412/Financial-ChatBot.git
cd Financial-ChatBot
```

---

### Step 2 — Configure Environment Variables

**Backend** (`Backend/.env`):
```env
PORT=8000
MONGODB_URI=mongodb+srv://your-cluster/dbname
PYTHON_SERVICE_URL=http://localhost:8001
FRONTEND_URL=http://localhost:5173
```

**Python AI Service** (`Python-Backend/.env`):
```env
GROQ_API_KEY=your_groq_api_key
OPENROUTER_API_KEY=your_openrouter_key
VISION_PROVIDER=openrouter
VISION_MODEL=qwen/qwen2.5-vl-72b-instruct:free
MODEL_NAME=llama-3.3-70b-versatile
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
NODE_BACKEND_URL=http://localhost:8000
```

**Frontend** (`Frontend/.env`):
```env
VITE_API_URL=http://localhost:8000
VITE_PYTHON_SERVICE_URL=http://localhost:8001
```

---

### Step 3 — Start Node.js Backend

```bash
cd Backend
npm install
npm run dev
# ✅ Running at http://localhost:8000
```

---

### Step 4 — Start Python AI Service

```bash
cd Python-Backend

# Using Anaconda (recommended)
conda activate your-env
pip install -r requirements.txt
python -m app.main

# OR using venv
python -m venv venv
venv\Scripts\activate          # Windows
source venv/bin/activate       # Mac/Linux
pip install -r requirements.txt
python -m app.main
# ✅ Running at http://localhost:8001
```

---

### Step 5 — Start Frontend

```bash
cd Frontend
npm install
npm run dev
# ✅ Running at http://localhost:5173
```

---

### Step 6 — Open in Browser

Visit: **http://localhost:5173**

1. Create a new conversation
2. Upload a financial PDF using the 📎 paperclip icon
3. Wait for document processing (green indicator)
4. Ask questions — e.g., *"Give me a bar chart of revenue"*
5. Use the **mode bar** at top to switch modes
6. Click **Export** to download as PDF/Excel/Word

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📄 **Document Upload** | Upload up to 10 PDFs per conversation |
| 🤖 **RAG Q&A** | Context-aware answers from your documents |
| 📊 **Real Charts** | Bar, Line, Pie, Area charts via Recharts |
| 💡 **Suggestions** | 3 AI-generated follow-up questions after each answer |
| 🎛️ **Feature Modes** | General · Doc Analysis · Smart Chart · Insights |
| 🌐 **Multi-language** | English, Hindi (हिन्दी), Gujarati (ગુજરાતી) |
| 🎤 **Voice Input** | Dictate questions hands-free |
| 📥 **Export** | Download as PDF, Excel (.xlsx), or Word (.doc) |
| 🌙 **Dark Mode** | Full dark/light theme support |
| 🖱️ **Custom Cursor** | Premium custom cursor experience |

---

## 🌍 Environment Variables Summary

| Variable | Service | Required | Description |
|----------|---------|----------|-------------|
| `MONGODB_URI` | Node.js | ✅ | MongoDB connection string |
| `GROQ_API_KEY` | Python | ✅ | Groq LLM API key |
| `OPENROUTER_API_KEY` | Python | ✅ | Vision model API key |
| `PYTHON_SERVICE_URL` | Node.js | ✅ | Python service URL |
| `NODE_BACKEND_URL` | Python | ✅ | Node.js backend URL |
| `VITE_API_URL` | Frontend | ✅ | Node.js backend URL |
| `VITE_PYTHON_SERVICE_URL` | Frontend | ✅ | Python AI URL |

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|---------|
| MongoDB connection failed | Check `MONGODB_URI` in `Backend/.env` |
| Python module not found | Run `pip install -r requirements.txt` in venv |
| Chart shows text not visual | Restart Python backend after code changes |
| Documents stuck "processing" | Check Python backend logs for errors |
| CORS errors | Verify `FRONTEND_URL` in Backend `.env` |
| Voice input not working | Use HTTPS or localhost (browser requirement) |

---

## 📊 Performance

| Operation | Time |
|-----------|------|
| Document processing (per page) | 5-15s |
| Query response | 2-5s |
| Chart generation | +1-2s |
| Vector search | <100ms |
| Page load | <1s |

---

## 📄 License

ISC — See [LICENSE](./LICENSE)

---

## 👩‍💻 Author

**FinChatBot Team** — Built with ❤️ using React, FastAPI, LangChain & Groq
