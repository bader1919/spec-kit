import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token if needed
apiClient.interceptors.request.use(
  (config) => {
    const apiKey = localStorage.getItem('n8n_api_key');
    if (apiKey) {
      config.headers['X-N8N-API-KEY'] = apiKey;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;
      const errorMessage = data.error?.message || 'An error occurred';

      if (status === 401) {
        // Handle authentication error
        localStorage.removeItem('n8n_api_key');
      }

      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      // No response received
      return Promise.reject(new Error('Unable to connect to server'));
    }
    return Promise.reject(error);
  }
);

export const getWorkflows = () => apiClient.get('/api/workflows');

export const getWorkflow = (workflowId) => apiClient.get(`/api/workflows/${workflowId}`);

export const getExecutions = (params = {}) => apiClient.get('/api/executions', { params });

export const getExecutionDetails = (executionId) =>
  apiClient.get(`/api/executions/${executionId}`);

export default apiClient;
