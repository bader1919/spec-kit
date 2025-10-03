import React, { useState } from 'react';
import WorkflowCard from '../WorkflowCard';
import ExecutionList from '../ExecutionList';
import Charts from '../Charts';
import { useRealTimeData } from '../../hooks/useRealTimeData';

const Dashboard: React.FC = () => {
  const { workflows, executions, loading, error, refresh, isPolling } = useRealTimeData();
  const [selectedExecution, setSelectedExecution] = useState<string | null>(null);

  if (loading && workflows.length === 0) {
    return (
      <div data-testid="dashboard-container" style={{ padding: '24px', textAlign: 'center' }}>
        <div>Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div data-testid="dashboard-container" style={{ padding: '24px' }}>
        <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #EF4444', borderRadius: '8px', padding: '16px', color: '#B91C1C' }}>
          <strong>Error:</strong> {error}
        </div>
        <button
          onClick={refresh}
          style={{
            marginTop: '16px',
            padding: '8px 16px',
            backgroundColor: '#3B82F6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div data-testid="dashboard-container" style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0 }}>N8N Dashboard</h1>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#6B7280' }}>
            {isPolling ? '🟢 Live' : '⚫ Paused'}
          </span>
          <button
            onClick={refresh}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3B82F6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Workflows Grid */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ marginBottom: '16px' }}>Workflows</h2>
        <div
          data-testid="workflow-list"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}
        >
          {workflows.length === 0 ? (
            <div style={{ padding: '16px', color: '#6B7280' }}>No workflows found</div>
          ) : (
            workflows.map((workflow) => <WorkflowCard key={workflow.id} workflow={workflow} />)
          )}
        </div>
      </div>

      {/* Execution History and Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div>
          <h2 style={{ marginBottom: '16px' }}>Recent Executions</h2>
          <ExecutionList executions={executions} onExecutionClick={setSelectedExecution} />
        </div>

        <div>
          <h2 style={{ marginBottom: '16px' }}>Performance</h2>
          <Charts executions={executions} />
        </div>
      </div>

      {/* Node Details Panel (placeholder for T015) */}
      {selectedExecution && (
        <div
          data-testid="node-details-panel"
          style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
          }}
        >
          <h3>Execution Details: {selectedExecution}</h3>
          <div data-testid="node-item" style={{ padding: '8px', color: '#6B7280' }}>
            Node details would be loaded here...
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
