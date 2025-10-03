const axios = require('axios');

class N8NClient {
  constructor(baseURL, apiKey) {
    this.client = axios.create({
      baseURL: baseURL || process.env.N8N_BASE_URL,
      headers: {
        'X-N8N-API-KEY': apiKey || process.env.N8N_API_KEY,
      },
      timeout: 10000,
    });

    // Response cache for rate limiting (2-3 seconds)
    this.cache = new Map();
    this.cacheTimeout = 2500; // 2.5 seconds
  }

  getCacheKey(url, params) {
    return `${url}-${JSON.stringify(params || {})}`;
  }

  async getWithCache(url, params = {}) {
    const cacheKey = this.getCacheKey(url, params);
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const response = await this.client.get(url, { params });
      const data = response.data;

      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });

      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getWorkflows() {
    return this.getWithCache('/workflows');
  }

  async getWorkflow(workflowId) {
    return this.getWithCache(`/workflows/${workflowId}`);
  }

  async getExecutions(params = {}) {
    // Default limit to 5 for last active executions
    const queryParams = {
      limit: params.limit || 5,
      ...params,
    };
    return this.getWithCache('/executions', queryParams);
  }

  async getExecution(executionId) {
    return this.getWithCache(`/executions/${executionId}`);
  }

  handleError(error) {
    if (error.response) {
      // N8N API error response
      const status = error.response.status;
      const data = error.response.data;

      if (status === 401) {
        return new Error('Invalid API credentials');
      } else if (status === 404) {
        return new Error('Resource not found');
      } else if (status === 429) {
        return new Error('Rate limit exceeded');
      } else if (status >= 500) {
        return new Error('N8N instance error');
      }

      return new Error(data.message || 'N8N API error');
    } else if (error.request) {
      // Network error - N8N instance unavailable
      return new Error('Unable to connect to N8N instance');
    } else {
      return new Error(error.message || 'Unknown error');
    }
  }

  clearCache() {
    this.cache.clear();
  }
}

module.exports = N8NClient;
