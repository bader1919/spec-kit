import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExecutionList from '../../src/components/ExecutionList';
import * as formatters from '../../src/utils/formatters';

jest.mock('../../src/components/StatusIndicator', () => {
  return function MockStatusIndicator({ status, type }: { status: string; type: string }) {
    return <div data-testid="status-indicator">{`${type}-${status}`}</div>;
  };
});

jest.mock('../../src/utils/formatters', () => ({
  formatRelativeTime: jest.fn((time) => `mocked-${time}`),
  formatDuration: jest.fn((duration) => `${duration}ms`),
}));

describe('ExecutionList', () => {
  const mockExecutions = [
    {
      id: 'exec-1',
      workflowId: 'wf-1',
      status: 'success' as const,
      startTime: '2025-10-04T10:00:00Z',
      endTime: '2025-10-04T10:00:05Z',
      duration: 5000,
    },
    {
      id: 'exec-2',
      workflowId: 'wf-1',
      status: 'error' as const,
      startTime: '2025-10-04T09:00:00Z',
      endTime: '2025-10-04T09:00:03Z',
      duration: 3000,
    },
    {
      id: 'exec-3',
      workflowId: 'wf-2',
      status: 'running' as const,
      startTime: '2025-10-04T11:00:00Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render execution list container', () => {
      render(<ExecutionList executions={mockExecutions} />);

      expect(screen.getByTestId('execution-list')).toBeInTheDocument();
    });

    it('should render all executions', () => {
      render(<ExecutionList executions={mockExecutions} />);

      const items = screen.getAllByTestId('execution-item');
      expect(items).toHaveLength(3);
    });

    it('should display empty state when no executions', () => {
      render(<ExecutionList executions={[]} />);

      expect(screen.getByText('No executions found')).toBeInTheDocument();
      expect(screen.queryByTestId('execution-item')).not.toBeInTheDocument();
    });

    it('should render StatusIndicator for each execution', () => {
      render(<ExecutionList executions={mockExecutions} />);

      const indicators = screen.getAllByTestId('status-indicator');
      expect(indicators).toHaveLength(3);
    });
  });

  describe('sorting', () => {
    it('should sort executions by most recent first', () => {
      render(<ExecutionList executions={mockExecutions} />);

      const items = screen.getAllByTestId('execution-item');

      // exec-3 has startTime 11:00 (most recent)
      expect(items[0]).toHaveAttribute('data-execution-id', 'exec-3');
      // exec-1 has startTime 10:00
      expect(items[1]).toHaveAttribute('data-execution-id', 'exec-1');
      // exec-2 has startTime 09:00 (oldest)
      expect(items[2]).toHaveAttribute('data-execution-id', 'exec-2');
    });

    it('should not mutate original executions array', () => {
      const executions = [...mockExecutions];
      render(<ExecutionList executions={executions} />);

      // Original array order should be unchanged
      expect(executions[0].id).toBe('exec-1');
      expect(executions[1].id).toBe('exec-2');
      expect(executions[2].id).toBe('exec-3');
    });
  });

  describe('status display', () => {
    it('should display success status', () => {
      const executions = [mockExecutions[0]];
      render(<ExecutionList executions={executions} />);

      expect(screen.getByTestId('status-indicator')).toHaveTextContent('execution-success');
    });

    it('should display error status', () => {
      const executions = [mockExecutions[1]];
      render(<ExecutionList executions={executions} />);

      expect(screen.getByTestId('status-indicator')).toHaveTextContent('execution-error');
    });

    it('should display running status', () => {
      const executions = [mockExecutions[2]];
      render(<ExecutionList executions={executions} />);

      expect(screen.getByTestId('status-indicator')).toHaveTextContent('execution-running');
    });

    it('should display cancelled status', () => {
      const executions = [
        {
          id: 'exec-cancelled',
          workflowId: 'wf-1',
          status: 'cancelled' as const,
          startTime: '2025-10-04T10:00:00Z',
        },
      ];
      render(<ExecutionList executions={executions} />);

      expect(screen.getByTestId('status-indicator')).toHaveTextContent('execution-cancelled');
    });
  });

  describe('timestamp display', () => {
    it('should format and display start time', () => {
      render(<ExecutionList executions={[mockExecutions[0]]} />);

      expect(formatters.formatRelativeTime).toHaveBeenCalledWith('2025-10-04T10:00:00Z');
      expect(screen.getByTestId('execution-timestamp')).toHaveTextContent(
        'mocked-2025-10-04T10:00:00Z'
      );
    });
  });

  describe('duration display', () => {
    it('should display duration when provided', () => {
      render(<ExecutionList executions={[mockExecutions[0]]} />);

      expect(formatters.formatDuration).toHaveBeenCalledWith(5000);
      expect(screen.getByText(/Duration: 5000ms/)).toBeInTheDocument();
    });

    it('should not display duration when not provided', () => {
      render(<ExecutionList executions={[mockExecutions[2]]} />);

      expect(formatters.formatDuration).not.toHaveBeenCalled();
      expect(screen.queryByText(/Duration:/)).not.toBeInTheDocument();
    });
  });

  describe('click handling', () => {
    it('should call onExecutionClick when item is clicked', () => {
      const onExecutionClick = jest.fn();
      render(<ExecutionList executions={[mockExecutions[0]]} onExecutionClick={onExecutionClick} />);

      const item = screen.getByTestId('execution-item');
      fireEvent.click(item);

      expect(onExecutionClick).toHaveBeenCalledWith('exec-1');
    });

    it('should not throw when onExecutionClick is not provided', () => {
      render(<ExecutionList executions={[mockExecutions[0]]} />);

      const item = screen.getByTestId('execution-item');
      expect(() => fireEvent.click(item)).not.toThrow();
    });

    it('should show pointer cursor when onExecutionClick is provided', () => {
      const onExecutionClick = jest.fn();
      render(<ExecutionList executions={[mockExecutions[0]]} onExecutionClick={onExecutionClick} />);

      const item = screen.getByTestId('execution-item');
      expect(item).toHaveStyle({ cursor: 'pointer' });
    });

    it('should show default cursor when onExecutionClick is not provided', () => {
      render(<ExecutionList executions={[mockExecutions[0]]} />);

      const item = screen.getByTestId('execution-item');
      expect(item).toHaveStyle({ cursor: 'default' });
    });
  });

  describe('hover effects', () => {
    it('should apply box shadow on hover when clickable', () => {
      const onExecutionClick = jest.fn();
      render(<ExecutionList executions={[mockExecutions[0]]} onExecutionClick={onExecutionClick} />);

      const item = screen.getByTestId('execution-item');

      fireEvent.mouseEnter(item);
      expect(item).toHaveStyle({ boxShadow: '0 2px 6px rgba(0,0,0,0.1)' });

      fireEvent.mouseLeave(item);
      expect(item).toHaveStyle({ boxShadow: 'none' });
    });

    it('should not apply box shadow on hover when not clickable', () => {
      render(<ExecutionList executions={[mockExecutions[0]]} />);

      const item = screen.getByTestId('execution-item');

      fireEvent.mouseEnter(item);
      expect(item).toHaveStyle({ boxShadow: 'none' });
    });
  });

  describe('edge cases', () => {
    it('should handle execution with minimal data', () => {
      const minimalExecution = [
        {
          id: 'exec-minimal',
          workflowId: 'wf-1',
          status: 'running' as const,
          startTime: '2025-10-04T10:00:00Z',
        },
      ];

      render(<ExecutionList executions={minimalExecution} />);

      expect(screen.getByTestId('execution-item')).toBeInTheDocument();
      expect(screen.getByTestId('status-indicator')).toBeInTheDocument();
      expect(screen.getByTestId('execution-timestamp')).toBeInTheDocument();
      expect(screen.queryByText(/Duration:/)).not.toBeInTheDocument();
    });

    it('should handle multiple executions with same timestamp', () => {
      const executions = [
        {
          id: 'exec-1',
          workflowId: 'wf-1',
          status: 'success' as const,
          startTime: '2025-10-04T10:00:00Z',
        },
        {
          id: 'exec-2',
          workflowId: 'wf-1',
          status: 'success' as const,
          startTime: '2025-10-04T10:00:00Z',
        },
      ];

      render(<ExecutionList executions={executions} />);

      const items = screen.getAllByTestId('execution-item');
      expect(items).toHaveLength(2);
    });
  });
});
