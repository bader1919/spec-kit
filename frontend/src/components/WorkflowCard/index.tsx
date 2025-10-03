import React from 'react';
import StatusIndicator from '../StatusIndicator';
import { formatRelativeTime, formatSuccessRate } from '../../utils/formatters';

interface WorkflowCardProps {
  workflow: {
    id: string;
    name: string;
    status: 'idle' | 'running' | 'error' | 'disabled';
    active: boolean;
    lastExecutionTime?: string;
    executionCount?: number;
    errorCount?: number;
    averageExecutionTime?: number;
  };
}

const WorkflowCard: React.FC<WorkflowCardProps> = ({ workflow }) => {
  return (
    <div
      data-testid="workflow-card"
      style={{
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        padding: '16px',
        backgroundColor: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{ marginBottom: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>{workflow.name}</h3>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <StatusIndicator status={workflow.status} type="workflow" />
      </div>

      <div style={{ fontSize: '14px', color: '#6B7280', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {workflow.lastExecutionTime && (
          <div data-testid="last-execution-time">
            Last run: {formatRelativeTime(workflow.lastExecutionTime)}
          </div>
        )}

        {workflow.executionCount !== undefined && (
          <div>
            Executions: {workflow.executionCount} | Success Rate:{' '}
            {formatSuccessRate(workflow.executionCount, workflow.errorCount || 0)}
          </div>
        )}

        {workflow.averageExecutionTime && (
          <div>Avg duration: {workflow.averageExecutionTime}ms</div>
        )}
      </div>
    </div>
  );
};

export default WorkflowCard;
