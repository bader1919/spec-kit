# Research: N8N Dashboard

## Technical Decisions

### Frontend Framework Choice
**Decision**: React 18+ with TypeScript
**Rationale**:
- React provides excellent component-based architecture for dashboard widgets
- TypeScript adds type safety for n8n API integration
- Large ecosystem for charting libraries (Chart.js, Recharts)
- Strong testing support with React Testing Library
**Alternatives considered**: Vue.js (smaller learning curve), Angular (over-engineered for this scope)

### Backend Framework Choice
**Decision**: Express.js with Node.js 18+
**Rationale**:
- Lightweight API proxy pattern fits the requirements
- Native JSON handling for n8n API responses
- Excellent middleware ecosystem for rate limiting, CORS
- Fast development iteration
**Alternatives considered**: FastAPI (Python overhead), Next.js API routes (couples frontend/backend)

### N8N API Integration Pattern
**Decision**: Backend proxy with API key forwarding
**Rationale**:
- Keeps n8n credentials secure (not exposed to browser)
- Enables request caching and rate limiting
- Allows response transformation and error handling
- Facilitates testing with mocked n8n responses
**Alternatives considered**: Direct browser-to-n8n calls (security risk), GraphQL wrapper (unnecessary complexity)

### Real-time Updates Implementation
**Decision**: React hooks with setInterval polling every 3-5 seconds
**Rationale**:
- Simple implementation without WebSocket infrastructure
- n8n REST API doesn't support Server-Sent Events
- Configurable polling interval balances responsiveness and load
- Easy to implement pause/resume functionality
**Alternatives considered**: WebSockets (n8n doesn't support), Long polling (unnecessary complexity)

### Dashboard Layout Architecture
**Decision**: CSS Grid with responsive card components
**Rationale**:
- Grid layout supports flexible widget arrangement
- Card pattern works well for workflow status displays
- Responsive design works across device sizes
- Easy to add/remove dashboard sections
**Alternatives considered**: Flexbox (less structured), Dashboard library (vendor lock-in)

### State Management
**Decision**: React Context + useReducer for dashboard state
**Rationale**:
- Built-in React patterns sufficient for single-page dashboard
- No complex state sharing between disconnected components
- Easier testing than external state management
**Alternatives considered**: Redux (overkill), Zustand (unnecessary dependency)

### Error Handling Strategy
**Decision**: Graceful degradation with user-friendly error messages
**Rationale**:
- n8n instance may be temporarily unavailable
- API rate limits need clear user communication
- Partial data display better than complete failure
**Alternatives considered**: Retry with exponential backoff (may hit rate limits), Silent failures (poor UX)

### Testing Strategy
**Decision**: Three-tier testing: Unit (Jest), Component (RTL), Integration (Supertest)
**Rationale**:
- Follows constitutional TDD requirements
- Jest provides excellent mocking for n8n API calls
- React Testing Library tests user interactions
- Supertest validates backend API contracts
**Alternatives considered**: E2E with Playwright (unnecessary complexity for dashboard), Cypress (heavier setup)

## Architecture Patterns

### API Proxy Pattern
Backend acts as secure proxy between dashboard and n8n instance:
- Validates API keys before forwarding requests
- Transforms n8n responses to dashboard-friendly format
- Implements rate limiting and caching
- Provides consistent error response format

### Component Composition Pattern
Dashboard built from composable React components:
- WorkflowCard displays individual workflow status
- ExecutionList shows recent workflow runs
- StatusIndicator provides visual status representation
- Charts component handles performance visualizations

### Hook-based Data Fetching
Custom React hooks manage API interactions:
- useRealTimeData handles polling lifecycle
- useN8nApi manages API calls and error states
- useDashboardState manages local dashboard preferences

## Performance Considerations

### API Rate Limiting
- Backend implements request queuing for n8n API calls
- Configurable polling interval (default 3-5 seconds)
- Exponential backoff on API errors
- Request deduplication for identical API calls

### Frontend Optimization
- React.memo for expensive dashboard components
- useMemo for chart data transformations
- Lazy loading for non-critical dashboard sections
- Debounced user interactions

### Caching Strategy
- Backend caches n8n responses for 2-3 seconds
- Frontend caches static workflow metadata
- Cache invalidation on user-triggered refresh
- Memory-based caching (no persistent storage needed)