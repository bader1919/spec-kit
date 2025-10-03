import { render, screen, waitFor } from '@testing-library/react';
import DashboardPage from '../../src/pages/DashboardPage';
import * as apiClient from '../../src/services/apiClient';

jest.mock('../../src/services/apiClient');

describe('Execution History Integration Test', () => {
  it('should display last 5 executions', async () => {
    const mockExecutions = Array.from({ length: 7 }, (_, i) => ({
      id: `exec-${i}`,
      workflowId: 'wf-1',
      status: 'success',
      startTime: new Date(Date.now() - i * 60000).toISOString(),
      duration: 1500,
    }));

    apiClient.getExecutions = jest.fn().mockResolvedValue({
      data: mockExecutions.slice(0, 5), // Only 5 returned
    });

    render(<DashboardPage />);

    await waitFor(() => {
      const executionItems = screen.getAllByTestId('execution-item');
      expect(executionItems).toHaveLength(5);
    });
  });

  it('should show timestamp, status, and duration for each execution', async () => {
    const mockExecution = {
      id: 'exec-1',
      workflowId: 'wf-1',
      status: 'success',
      startTime: '2025-10-03T10:00:00Z',
      duration: 2500,
    };

    apiClient.getExecutions = jest.fn().mockResolvedValue({
      data: [mockExecution],
    });

    render(<DashboardPage />);

    await waitFor(() => {
      const executionItem = screen.getByTestId('execution-item');
      expect(executionItem).toHaveTextContent(/success/i);
      expect(executionItem).toHaveTextContent(/2500/); // duration
      expect(executionItem.querySelector('[data-testid="execution-timestamp"]')).toBeInTheDocument();
    });
  });

  it('should order executions by most recent first', async () => {
    const mockExecutions = [
      {
        id: 'exec-1',
        startTime: '2025-10-03T10:00:00Z',
        status: 'success',
      },
      {
        id: 'exec-2',
        startTime: '2025-10-03T11:00:00Z',
        status: 'success',
      },
      {
        id: 'exec-3',
        startTime: '2025-10-03T09:00:00Z',
        status: 'error',
      },
    ];

    apiClient.getExecutions = jest.fn().mockResolvedValue({
      data: mockExecutions,
    });

    render(<DashboardPage />);

    await waitFor(() => {
      const executionItems = screen.getAllByTestId('execution-item');
      // First item should be the most recent (exec-2 at 11:00)
      expect(executionItems[0]).toHaveAttribute('data-execution-id', 'exec-2');
    });
  });
});
