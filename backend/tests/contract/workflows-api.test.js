const request = require('supertest');
const app = require('../../src/app');

describe('Workflows API Contract Tests', () => {
  describe('GET /api/workflows', () => {
    it('should return 200 with array of workflows', async () => {
      const response = await request(app)
        .get('/api/workflows')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should return workflow objects with required fields', async () => {
      const response = await request(app).get('/api/workflows');

      if (response.body.data.length > 0) {
        const workflow = response.body.data[0];
        expect(workflow).toHaveProperty('id');
        expect(workflow).toHaveProperty('name');
        expect(workflow).toHaveProperty('active');
        expect(workflow).toHaveProperty('status');
        expect(['idle', 'running', 'error', 'disabled']).toContain(workflow.status);
      }
    });

    it('should return 401 when authentication fails', async () => {
      const response = await request(app)
        .get('/api/workflows')
        .set('Authorization', 'Bearer invalid_token')
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/workflows/:workflowId', () => {
    it('should return 200 with workflow details', async () => {
      const response = await request(app)
        .get('/api/workflows/test-workflow-id')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('name');
      expect(response.body.data).toHaveProperty('status');
    });

    it('should return 404 when workflow not found', async () => {
      const response = await request(app)
        .get('/api/workflows/nonexistent-id')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });
  });
});
