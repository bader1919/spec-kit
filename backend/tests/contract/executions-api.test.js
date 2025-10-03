const request = require('supertest');
const app = require('../../src/app');

describe('Executions API Contract Tests', () => {
  describe('GET /api/executions', () => {
    it('should return 200 with array of executions', async () => {
      const response = await request(app)
        .get('/api/executions')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should limit executions to 5 by default', async () => {
      const response = await request(app).get('/api/executions');

      expect(response.body.data.length).toBeLessThanOrEqual(5);
    });

    it('should filter by workflowId when provided', async () => {
      const response = await request(app)
        .get('/api/executions?workflowId=test-workflow')
        .expect(200);

      if (response.body.data.length > 0) {
        response.body.data.forEach((execution) => {
          expect(execution.workflowId).toBe('test-workflow');
        });
      }
    });

    it('should return execution objects with required fields', async () => {
      const response = await request(app).get('/api/executions');

      if (response.body.data.length > 0) {
        const execution = response.body.data[0];
        expect(execution).toHaveProperty('id');
        expect(execution).toHaveProperty('workflowId');
        expect(execution).toHaveProperty('status');
        expect(['running', 'success', 'error', 'cancelled']).toContain(execution.status);
        expect(execution).toHaveProperty('startTime');
      }
    });
  });

  describe('GET /api/executions/:executionId', () => {
    it('should return 200 with execution details including nodes', async () => {
      const response = await request(app)
        .get('/api/executions/test-execution-id')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('workflowId');
      expect(response.body.data).toHaveProperty('nodes');
      expect(Array.isArray(response.body.data.nodes)).toBe(true);
    });

    it('should return node objects with required fields', async () => {
      const response = await request(app).get('/api/executions/test-execution-id');

      if (response.body.data.nodes && response.body.data.nodes.length > 0) {
        const node = response.body.data.nodes[0];
        expect(node).toHaveProperty('name');
        expect(node).toHaveProperty('type');
        expect(node).toHaveProperty('executionStatus');
        expect(['success', 'error', 'skipped', 'running']).toContain(node.executionStatus);
      }
    });

    it('should return 404 when execution not found', async () => {
      const response = await request(app)
        .get('/api/executions/nonexistent-id')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });
  });
});
