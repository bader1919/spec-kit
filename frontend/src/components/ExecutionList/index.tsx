import React from 'react';
import StatusIndicator from '../StatusIndicator';
import { formatRelativeTime, formatDuration } from '../../utils/formatters';

interface Execution {
  id: string;
  workflowId: string;
  status: 'running' | 'success' | 'error' | 'cancelled';
  startTime: string;
  endTime?: string;
  duration?: number;
}

interface ExecutionListProps {
  executions: Execution[];
  onExecutionClick?: (executionId: string) => void;
}

const ExecutionList: React.FC<ExecutionListProps> = ({ executions, onExecutionClick }) => {
  // Sort by most recent first
  const sortedExecutions = [...executions].sort(
    (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );

  return (
    <div data-testid="execution-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {sortedExecutions.length === 0 ? (
        <div style={{ padding: '16px', textAlign: 'center', color: '#6B7280' }}>
          No executions found
        </div>
      ) : (
        sortedExecutions.map((execution) => (
          <div
            key={execution.id}
            data-testid="execution-item"
            data-execution-id={execution.id}
            onClick={() => onExecutionClick?.(execution.id)}
            style={{
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              padding: '12px',
              backgroundColor: 'white',
              cursor: onExecutionClick ? 'pointer' : 'default',
              transition: 'box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              if (onExecutionClick) {
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <StatusIndicator status={execution.status} type="execution" />
              </div>
              <div data-testid="execution-timestamp" style={{ fontSize: '12px', color: '#9CA3AF' }}>
                {formatRelativeTime(execution.startTime)}
              </div>
            </div>

            {execution.duration && (
              <div style={{ marginTop: '8px', fontSize: '14px', color: '#6B7280' }}>
                Duration: {formatDuration(execution.duration)}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ExecutionList;
