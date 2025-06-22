# ChessGPT App

A chess game application with AI opponent powered by Google's Gemini AI. The application consists of a Go backend server and a React frontend client.

## Features

- Interactive chess board with drag-and-drop piece movement
- AI opponent with configurable difficulty levels (easy, medium, intermediate, hard, expert)
- Real-time move validation and game state management
- Move history tracking
- Game end detection (checkmate, stalemate, draw)
- Modern, responsive UI built with React and Tailwind CSS

## Prerequisites

- Go 1.21 or later
- Node.js 18 or later
- npm or yarn
- Google Gemini API key

## Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd chessgpt-app
```

### 2. Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Create a `.env` file in the server directory:
```bash
GEMINI_KEY=your_gemini_api_key_here
PORT=8080
```

3. Install Go dependencies:
```bash
go mod download
```

4. Run the server:
```bash
go run main.go
```

The server will start on `http://localhost:8080`

### 3. Frontend Setup

1. Open a new terminal and navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The client will start on `http://localhost:5173`

## How to Play

1. Open your browser and go to `http://localhost:5173`
2. Select your preferred difficulty level from the control panel
3. You play as White (bottom pieces)
4. Click and drag pieces to make moves
5. The AI will automatically respond with its move
6. The game continues until checkmate, stalemate, or draw

## API Endpoints

- `GET /health` - Health check endpoint
- `POST /api/move` - Get AI move for current position

### Move Request Format

```json
{
  "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  "history": ["e4", "e5"],
  "difficulty": "intermediate"
}
```

### Move Response Format

```json
{
  "move": "Nf3"
}
```

## Project Structure

```
chessgpt-app/
├── server/                 # Go backend
│   ├── ai/                # AI integration with Gemini
│   ├── chess/             # Chess game logic and validation
│   ├── config/            # Configuration management
│   ├── handlers/          # HTTP request handlers
│   ├── models/            # Data models
│   └── server/            # Server setup and routing
└── client/                # React frontend
    ├── src/
    │   ├── components/    # React components
    │   ├── pages/         # Page components
    │   ├── store/         # State management (Zustand)
    │   ├── services/      # API services
    │   └── types/         # TypeScript type definitions
    └── public/            # Static assets
```

## Technologies Used

### Backend
- Go
- Gin web framework
- Google Gemini AI API
- Chess.js (Go port) for game logic

### Frontend
- React 19
- TypeScript
- Tailwind CSS
- Zustand for state management
- React Chessboard
- Axios for API calls

## Troubleshooting

### Common Issues

1. **Server won't start**: Make sure you have a valid Gemini API key in your `.env` file
2. **Client can't connect to server**: Ensure the server is running on port 8080
3. **CORS errors**: The server is configured to allow all origins for development
4. **AI moves are slow**: This is normal for AI responses, especially on higher difficulty levels

### Getting a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file as `GEMINI_KEY`

## Development

### Running in Development Mode

Both the server and client support hot reloading:

- Server: `go run main.go` (restart manually for changes)
- Client: `npm run dev` (automatic reload on changes)

### Building for Production

1. Build the client:
```bash
cd client
npm run build
```

2. The built files will be in `client/dist/`

## License

This project is open source and available under the MIT License. 