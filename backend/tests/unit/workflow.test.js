const Workflow = require('../../src/models/workflow');

describe('Workflow Model', () => {
  describe('constructor', () => {
    it('should create workflow with all required fields', () => {
      const data = {
        id: 'wf-123',
        name: 'Test Workflow',
        active: true,
        status: 'running',
      };

      const workflow = new Workflow(data);

      expect(workflow.id).toBe('wf-123');
      expect(workflow.name).toBe('Test Workflow');
      expect(workflow.active).toBe(true);
      expect(workflow.status).toBe('running');
    });

    it('should set default values for optional fields', () => {
      const data = {
        id: 'wf-123',
        name: 'Test Workflow',
        active: true,
      };

      const workflow = new Workflow(data);

      expect(workflow.status).toBe('idle');
      expect(workflow.lastExecutionTime).toBeNull();
      expect(workflow.lastExecutionStatus).toBeNull();
      expect(workflow.executionCount).toBe(0);
      expect(workflow.errorCount).toBe(0);
      expect(workflow.averageExecutionTime).toBeNull();
    });

    it('should preserve optional fields when provided', () => {
      const data = {
        id: 'wf-123',
        name: 'Test Workflow',
        active: false,
        status: 'error',
        lastExecutionTime: '2025-10-04T10:00:00Z',
        lastExecutionStatus: 'error',
        executionCount: 42,
        errorCount: 5,
        averageExecutionTime: 1500,
      };

      const workflow = new Workflow(data);

      expect(workflow.lastExecutionTime).toBe('2025-10-04T10:00:00Z');
      expect(workflow.lastExecutionStatus).toBe('error');
      expect(workflow.executionCount).toBe(42);
      expect(workflow.errorCount).toBe(5);
      expect(workflow.averageExecutionTime).toBe(1500);
    });
  });

  describe('validate', () => {
    it('should return empty array for valid workflow', () => {
      const workflow = new Workflow({
        id: 'wf-123',
        name: 'Valid Workflow',
        active: true,
        status: 'idle',
      });

      const errors = workflow.validate();

      expect(errors).toEqual([]);
    });

    it('should return error for missing id', () => {
      const workflow = new Workflow({
        id: '',
        name: 'Test',
        active: true,
      });

      const errors = workflow.validate();

      expect(errors).toContain('id must be a non-empty string');
    });

    it('should return error for non-string id', () => {
      const workflow = new Workflow({
        id: 123,
        name: 'Test',
        active: true,
      });

      const errors = workflow.validate();

      expect(errors).toContain('id must be a non-empty string');
    });

    it('should return error for empty name', () => {
      const workflow = new Workflow({
        id: 'wf-123',
        name: '',
        active: true,
      });

      const errors = workflow.validate();

      expect(errors).toContain('name must be between 1 and 100 characters');
    });

    it('should return error for name too long', () => {
      const workflow = new Workflow({
        id: 'wf-123',
        name: 'a'.repeat(101),
        active: true,
      });

      const errors = workflow.validate();

      expect(errors).toContain('name must be between 1 and 100 characters');
    });

    it('should return error for non-boolean active', () => {
      const workflow = new Workflow({
        id: 'wf-123',
        name: 'Test',
        active: 'true',
      });

      const errors = workflow.validate();

      expect(errors).toContain('active must be a boolean');
    });

    it('should return error for invalid status', () => {
      const workflow = new Workflow({
        id: 'wf-123',
        name: 'Test',
        active: true,
        status: 'invalid',
      });

      const errors = workflow.validate();

      expect(errors).toContain('status must be one of: idle, running, error, disabled');
    });

    it('should accept all valid status values', () => {
      const validStatuses = ['idle', 'running', 'error', 'disabled'];

      validStatuses.forEach(status => {
        const workflow = new Workflow({
          id: 'wf-123',
          name: 'Test',
          active: true,
          status,
        });

        expect(workflow.validate()).toEqual([]);
      });
    });

    it('should return error for invalid lastExecutionStatus', () => {
      const workflow = new Workflow({
        id: 'wf-123',
        name: 'Test',
        active: true,
        lastExecutionStatus: 'invalid',
      });

      const errors = workflow.validate();

      expect(errors).toContain(
        'lastExecutionStatus must be one of: success, error, cancelled, running'
      );
    });

    it('should accept all valid lastExecutionStatus values', () => {
      const validStatuses = ['success', 'error', 'cancelled', 'running'];

      validStatuses.forEach(lastExecutionStatus => {
        const workflow = new Workflow({
          id: 'wf-123',
          name: 'Test',
          active: true,
          lastExecutionStatus,
        });

        expect(workflow.validate()).toEqual([]);
      });
    });

    it('should return error for negative executionCount', () => {
      const workflow = new Workflow({
        id: 'wf-123',
        name: 'Test',
        active: true,
        executionCount: -1,
      });

      const errors = workflow.validate();

      expect(errors).toContain('executionCount and errorCount must be non-negative');
    });

    it('should return error for negative errorCount', () => {
      const workflow = new Workflow({
        id: 'wf-123',
        name: 'Test',
        active: true,
        errorCount: -5,
      });

      const errors = workflow.validate();

      expect(errors).toContain('executionCount and errorCount must be non-negative');
    });

    it('should return error for zero or negative averageExecutionTime', () => {
      const workflow = new Workflow({
        id: 'wf-123',
        name: 'Test',
        active: true,
        averageExecutionTime: 0,
      });

      const errors = workflow.validate();

      expect(errors).toContain('averageExecutionTime must be positive or null');
    });

    it('should allow null averageExecutionTime', () => {
      const workflow = new Workflow({
        id: 'wf-123',
        name: 'Test',
        active: true,
        averageExecutionTime: null,
      });

      expect(workflow.validate()).toEqual([]);
    });

    it('should return multiple errors for multiple invalid fields', () => {
      const workflow = new Workflow({
        id: '',
        name: '',
        active: 'not-boolean',
        status: 'invalid',
      });

      const errors = workflow.validate();

      expect(errors.length).toBeGreaterThan(1);
      expect(errors).toContain('id must be a non-empty string');
      expect(errors).toContain('name must be between 1 and 100 characters');
    });
  });

  describe('isValid', () => {
    it('should return true for valid workflow', () => {
      const workflow = new Workflow({
        id: 'wf-123',
        name: 'Valid Workflow',
        active: true,
        status: 'idle',
      });

      expect(workflow.isValid()).toBe(true);
    });

    it('should return false for invalid workflow', () => {
      const workflow = new Workflow({
        id: '',
        name: 'Test',
        active: true,
      });

      expect(workflow.isValid()).toBe(false);
    });
  });

  describe('toJSON', () => {
    it('should return JSON representation with all fields', () => {
      const data = {
        id: 'wf-123',
        name: 'Test Workflow',
        active: true,
        status: 'running',
        lastExecutionTime: '2025-10-04T10:00:00Z',
        lastExecutionStatus: 'success',
        executionCount: 10,
        errorCount: 2,
        averageExecutionTime: 1200,
      };

      const workflow = new Workflow(data);
      const json = workflow.toJSON();

      expect(json).toEqual({
        id: 'wf-123',
        name: 'Test Workflow',
        active: true,
        status: 'running',
        lastExecutionTime: '2025-10-04T10:00:00Z',
        lastExecutionStatus: 'success',
        executionCount: 10,
        errorCount: 2,
        averageExecutionTime: 1200,
      });
    });

    it('should include null values in JSON', () => {
      const workflow = new Workflow({
        id: 'wf-123',
        name: 'Test',
        active: false,
      });

      const json = workflow.toJSON();

      expect(json.lastExecutionTime).toBeNull();
      expect(json.lastExecutionStatus).toBeNull();
      expect(json.averageExecutionTime).toBeNull();
    });
  });
});
