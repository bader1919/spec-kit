const Workflow = require('../models/workflow');
const Execution = require('../models/execution');
const Node = require('../models/node');

class DashboardService {
  constructor(n8nClient) {
    this.n8nClient = n8nClient;
  }

  async getWorkflows() {
    const workflows = await this.n8nClient.getWorkflows();
    return workflows.data.map((wf) => new Workflow(wf).toJSON());
  }

  async getWorkflow(workflowId) {
    const workflow = await this.n8nClient.getWorkflow(workflowId);
    return new Workflow(workflow).toJSON();
  }

  async getExecutions(params = {}) {
    const executions = await this.n8nClient.getExecutions(params);
    return executions.data.map((exec) => new Execution(exec).toJSON());
  }

  async getExecutionDetails(executionId) {
    const execution = await this.n8nClient.getExecution(executionId);

    // Transform to include node details
    const nodes = (execution.data?.resultData?.runData || {});
    const nodeDetails = Object.keys(nodes).map((nodeName) => {
      const nodeData = nodes[nodeName][0];
      return new Node({
        name: nodeName,
        type: nodeData.source?.[0]?.type || 'unknown',
        executionStatus: nodeData.error ? 'error' : 'success',
        startTime: nodeData.startTime,
        endTime: nodeData.executionTime
          ? new Date(new Date(nodeData.startTime).getTime() + nodeData.executionTime)
          : null,
        executionTime: nodeData.executionTime || null,
        errorDetails: nodeData.error?.message || null,
      }).toJSON();
    });

    return {
      ...new Execution(execution).toJSON(),
      nodes: nodeDetails,
    };
  }

  transformN8NWorkflow(n8nWorkflow) {
    return {
      id: n8nWorkflow.id,
      name: n8nWorkflow.name,
      active: n8nWorkflow.active,
      status: this.getWorkflowStatus(n8nWorkflow),
      lastExecutionTime: n8nWorkflow.updatedAt,
      lastExecutionStatus: null, // Requires execution data
      executionCount: 0, // Would need to fetch from executions
      errorCount: 0,
      averageExecutionTime: null,
    };
  }

  getWorkflowStatus(workflow) {
    if (!workflow.active) return 'disabled';
    // Status would be determined by recent execution data
    return 'idle';
  }
}

module.exports = DashboardService;
