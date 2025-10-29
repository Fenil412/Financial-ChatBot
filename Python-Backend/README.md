# FinChatBot - Python AI Backend (Updated)

A modern, local-only AI service for financial document analysis using RAG (Retrieval Augmented Generation).

## 🎯 Features

- **Local Vector Storage**: FAISS-based vector database (no cloud dependencies)
- **Multi-Modal Processing**: Extracts text and analyzes images from PDFs
- **RAG Pipeline**: Retrieval Augmented Generation for accurate answers
- **Multiple Modes**: Smart Chat, Document Analysis, Analytical Insights, General Conversation
- **Google Gemini AI**: Powered by Google's Gemini model
- **Local Embeddings**: HuggingFace sentence transformers (runs on CPU)

## 📁 Project Structure

```
Python-Backend-Updated/
├── app/
│   ├── api/
│   │   └── routes.py              # API endpoints
│   ├── config/
│   │   ├── prompts.py             # AI prompt templates
│   │   └── settings.py            # Configuration settings
│   ├── models/
│   │   └── schemas.py             # Pydantic models
│   ├── services/
│   │   ├── document_processor.py  # PDF processing & image analysis
│   │   ├── rag_service.py         # RAG pipeline logic
│   │   └── vector_store.py        # Local FAISS vector store
│   └── main.py                    # Application entry point
├── vector_store/                  # Local vector database (auto-created)
├── .env.example                   # Environment variables template
├── requirements.txt               # Python dependencies
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Python**: 3.9 or higher
- **pip**: Latest version
- **Google Gemini API Key**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Installation

1. **Navigate to the backend directory**:
   ```bash
   cd Python-Backend-Updated
   ```

2. **Create virtual environment** (recommended):
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env with your values
   ```

5. **Configure `.env` file**:
   ```env
   # Google Gemini API Key (REQUIRED)
   GOOGLE_API_KEY=your-google-api-key-here

   # Node.js Backend URL
   NODE_WEBHOOK_URL=http://localhost:8000

   # Server Port
   PORT=5000
   ```

### Getting Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it in `.env`

**Note**: Gemini API has a generous free tier!

### Running the Server

**Development mode** (with auto-reload):
```bash
python app/main.py
```

Or using uvicorn directly:
```bash
uvicorn app.main:app --reload --port 5000
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Health Check
```
GET /health
```
Returns service status

### Process Document
```
POST /process-document
Body: {
  "documentId": "string",
  "filePath": "string",
  "fileName": "string",
  "vectorNamespace": "string"
}
```
Processes a PDF document and creates embeddings

### Query
```
POST /query
Body: {
  "question": "string",
  "chatHistory": [{"role": "user", "content": "..."}],
  "vectorNamespaces": ["namespace1", "namespace2"],
  "featureUsed": "Smart_Chat"
}
```
Answers questions using document context

### Delete Document
```
POST /delete-document
Body: {
  "filePath": "string",
  "vectorNamespace": "string"
}
```
Deletes document and vector store

### Delete Multiple Documents
```
POST /delete-documents
Body: [
  {
    "filePath": "string",
    "vectorNamespace": "string"
  }
]
```
Batch deletion for conversation cleanup

## 🤖 Conversation Modes

### 1. Smart Chat (Default)
- Multi-modal RAG with full document context
- Analyzes both text and images
- Best for general questions

### 2. Document Analysis
- Focused on specific document details
- Extracts precise information
- Good for fact-finding

### 3. Analytical Insights
- Financial calculations and trends
- Numerical analysis
- Pattern identification

### 4. General Conversation
- No document context
- General finance knowledge
- Conversational responses

## 🔧 How It Works

### Document Processing Pipeline

1. **PDF Upload**: Node.js backend sends file path
2. **Text Extraction**: PyMuPDF extracts text from each page
3. **Image Analysis**: Gemini Vision describes charts/tables
4. **Chunking**: Text split into manageable pieces
5. **Embedding**: HuggingFace model creates vectors
6. **Storage**: FAISS stores vectors locally
7. **Webhook**: Notify Node.js of completion

### Query Pipeline

1. **Question Received**: User asks a question
2. **Retrieval**: Search FAISS for relevant chunks
3. **Context Building**: Format retrieved documents
4. **Prompt Creation**: Build prompt with context
5. **LLM Generation**: Gemini generates answer
6. **Response**: Return answer to user

## 📦 Key Technologies

### Core
- **FastAPI**: Modern Python web framework
- **Pydantic**: Data validation
- **Python-dotenv**: Environment variables

### AI/ML
- **LangChain**: RAG framework
- **Google Gemini**: Large language model
- **HuggingFace Transformers**: Embedding models
- **FAISS**: Vector similarity search

### Document Processing
- **PyPDF**: PDF text extraction
- **PyMuPDF**: Advanced PDF processing
- **Pillow**: Image handling

## 🎓 Understanding the Code

### Vector Store (FAISS)
FAISS (Facebook AI Similarity Search) is a library for efficient similarity search. Instead of storing documents in the cloud (Pinecone), we store them locally:

```python
# Create embeddings
embeddings = HuggingFaceEmbeddings(model_name='...')

