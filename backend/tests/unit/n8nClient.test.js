const axios = require('axios');
const N8NClient = require('../../src/services/n8nClient');

jest.mock('axios');

describe('N8NClient', () => {
  let client;
  const mockBaseURL = 'http://localhost:5678/api/v1';
  const mockApiKey = 'test-api-key';

  beforeEach(() => {
    jest.clearAllMocks();
    client = new N8NClient(mockBaseURL, mockApiKey);
  });

  describe('constructor', () => {
    it('should create axios client with correct config', () => {
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: mockBaseURL,
        headers: {
          'X-N8N-API-KEY': mockApiKey,
        },
        timeout: 10000,
      });
    });

    it('should use environment variables if not provided', () => {
      process.env.N8N_BASE_URL = 'http://env-url';
      process.env.N8N_API_KEY = 'env-key';

      new N8NClient();

      expect(axios.create).toHaveBeenCalledWith({
        baseURL: 'http://env-url',
        headers: {
          'X-N8N-API-KEY': 'env-key',
        },
        timeout: 10000,
      });
    });

    it('should initialize cache and cacheTimeout', () => {
      expect(client.cache).toBeInstanceOf(Map);
      expect(client.cacheTimeout).toBe(2500);
    });
  });

  describe('getCacheKey', () => {
    it('should generate cache key from url and params', () => {
      const key = client.getCacheKey('/workflows', { limit: 5 });
      expect(key).toBe('/workflows-{"limit":5}');
    });

    it('should handle empty params', () => {
      const key = client.getCacheKey('/workflows');
      expect(key).toBe('/workflows-{}');
    });
  });

  describe('getWithCache', () => {
    const mockData = { data: [{ id: '1', name: 'Test' }] };

    beforeEach(() => {
      client.client.get = jest.fn().mockResolvedValue({ data: mockData });
    });

    it('should fetch data from API on first call', async () => {
      const result = await client.getWithCache('/workflows');

      expect(client.client.get).toHaveBeenCalledWith('/workflows', { params: {} });
      expect(result).toEqual(mockData);
    });

    it('should cache the response', async () => {
      await client.getWithCache('/workflows');

      const cacheKey = client.getCacheKey('/workflows', {});
      const cached = client.cache.get(cacheKey);

      expect(cached).toBeDefined();
      expect(cached.data).toEqual(mockData);
      expect(cached.timestamp).toBeLessThanOrEqual(Date.now());
    });

    it('should return cached data within cache timeout', async () => {
      // First call - fetches from API
      await client.getWithCache('/workflows');

      // Second call - should use cache
      const result = await client.getWithCache('/workflows');

      expect(client.client.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockData);
    });

    it('should fetch fresh data after cache expires', async () => {
      // First call
      await client.getWithCache('/workflows');

      // Mock time passing beyond cache timeout
      const cacheKey = client.getCacheKey('/workflows', {});
      const cached = client.cache.get(cacheKey);
      cached.timestamp = Date.now() - 3000; // 3 seconds ago (past 2.5s timeout)

      // Second call - should fetch fresh data
      await client.getWithCache('/workflows');

      expect(client.client.get).toHaveBeenCalledTimes(2);
    });

    it('should pass params to axios', async () => {
      await client.getWithCache('/executions', { limit: 10 });

      expect(client.client.get).toHaveBeenCalledWith('/executions', {
        params: { limit: 10 },
      });
    });

    it('should handle API errors', async () => {
      const error = new Error('API Error');
      error.response = { status: 500, data: { message: 'Server error' } };
      client.client.get = jest.fn().mockRejectedValue(error);

      await expect(client.getWithCache('/workflows')).rejects.toThrow('N8N instance error');
    });
  });

  describe('getWorkflows', () => {
    it('should call getWithCache with correct endpoint', async () => {
      client.getWithCache = jest.fn().mockResolvedValue([]);

      await client.getWorkflows();

      expect(client.getWithCache).toHaveBeenCalledWith('/workflows');
    });
  });

  describe('getWorkflow', () => {
    it('should call getWithCache with workflow ID', async () => {
      client.getWithCache = jest.fn().mockResolvedValue({});

      await client.getWorkflow('wf-123');

      expect(client.getWithCache).toHaveBeenCalledWith('/workflows/wf-123');
    });
  });

  describe('getExecutions', () => {
    it('should call getWithCache with default limit of 5', async () => {
      client.getWithCache = jest.fn().mockResolvedValue([]);

      await client.getExecutions();

      expect(client.getWithCache).toHaveBeenCalledWith('/executions', { limit: 5 });
    });

    it('should allow custom limit', async () => {
      client.getWithCache = jest.fn().mockResolvedValue([]);

      await client.getExecutions({ limit: 10 });

      expect(client.getWithCache).toHaveBeenCalledWith('/executions', { limit: 10 });
    });

    it('should pass additional params', async () => {
      client.getWithCache = jest.fn().mockResolvedValue([]);

      await client.getExecutions({ limit: 3, status: 'error' });

      expect(client.getWithCache).toHaveBeenCalledWith('/executions', {
        limit: 3,
        status: 'error',
      });
    });
  });

  describe('getExecution', () => {
    it('should call getWithCache with execution ID', async () => {
      client.getWithCache = jest.fn().mockResolvedValue({});

      await client.getExecution('exec-456');

      expect(client.getWithCache).toHaveBeenCalledWith('/executions/exec-456');
    });
  });

  describe('handleError', () => {
    it('should handle 401 authentication errors', () => {
      const error = {
        response: {
          status: 401,
          data: {},
        },
      };

      const result = client.handleError(error);

      expect(result.message).toBe('Invalid API credentials');
    });

    it('should handle 404 not found errors', () => {
      const error = {
        response: {
          status: 404,
          data: {},
        },
      };

      const result = client.handleError(error);

      expect(result.message).toBe('Resource not found');
    });

    it('should handle 429 rate limit errors', () => {
      const error = {
        response: {
          status: 429,
          data: {},
        },
      };

      const result = client.handleError(error);

      expect(result.message).toBe('Rate limit exceeded');
    });

    it('should handle 500 server errors', () => {
      const error = {
        response: {
          status: 500,
          data: {},
        },
      };

      const result = client.handleError(error);

      expect(result.message).toBe('N8N instance error');
    });

    it('should use custom error message if provided', () => {
      const error = {
        response: {
          status: 400,
          data: { message: 'Custom error message' },
        },
      };

      const result = client.handleError(error);

      expect(result.message).toBe('Custom error message');
    });

    it('should handle network errors', () => {
      const error = {
        request: {},
      };

      const result = client.handleError(error);

      expect(result.message).toBe('Unable to connect to N8N instance');
    });

    it('should handle unknown errors', () => {
      const error = {
        message: 'Something went wrong',
      };

      const result = client.handleError(error);

      expect(result.message).toBe('Something went wrong');
    });

    it('should handle errors with no message', () => {
      const error = {};

      const result = client.handleError(error);

      expect(result.message).toBe('Unknown error');
    });
  });

  describe('clearCache', () => {
    it('should clear the cache', async () => {
      client.client.get = jest.fn().mockResolvedValue({ data: [] });

      // Add items to cache
      await client.getWorkflows();
      expect(client.cache.size).toBeGreaterThan(0);

      // Clear cache
      client.clearCache();

      expect(client.cache.size).toBe(0);
    });
  });
});
