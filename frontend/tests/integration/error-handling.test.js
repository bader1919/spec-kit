import { render, screen, waitFor } from '@testing-library/react';
import DashboardPage from '../../src/pages/DashboardPage';
import * as apiClient from '../../src/services/apiClient';

jest.mock('../../src/services/apiClient');

describe('Connection Error Handling Integration Test', () => {
  it('should display connection error when n8n instance is unavailable', async () => {
    apiClient.getWorkflows = jest.fn().mockRejectedValue(new Error('Network Error'));

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText(/unable to connect/i)).toBeInTheDocument();
    });
  });

  it('should not crash when API fails', async () => {
    apiClient.getWorkflows = jest.fn().mockRejectedValue(new Error('500 Internal Server Error'));

    const { container } = render(<DashboardPage />);

    await waitFor(() => {
      expect(container).toBeInTheDocument();
      expect(screen.queryByTestId('dashboard-container')).toBeInTheDocument();
    });
  });

  it('should automatically reconnect when n8n becomes available', async () => {
    jest.useFakeTimers();

    apiClient.getWorkflows = jest
      .fn()
      .mockRejectedValueOnce(new Error('Network Error'))
      .mockResolvedValueOnce({ data: [{ id: 'wf-1', name: 'Test Workflow' }] });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText(/unable to connect/i)).toBeInTheDocument();
    });

    // Advance time to trigger retry
    jest.advanceTimersByTime(10000);

    await waitFor(() => {
      expect(screen.getByText('Test Workflow')).toBeInTheDocument();
      expect(screen.queryByText(/unable to connect/i)).not.toBeInTheDocument();
    });

    jest.useRealTimers();
  });

  it('should display authentication error when API key is invalid', async () => {
    apiClient.getWorkflows = jest.fn().mockRejectedValue({
      response: { status: 401, data: { error: 'Invalid API credentials' } },
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText(/invalid api credentials/i)).toBeInTheDocument();
    });
  });
});