# Create vector store
vectorstore = FAISS.from_documents(documents, embeddings)

# Save to disk
vectorstore.save_local("./vector_store/namespace")

# Load from disk
vectorstore = FAISS.load_local("./vector_store/namespace", embeddings)
```

### RAG (Retrieval Augmented Generation)
RAG combines document retrieval with AI generation:

1. **Retrieve**: Find relevant document chunks
2. **Augment**: Add context to the prompt
3. **Generate**: LLM creates answer based on context

```python
# Retrieve relevant documents
docs = vectorstore.similarity_search(question, k=5)

# Format context
context = format_documents(docs)

# Generate answer
answer = llm.invoke(prompt.format(context=context, question=question))
```

### Multi-Modal Processing
Extracts both text and image descriptions:

```python
# Extract text
text = page.get_text("text")

# Extract images
for img in page.get_images():
    image_bytes = doc.extract_image(img[0])
    description = vision_llm.describe(image_bytes)
    # Store description as text chunk
```

## 🛠️ Development Tips

### Testing API Endpoints

Use the built-in Swagger UI:
```
http://localhost:5000/docs
```

Or use curl:
```bash
# Health check
curl http://localhost:5000/health

# Query
curl -X POST http://localhost:5000/query \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is the revenue?",
    "chatHistory": [],
    "vectorNamespaces": ["doc-123"],
    "featureUsed": "Smart_Chat"
  }'
```

### Viewing Logs

The service provides detailed logs:
- 🚀 Startup information
- 📨 Request received
- 🔍 Searching documents
- ✅ Success messages
- ❌ Error messages

### Common Issues

**Import errors**:
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

**FAISS not found**:
```bash
# Install FAISS CPU version
pip install faiss-cpu
```

**Gemini API errors**:
- Check API key in `.env`
- Verify key is valid at [Google AI Studio](https://makersuite.google.com/)
- Check API quota/limits

**Out of memory**:
- Reduce `CHUNK_SIZE` in settings
- Reduce `TOP_K_RESULTS`
- Use smaller embedding model

## 🔐 Security Notes

- **API Key**: Never commit `.env` to version control
- **Local Only**: All data stays on your machine
- **No Cloud**: No external services except Gemini API
- **Validation**: All inputs validated with Pydantic

## 📊 Performance

### Embedding Model
- **Model**: sentence-transformers/all-MiniLM-L6-v2
- **Size**: ~90MB
- **Speed**: Fast on CPU
- **Quality**: Good for most use cases

### LLM Model
- **Model**: Gemini 2.0 Flash
- **Speed**: Very fast
- **Quality**: Excellent
- **Cost**: Free tier available

### Vector Search
- **FAISS**: Extremely fast
- **Local**: No network latency
- **Scalable**: Handles thousands of documents

## 🔄 Integration with Node.js Backend

The Python service communicates with Node.js via HTTP:

**Node.js → Python**:
- POST /process-document (when file uploaded)
- POST /query (when user asks question)
- POST /delete-document (when document deleted)

**Python → Node.js**:
- PATCH /api/v1/documents/:id/status (processing complete)

## 📝 License

ISC

## 👥 Authors

FinChatBot Team

---

**Need help?** Check the logs or visit the Swagger UI at `/docs`!
