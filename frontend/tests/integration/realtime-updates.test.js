import { render, screen, waitFor } from '@testing-library/react';
import DashboardPage from '../../src/pages/DashboardPage';
import * as apiClient from '../../src/services/apiClient';

jest.mock('../../src/services/apiClient');

describe('Real-time Updates Integration Test', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should update workflow status within 5 seconds when execution starts', async () => {
    const mockWorkflow = {
      id: 'wf-1',
      name: 'Test Workflow',
      status: 'idle',
      active: true,
    };

    apiClient.getWorkflows = jest
      .fn()
      .mockResolvedValueOnce({ data: [mockWorkflow] })
      .mockResolvedValueOnce({ data: [{ ...mockWorkflow, status: 'running' }] });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Workflow')).toBeInTheDocument();
    });

    // Advance timers to trigger polling (3-5 seconds)
    jest.advanceTimersByTime(5000);

    await waitFor(() => {
      expect(screen.getByTestId('workflow-status-running')).toBeInTheDocument();
    });
  });

  it('should increment execution count after new execution', async () => {
    const mockWorkflow = {
      id: 'wf-1',
      name: 'Test Workflow',
      executionCount: 5,
    };

    apiClient.getWorkflows = jest
      .fn()
      .mockResolvedValueOnce({ data: [mockWorkflow] })
      .mockResolvedValueOnce({ data: [{ ...mockWorkflow, executionCount: 6 }] });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText(/5.*executions/i)).toBeInTheDocument();
    });

    jest.advanceTimersByTime(5000);

    await waitFor(() => {
      expect(screen.getByText(/6.*executions/i)).toBeInTheDocument();
    });
  });
});
