# FinChatBot — Frontend

React 18 + Vite application providing a premium financial chatbot interface with real chart rendering, multi-language support, and document export features.

---

## Overview

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Export**: jsPDF, xlsx, file-saver
- **Port**: `5173`

---

## Setup

```bash
cd Frontend
npm install
cp .env.example .env   # Fill in your values
npm run dev
```

---

## Environment Variables

```env
VITE_API_URL=http://localhost:8000
VITE_PYTHON_SERVICE_URL=http://localhost:8001
```

---

## Project Structure

```
Frontend/src/
├── components/
│   ├── chat/
│   │   ├── ChatWindow.jsx         # Main chat UI + input bar
│   │   ├── MessageBubble.jsx      # Individual message display
│   │   ├── SuggestionChips.jsx    # Follow-up question pills
│   │   ├── TypingIndicator.jsx    # AI loading animation
│   │   └── LanguageSelector.jsx   # EN / HI / GU switcher
│   ├── charts/
│   │   └── ChartCard.jsx          # Recharts: bar/line/pie/area/donut
│   ├── export/
│   │   └── ExportReports.jsx      # PDF / Excel / Word download
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   ├── SidebarNew.jsx
│   │   └── CustomCursor.jsx       # Premium custom cursor
│   ├── panels/
│   │   ├── CitationPanel.jsx      # Source citations
│   │   └── ToolCallsPanel.jsx     # Agent tool call display
│   ├── ui/
│   │   ├── FeatureModeBar.jsx     # Mode switcher (General/Chart/etc.)
│   │   └── LanguageSelector.jsx
│   └── voice/
│       └── VoiceInputButton.jsx   # Browser speech recognition
├── context/
│   ├── ThemeContext.jsx            # Dark/light mode
│   └── SettingsContext.jsx         # App settings (cursor etc.)
├── hooks/
│   └── useAutoScroll.js           # Auto-scroll chat to bottom
├── pages/
│   ├── ChatPageNew.jsx             # Main app page (state management)
│   ├── LandingPage.jsx             # Landing / welcome page
│   └── AboutPage.jsx               # About page
└── utils/
    └── api.js                      # Axios client for all API calls
```

---

## Key Components

### ChatPageNew (State Hub)
- Manages conversations, messages, documents, feature mode
- Queries Python AI directly, then saves to Node.js
- Passes `featureMode`, `suggestions`, `chart_data` to children

### ChatWindow (UI)
- Renders FeatureModeBar at top
- Renders messages + SuggestionChips after each AI response
- ExportReports dropdown in input bar
- Language selector + Voice input

### ChartCard (Recharts)
- Supports: `bar`, `line`, `pie`, `area`, `donut`
- Premium glassmorphism design
- Data table shown below chart for small datasets

### ExportReports
| Format | Library |
|--------|---------|
| PDF | jsPDF + autotable |
| Excel | xlsx (SheetJS) |
| Word | HTML blob → .doc |

### FeatureModeBar
| Mode | Backend value |
|------|--------------|
| General | `General` |
| Doc Analysis | `Document_Analysis` |
| Smart Chart | `Smart_Chart` |
| Insights | `Insights` |

---

## API Client (`utils/api.js`)

```js
conversationAPI.getAll()
conversationAPI.create(title)
conversationAPI.getById(id)
conversationAPI.update(id, title)
conversationAPI.delete(id)
conversationAPI.sendMessage(id, role, content, extras)

documentAPI.upload(formData)
documentAPI.getByConversation(id)
documentAPI.delete(id)

aiAPI.query(question, chatHistory, vectorNamespaces, featureMode)
```

---

## npm Scripts

```bash
npm run dev      # Start dev server (hot reload)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # ESLint check
```

---

## Dependencies

| Package | Purpose |
|---------|---------|
| `recharts` | Chart rendering |
| `jspdf` + `jspdf-autotable` | PDF export |
| `xlsx` | Excel export |
| `file-saver` | Download file trigger |
| `html2canvas` | Capture chart as image |
| `lucide-react` | Icons |
| `axios` | HTTP client |
| `react-router-dom` | Client-side routing |
| `socket.io-client` | Real-time document updates |
