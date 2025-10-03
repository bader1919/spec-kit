import { render, screen, waitFor } from '@testing-library/react';
import DashboardPage from '../../src/pages/DashboardPage';

// Mock the API client
jest.mock('../../src/services/apiClient');

describe('Dashboard Load Integration Test', () => {
  it('should load dashboard within 2 seconds', async () => {
    const startTime = Date.now();

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-container')).toBeInTheDocument();
    }, { timeout: 2000 });

    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
  });

  it('should display current status of all workflows', async () => {
    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByTestId('workflow-list')).toBeInTheDocument();
    });

    const workflowCards = screen.getAllByTestId('workflow-card');
    expect(workflowCards.length).toBeGreaterThan(0);
  });

  it('should show workflow cards with names, statuses, and last execution times', async () => {
    render(<DashboardPage />);

    await waitFor(() => {
      const workflowCard = screen.getAllByTestId('workflow-card')[0];
      expect(workflowCard).toHaveTextContent(/workflow/i);
      expect(workflowCard.querySelector('[data-testid="workflow-status"]')).toBeInTheDocument();
      expect(workflowCard.querySelector('[data-testid="last-execution-time"]')).toBeInTheDocument();
    });
  });
});
