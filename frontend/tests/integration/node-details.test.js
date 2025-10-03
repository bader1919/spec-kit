import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DashboardPage from '../../src/pages/DashboardPage';
import * as apiClient from '../../src/services/apiClient';

jest.mock('../../src/services/apiClient');

describe('Node-level Details Integration Test', () => {
  it('should display node details when execution is clicked', async () => {
    const mockExecution = {
      id: 'exec-1',
      workflowId: 'wf-1',
      status: 'success',
    };

    const mockExecutionDetail = {
      ...mockExecution,
      nodes: [
        {
          name: 'Start',
          type: 'trigger',
          executionStatus: 'success',
          executionTime: 50,
        },
        {
          name: 'Process Data',
          type: 'action',
          executionStatus: 'success',
          executionTime: 1200,
        },
      ],
    };

    apiClient.getExecutions = jest.fn().mockResolvedValue({ data: [mockExecution] });
    apiClient.getExecutionDetails = jest.fn().mockResolvedValue({ data: mockExecutionDetail });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByTestId('execution-item')).toBeInTheDocument();
    });

    const executionItem = screen.getByTestId('execution-item');
    await userEvent.click(executionItem);

    await waitFor(() => {
      expect(screen.getByTestId('node-details-panel')).toBeInTheDocument();
    });
  });

  it('should show each node with name, type, status, and execution time', async () => {
    const mockExecutionDetail = {
      id: 'exec-1',
      nodes: [
        {
          name: 'Start',
          type: 'trigger',
          executionStatus: 'success',
          executionTime: 50,
        },
      ],
    };

    apiClient.getExecutionDetails = jest.fn().mockResolvedValue({ data: mockExecutionDetail });

    render(<DashboardPage />);

    // Simulate clicking an execution
    await waitFor(async () => {
      const execution = screen.getByTestId('execution-item');
      await userEvent.click(execution);
    });

    await waitFor(() => {
      const nodeItem = screen.getByTestId('node-item');
      expect(nodeItem).toHaveTextContent('Start');
      expect(nodeItem).toHaveTextContent('trigger');
      expect(nodeItem).toHaveTextContent('success');
      expect(nodeItem).toHaveTextContent('50'); // execution time in ms
    });
  });

  it('should display error message for failed nodes', async () => {
    const mockExecutionDetail = {
      id: 'exec-1',
      nodes: [
        {
          name: 'FailedNode',
          type: 'action',
          executionStatus: 'error',
          errorDetails: 'Connection timeout',
        },
      ],
    };

    apiClient.getExecutionDetails = jest.fn().mockResolvedValue({ data: mockExecutionDetail });

    render(<DashboardPage />);

    await waitFor(async () => {
      const execution = screen.getByTestId('execution-item');
      await userEvent.click(execution);
    });

    await waitFor(() => {
      expect(screen.getByText(/Connection timeout/i)).toBeInTheDocument();
    });
  });
});
