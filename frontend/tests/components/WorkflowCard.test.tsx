import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import WorkflowCard from '../../src/components/WorkflowCard';
import * as formatters from '../../src/utils/formatters';

jest.mock('../../src/components/StatusIndicator', () => {
  return function MockStatusIndicator({ status, type }: { status: string; type: string }) {
    return <div data-testid="status-indicator">{`${type}-${status}`}</div>;
  };
});

jest.mock('../../src/utils/formatters', () => ({
  formatRelativeTime: jest.fn((time) => `mocked-${time}`),
  formatSuccessRate: jest.fn((total, errors) => `${((total - errors) / total * 100).toFixed(1)}%`),
}));

describe('WorkflowCard', () => {
  const mockWorkflow = {
    id: 'wf-123',
    name: 'Test Workflow',
    status: 'idle' as const,
    active: true,
    lastExecutionTime: '2025-10-04T10:00:00Z',
    executionCount: 42,
    errorCount: 5,
    averageExecutionTime: 1500,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render workflow card with all information', () => {
    render(<WorkflowCard workflow={mockWorkflow} />);

    expect(screen.getByTestId('workflow-card')).toBeInTheDocument();
    expect(screen.getByText('Test Workflow')).toBeInTheDocument();
    expect(screen.getByTestId('status-indicator')).toHaveTextContent('workflow-idle');
  });

  it('should display workflow name', () => {
    render(<WorkflowCard workflow={mockWorkflow} />);

    const name = screen.getByText('Test Workflow');
    expect(name).toBeInTheDocument();
    expect(name.tagName).toBe('H3');
  });

  it('should render StatusIndicator with correct props', () => {
    render(<WorkflowCard workflow={mockWorkflow} />);

    const indicator = screen.getByTestId('status-indicator');
    expect(indicator).toHaveTextContent('workflow-idle');
  });

  it('should format and display last execution time when provided', () => {
    render(<WorkflowCard workflow={mockWorkflow} />);

    expect(formatters.formatRelativeTime).toHaveBeenCalledWith('2025-10-04T10:00:00Z');
    expect(screen.getByTestId('last-execution-time')).toHaveTextContent(
      'Last run: mocked-2025-10-04T10:00:00Z'
    );
  });

  it('should not display last execution time when not provided', () => {
    const workflow = { ...mockWorkflow, lastExecutionTime: undefined };
    render(<WorkflowCard workflow={workflow} />);

    expect(screen.queryByTestId('last-execution-time')).not.toBeInTheDocument();
  });

  it('should display execution count and success rate', () => {
    render(<WorkflowCard workflow={mockWorkflow} />);

    expect(formatters.formatSuccessRate).toHaveBeenCalledWith(42, 5);
    expect(screen.getByText(/Executions: 42/)).toBeInTheDocument();
    expect(screen.getByText(/Success Rate: 88.1%/)).toBeInTheDocument();
  });

  it('should handle zero error count for success rate', () => {
    const workflow = { ...mockWorkflow, errorCount: 0 };
    render(<WorkflowCard workflow={workflow} />);

    expect(formatters.formatSuccessRate).toHaveBeenCalledWith(42, 0);
    expect(screen.getByText(/Success Rate: 100.0%/)).toBeInTheDocument();
  });

  it('should not display execution stats when executionCount is undefined', () => {
    const workflow = {
      ...mockWorkflow,
      executionCount: undefined,
      errorCount: undefined,
    };
    render(<WorkflowCard workflow={workflow} />);

    expect(screen.queryByText(/Executions:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Success Rate:/)).not.toBeInTheDocument();
  });

  it('should display average execution time when provided', () => {
    render(<WorkflowCard workflow={mockWorkflow} />);

    expect(screen.getByText('Avg duration: 1500ms')).toBeInTheDocument();
  });

  it('should not display average execution time when not provided', () => {
    const workflow = { ...mockWorkflow, averageExecutionTime: undefined };
    render(<WorkflowCard workflow={workflow} />);

    expect(screen.queryByText(/Avg duration:/)).not.toBeInTheDocument();
  });

  it('should render with running status', () => {
    const workflow = { ...mockWorkflow, status: 'running' as const };
    render(<WorkflowCard workflow={workflow} />);

    expect(screen.getByTestId('status-indicator')).toHaveTextContent('workflow-running');
  });

  it('should render with error status', () => {
    const workflow = { ...mockWorkflow, status: 'error' as const };
    render(<WorkflowCard workflow={workflow} />);

    expect(screen.getByTestId('status-indicator')).toHaveTextContent('workflow-error');
  });

  it('should render with disabled status', () => {
    const workflow = { ...mockWorkflow, status: 'disabled' as const };
    render(<WorkflowCard workflow={workflow} />);

    expect(screen.getByTestId('status-indicator')).toHaveTextContent('workflow-disabled');
  });

  it('should render minimal workflow with only required fields', () => {
    const minimalWorkflow = {
      id: 'wf-minimal',
      name: 'Minimal Workflow',
      status: 'idle' as const,
      active: false,
    };

    render(<WorkflowCard workflow={minimalWorkflow} />);

    expect(screen.getByText('Minimal Workflow')).toBeInTheDocument();
    expect(screen.getByTestId('status-indicator')).toBeInTheDocument();
    expect(screen.queryByTestId('last-execution-time')).not.toBeInTheDocument();
    expect(screen.queryByText(/Executions:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Avg duration:/)).not.toBeInTheDocument();
  });

  it('should have correct styling structure', () => {
    render(<WorkflowCard workflow={mockWorkflow} />);

    const card = screen.getByTestId('workflow-card');
    expect(card).toHaveStyle({
      border: '1px solid #E5E7EB',
      borderRadius: '8px',
      padding: '16px',
      backgroundColor: 'white',
    });
  });
});
