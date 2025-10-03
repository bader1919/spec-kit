const express = require('express');
const router = express.Router();

module.exports = (dashboardService) => {
  // GET /api/workflows
  router.get('/', async (req, res, next) => {
    try {
      const workflows = await dashboardService.getWorkflows();
      res.json({
        success: true,
        data: workflows,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  });

  // GET /api/workflows/:workflowId
  router.get('/:workflowId', async (req, res, next) => {
    try {
      const { workflowId } = req.params;
      const workflow = await dashboardService.getWorkflow(workflowId);

      if (!workflow) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Workflow not found',
          },
          timestamp: new Date().toISOString(),
        });
      }

      res.json({
        success: true,
        data: workflow,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
};
