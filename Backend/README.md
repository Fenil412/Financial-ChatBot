# FinChatBot - Node.js Backend

The core REST API for the Financial ChatBot, handling user data, document management, and communication with the AI Service.

## Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB + Mongoose** - Database and ODM
- **JWT** - Authentication
- **Multer** - File upload handling
- **Axios** - For communicating with the Python AI Service

## Project Structure

```text
Backend/
├── src/
│   ├── config/            # Database and environment configuration
│   ├── controllers/       # Request handlers (logic)
│   ├── middlewares/       # Express middlewares (Auth, Error handling)
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API endpoint definitions
│   ├── utils/             # Helper functions (Email, Cloudinary, etc.)
│   ├── app.js             # Express app setup
│   └── server.js          # Entry point (Server listener)
├── uploads/               # Temporary local storage for uploaded documents
└── package.json           # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- MongoDB (Local or Atlas)

### Installation

1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *Fill in your MongoDB URI and other required secrets.*

### Running the Server

Start the server in development mode:
```bash
npm run dev
```

The API will be available at [http://localhost:8000](http://localhost:8000).

## API Features

- **User Management**: Sign up, login, and profile management.
- **Document Services**: Secure file upload and tracking.
- **AI Integration**: Acts as a bridge between the frontend and the Python-based RAG service.
- **Webhook Support**: Handles callbacks from external services.
