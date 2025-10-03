import { getWorkflows, getExecutions, getExecutionDetails } from './apiClient';

class DashboardService {
  async fetchDashboardData() {
    try {
      const [workflowsResponse, executionsResponse] = await Promise.all([
        getWorkflows(),
        getExecutions({ limit: 5 }),
      ]);

      return {
        workflows: workflowsResponse.data || [],
        executions: executionsResponse.data || [],
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw error;
    }
  }

  async fetchWorkflowExecutions(workflowId) {
    try {
      const response = await getExecutions({ workflowId, limit: 5 });
      return response.data || [];
    } catch (error) {
      throw error;
    }
  }

  async fetchExecutionDetails(executionId) {
    try {
      const response = await getExecutionDetails(executionId);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  getWorkflowStatusColor(status) {
    const statusColors = {
      idle: '#6B7280',
      running: '#3B82F6',
      error: '#EF4444',
      disabled: '#9CA3AF',
    };
    return statusColors[status] || '#6B7280';
  }

  getExecutionStatusColor(status) {
    const statusColors = {
      success: '#10B981',
      running: '#3B82F6',
      error: '#EF4444',
      cancelled: '#F59E0B',
    };
    return statusColors[status] || '#6B7280';
  }
}

export default new DashboardService();
