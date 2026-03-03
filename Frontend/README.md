# FinChatBot - Frontend

The modern, responsive web interface for the Financial ChatBot. Built with React, Vite, and Tailwind CSS.

## Tech Stack

- **React 18** - UI Library
- **Vite** - Build Tool & Development Server
- **Tailwind CSS** - Styling
- **Axios** - API Client
- **Lucide React** - Icons

## Project Structure

```text
Frontend/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Page-level components
│   ├── utils/            # API client and helper functions
│   ├── main.jsx          # Application entry point
│   └── index.css         # Global styles and Tailwind imports
├── public/               # Static assets
├── index.html            # HTML template
├── tailwind.config.js    # Tailwind configuration
└── vite.config.js        # Vite configuration
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *Ensure the `VITE_API_URL` points to your Node.js backend (default: `http://localhost:8000`).*

### Running the App

Start the development server:
```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

## Features

- **Responsive Design**: Works on desktop, tablet, and mobile.
- **Real-time Chat**: Interactive chat interface with AI response streaming.
- **Document Management**: Upload and manage financial documents.
- **Context-Aware**: Switches between Smart Chat, Document Analysis, and Analytical Insights.
