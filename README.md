# Cramly AI

Cramly AI is an AI-powered study notes generator built with the MERN stack. It helps students generate structured, exam-focused notes from a topic, save their study sets, search note history, review quick revision points, view optional diagrams/charts, and export generated notes as a PDF.

## Tech Stack

- MongoDB and Mongoose for persisted users and generated notes
- Express.js and Node.js for the backend API
- React, Vite, React Router, Redux Toolkit, and Tailwind CSS for the frontend
- Google/Firebase authentication on the client
- JWT HTTP-only cookies for backend session checks
- Gemini API for AI note generation
- Mermaid and Recharts for optional visual outputs
- PDFKit for PDF export

## Features

- Google sign-in flow connected to backend user records
- Topic-based AI study note generation
- Class level, exam type, revision mode, diagram, and chart options
- Structured output with subtopics, importance, markdown notes, revision points, and practice questions
- Saved notes history and search
- Single-note retrieval from saved history
- Optional Mermaid diagrams and Recharts charts in generated results
- PDF download endpoint for generated study sets
- Protected API routes using JWT cookies

## Project Structure

```text
CramlyAI/
  client/   React + Vite frontend
  server/   Express + MongoDB backend
```

## Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB connection string
- Gemini API key
- Firebase project configured for Google authentication

### Backend Setup

```bash
cd CramlyAI/server
npm install
```

Create `CramlyAI/server/.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Run the backend:

```bash
npm run dev
```

### Frontend Setup

```bash
cd CramlyAI/client
npm install
```

Create `CramlyAI/client/.env`:

```env
VITE_SERVER_URL=http://localhost:5000
VITE_FIREBASE_APIKEY=your_firebase_api_key
```

Run the frontend:

```bash
npm run dev
```

The Vite dev server usually starts at `http://localhost:5173`.

## Available Scripts

Backend:

```bash
npm run dev
```

Frontend:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Security Notes

Do not commit real `.env` files, API keys, MongoDB connection strings, Firebase private configuration, JWT secrets, or other credentials. This repository documents required variables with placeholders only.
