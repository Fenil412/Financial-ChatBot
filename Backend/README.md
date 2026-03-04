# FinChatBot — Node.js Backend

REST API server for conversation management, document handling, and coordination between the frontend and Python AI service.

---

## Overview

- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Real-time**: Socket.IO
- **File Upload**: Multer
- **Port**: `8000`

---

## Setup

```bash
cd Backend
npm install
cp .env.example .env   # Fill in your values
npm run dev
```

---

## Environment Variables

```env
PORT=8000
MONGODB_URI=mongodb+srv://...
PYTHON_SERVICE_URL=http://localhost:8001
FRONTEND_URL=http://localhost:5173
```

---

## API Endpoints

### Conversations — `/api/conversations`

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Get all conversations |
| `POST` | `/` | Create new conversation |
| `GET` | `/:id` | Get conversation with all messages |
| `PATCH` | `/:id` | Update conversation title |
| `DELETE` | `/:id` | Delete conversation (also triggers document cleanup) |
| `POST` | `/:id/messages` | Save a user or assistant message |

**Create Conversation — Request:**
```json
{ "title": "Q4 Revenue Analysis" }
```

**Save Message — Request:**
```json
{
  "role": "assistant",
  "content": "Here is your bar chart...",
  "chart_data": { "type": "bar", "title": "Revenue", "labels": [], "datasets": [] },
  "citations": [],
  "suggestions": ["Show pie chart", "Compare with Q3", "What is the margin?"]
}
```

---

### Documents — `/api/documents`

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/upload` | Upload up to 10 PDFs (`multipart/form-data`) |
| `GET` | `/conversation/:id` | Get all documents for a conversation |
| `DELETE` | `/:documentId` | Delete document (file + vectors) |
| `PATCH` | `/:documentId/status` | Webhook: Python updates document status |

**Upload Request:**
```
Content-Type: multipart/form-data
Fields: documents[] (files), conversationId (string)
```

**Status Update (Webhook from Python):**
```json
{
  "status": "processed",
  "pageCount": 4,
  "chunkCount": 32
}
```

---

## Project Structure

```
Backend/
├── src/
│   ├── app.js                    # Express setup + middleware
│   ├── server.js                 # Server entry + Socket.IO
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── conversation.controller.js
│   │   ├── document.controller.js
│   │   └── analytics.controller.js
│   ├── models/
│   │   ├── Conversation.model.js
│   │   ├── Message.model.js
│   │   └── Document.model.js
│   ├── routes/
│   │   ├── conversation.routes.js
│   │   └── document.routes.js
│   ├── middlewares/
│   │   ├── upload.middleware.js   # Multer config
│   │   └── error.middleware.js
│   └── utils/
│       └── helpers.js
├── uploads/                      # Uploaded files (gitignored)
└── package.json
```

---

## MongoDB Models

### Conversation
```js
{ title: String, status: String, createdAt: Date }
```

### Message
```js
{
  conversationId: ObjectId,
  role: 'user' | 'assistant' | 'system',
  content: String,
  chart_data: Object,
  citations: Array,
  suggestions: Array,
  timestamp: Date
}
```

### Document
```js
{
  conversationId: ObjectId,
  fileName: String,
  filePath: String,
  vectorNamespace: String,
  status: 'pending' | 'processing' | 'processed' | 'failed',
  pageCount: Number,
  chunkCount: Number
}
```

---

## Socket.IO Events

| Event | Direction | Payload |
|-------|-----------|---------|
| `document:processing` | Server → Client | `{ documentId }` |
| `document:completed` | Server → Client | `{ documentId, status }` |
| `document:error` | Server → Client | `{ documentId, error }` |
