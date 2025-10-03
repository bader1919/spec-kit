# N8N Dashboard

A real-time dashboard for monitoring N8N workflow automation with widget-based visualization.

## Features

- 🔄 Real-time updates (polling every 4 seconds)
- 📊 Workflow status monitoring
- 📈 Execution history tracking (last 5 executions)
- 🎯 Node-level execution details
- 📉 Performance charts with Chart.js
- 🛡️ Error handling with graceful degradation
- ⚡ Fast API proxy with caching

## Architecture

**Backend**: Express.js API proxy with N8N REST API integration
**Frontend**: React 18+ with TypeScript and real-time polling
**Testing**: Jest, React Testing Library, Supertest (TDD approach)

## Prerequisites

- Node.js 18+
- Running N8N instance with API access
- N8N API key

## Installation

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your N8N credentials:
# N8N_BASE_URL=http://localhost:5678/api/v1
# N8N_API_KEY=your-api-key-here
npm run dev
```

Backend runs on `http://localhost:3000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## Development

### Running Tests

**Backend**:
```bash
cd backend
npm test
npm run test:coverage
```

**Frontend**:
```bash
cd frontend
npm test
npm run test:watch
```

### Linting

```bash
# Backend
cd backend
npm run lint
npm run lint:fix

# Frontend
cd frontend
npm run lint
npm run lint:fix
```

## Project Structure

```
backend/
├── src/
│   ├── models/          # Data models (Workflow, Execution, Node)
│   ├── services/        # N8N client, Dashboard service
│   ├── api/
│   │   ├── routes/      # API endpoints
│   │   └── middleware/  # Auth, error handling
│   ├── config/          # CORS, rate limiting
│   └── app.js           # Express app entry point
└── tests/               # Contract, integration, unit tests

frontend/
├── src/
│   ├── components/      # React components
│   ├── pages/           # Page components
│   ├── services/        # API client, dashboard service
│   ├── hooks/           # useRealTimeData hook
│   └── utils/           # Formatters, helpers
└── tests/               # Component and integration tests
```

## API Endpoints

- `GET /api/workflows` - List all workflows
- `GET /api/workflows/:id` - Get workflow details
- `GET /api/executions?limit=5` - List recent executions
- `GET /api/executions/:id` - Get execution with node details

## Configuration

### Backend (.env)
- `N8N_BASE_URL` - N8N API base URL
- `N8N_API_KEY` - N8N API key for authentication
- `PORT` - Backend server port (default: 3000)
- `FRONTEND_URL` - Frontend URL for CORS

### Frontend (.env)
- `VITE_API_BASE_URL` - Backend API URL (default: http://localhost:3000)

## Features Detail

### Real-time Updates
- Automatic polling every 4 seconds
- Live indicator showing connection status
- Manual refresh button available

### Dashboard Components
- **WorkflowCard**: Displays workflow status, execution count, success rate
- **ExecutionList**: Shows last 5 executions with timestamps
- **Charts**: Performance visualization with execution times
- **StatusIndicator**: Color-coded status badges

### Error Handling
- Graceful degradation when N8N unavailable
- User-friendly error messages
- Automatic reconnection attempts
- Authentication error detection

## Performance

- API response caching (2.5 seconds)
- Rate limiting: 60 requests/minute
- Optimized Chart.js rendering
- React.memo for expensive components

## Testing

Following TDD principles:
- Contract tests verify API compliance with OpenAPI specs
- Integration tests validate user scenarios
- Unit tests ensure component reliability
- 70%+ code coverage target

## License

MIT

## Contributing

1. Follow TDD approach (tests first)
2. Run linting before commits
3. Ensure all tests pass
4. Update documentation as needed
=======

>>>>>>> b6b5f7147a23b7c60690737c8a8523d7c8f35249
