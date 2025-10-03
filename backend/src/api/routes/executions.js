const express = require('express');
const router = express.Router();

module.exports = (dashboardService) => {
  // GET /api/executions
  router.get('/', async (req, res, next) => {
    try {
      const { workflowId, limit } = req.query;

      const params = {};
      if (workflowId) params.workflowId = workflowId;
      if (limit) params.limit = Math.min(parseInt(limit, 10), 5); // Max 5

      const executions = await dashboardService.getExecutions(params);

      res.json({
        success: true,
        data: executions,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  });

  // GET /api/executions/:executionId
  router.get('/:executionId', async (req, res, next) => {
    try {
      const { executionId } = req.params;
      const execution = await dashboardService.getExecutionDetails(executionId);

      if (!execution) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Execution not found',
          },
          timestamp: new Date().toISOString(),
        });
      }

      res.json({
        success: true,
        data: execution,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
};
