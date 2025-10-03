require('dotenv').config();
const express = require('express');
const { cors, rateLimiter } = require('./config/app');
const authMiddleware = require('./api/middleware/auth');
const errorHandler = require('./api/middleware/errorHandler');
const N8NClient = require('./services/n8nClient');
const DashboardService = require('./services/dashboardService');
const workflowsRouter = require('./api/routes/workflows');
const executionsRouter = require('./api/routes/executions');

const app = express();

// Middleware
app.use(express.json());
app.use(cors);
app.use(rateLimiter);

// Initialize services
const n8nClient = new N8NClient(process.env.N8N_BASE_URL, process.env.N8N_API_KEY);
const dashboardService = new DashboardService(n8nClient);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes (with optional auth middleware)
app.use('/api/workflows', workflowsRouter(dashboardService));
app.use('/api/executions', executionsRouter(dashboardService));

// Error handling
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`N8N Dashboard Backend running on port ${PORT}`);
  });
}

module.exports = app;
