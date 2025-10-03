import React from 'react';
import dashboardService from '../../services/dashboardService';

interface StatusIndicatorProps {
  status: 'idle' | 'running' | 'error' | 'disabled' | 'success' | 'cancelled';
  type?: 'workflow' | 'execution';
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, type = 'workflow' }) => {
  const color =
    type === 'workflow'
      ? dashboardService.getWorkflowStatusColor(status)
      : dashboardService.getExecutionStatusColor(status);

  const getStatusIcon = () => {
    switch (status) {
      case 'running':
        return '⟳';
      case 'error':
        return '✕';
      case 'success':
        return '✓';
      case 'disabled':
        return '○';
      default:
        return '○';
    }
  };

  return (
    <div
      data-testid={`workflow-status-${status}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 8px',
        borderRadius: '4px',
        backgroundColor: `${color}20`,
        color: color,
        fontSize: '14px',
        fontWeight: 500,
      }}
    >
      <span>{getStatusIcon()}</span>
      <span style={{ textTransform: 'capitalize' }}>{status}</span>
    </div>
  );
};

export default StatusIndicator;
