import { renderHook, act, waitFor } from '@testing-library/react';
import { useRealTimeData } from '../../src/hooks/useRealTimeData';
import dashboardService from '../../src/services/dashboardService';

jest.mock('../../src/services/dashboardService');

describe('useRealTimeData', () => {
  const mockDashboardData = {
    workflows: [
      { id: 'wf-1', name: 'Workflow 1', status: 'idle' },
      { id: 'wf-2', name: 'Workflow 2', status: 'running' },
    ],
    executions: [
      { id: 'exec-1', workflowId: 'wf-1', status: 'success' },
      { id: 'exec-2', workflowId: 'wf-2', status: 'running' },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    dashboardService.fetchDashboardData.mockResolvedValue(mockDashboardData);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('initial state', () => {
    it('should initialize with loading state', () => {
      const { result } = renderHook(() => useRealTimeData());

      expect(result.current.loading).toBe(true);
      expect(result.current.workflows).toEqual([]);
      expect(result.current.executions).toEqual([]);
      expect(result.current.error).toBeNull();
      expect(result.current.isPolling).toBe(true);
    });
  });

  describe('data fetching', () => {
    it('should fetch data immediately on mount', async () => {
      renderHook(() => useRealTimeData());

      await waitFor(() => {
        expect(dashboardService.fetchDashboardData).toHaveBeenCalledTimes(1);
      });
    });

    it('should update state with fetched data', async () => {
      const { result } = renderHook(() => useRealTimeData());

      await waitFor(() => {
        expect(result.current.workflows).toEqual(mockDashboardData.workflows);
        expect(result.current.executions).toEqual(mockDashboardData.executions);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
      });
    });

    it('should handle fetch errors', async () => {
      const errorMessage = 'Network error';
      dashboardService.fetchDashboardData.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useRealTimeData());

      await waitFor(() => {
        expect(result.current.error).toBe(errorMessage);
        expect(result.current.loading).toBe(false);
      });
    });

    it('should clear error on successful fetch after error', async () => {
      // First fetch fails
      dashboardService.fetchDashboardData.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useRealTimeData());

      await waitFor(() => {
        expect(result.current.error).toBe('Network error');
      });

      // Second fetch succeeds
      dashboardService.fetchDashboardData.mockResolvedValueOnce(mockDashboardData);

      act(() => {
        jest.advanceTimersByTime(4000);
      });

      await waitFor(() => {
        expect(result.current.error).toBeNull();
        expect(result.current.workflows).toEqual(mockDashboardData.workflows);
      });
    });
  });

  describe('polling behavior', () => {
    it('should set up polling interval on mount', async () => {
      renderHook(() => useRealTimeData());

      // Initial fetch
      await waitFor(() => {
        expect(dashboardService.fetchDashboardData).toHaveBeenCalledTimes(1);
      });

      // First poll after 4 seconds
      act(() => {
        jest.advanceTimersByTime(4000);
      });

      await waitFor(() => {
        expect(dashboardService.fetchDashboardData).toHaveBeenCalledTimes(2);
      });

      // Second poll after another 4 seconds
      act(() => {
        jest.advanceTimersByTime(4000);
      });

      await waitFor(() => {
        expect(dashboardService.fetchDashboardData).toHaveBeenCalledTimes(3);
      });
    });

    it('should clean up interval on unmount', async () => {
      const { unmount } = renderHook(() => useRealTimeData());

      await waitFor(() => {
        expect(dashboardService.fetchDashboardData).toHaveBeenCalledTimes(1);
      });

      unmount();

      act(() => {
        jest.advanceTimersByTime(4000);
      });

      // Should not fetch again after unmount
      expect(dashboardService.fetchDashboardData).toHaveBeenCalledTimes(1);
    });

    it('should poll every 4 seconds', async () => {
      renderHook(() => useRealTimeData());

      await waitFor(() => {
        expect(dashboardService.fetchDashboardData).toHaveBeenCalledTimes(1);
      });

      // Test multiple intervals
      for (let i = 2; i <= 5; i++) {
        act(() => {
          jest.advanceTimersByTime(4000);
        });

        await waitFor(() => {
          expect(dashboardService.fetchDashboardData).toHaveBeenCalledTimes(i);
        });
      }
    });
  });

  describe('startPolling', () => {
    it('should start polling and fetch immediately', async () => {
      const { result } = renderHook(() => useRealTimeData());

      await waitFor(() => {
        expect(dashboardService.fetchDashboardData).toHaveBeenCalledTimes(1);
      });

      // Stop polling
      act(() => {
        result.current.stopPolling();
      });

      dashboardService.fetchDashboardData.mockClear();

      // Start polling again
      act(() => {
        result.current.startPolling();
      });

      await waitFor(() => {
        expect(dashboardService.fetchDashboardData).toHaveBeenCalledTimes(1);
        expect(result.current.isPolling).toBe(true);
      });
    });
  });

  describe('stopPolling', () => {
    it('should stop polling and clear interval', async () => {
      const { result } = renderHook(() => useRealTimeData());

      await waitFor(() => {
        expect(dashboardService.fetchDashboardData).toHaveBeenCalledTimes(1);
      });

      act(() => {
        result.current.stopPolling();
      });

      expect(result.current.isPolling).toBe(false);

      dashboardService.fetchDashboardData.mockClear();

      act(() => {
        jest.advanceTimersByTime(10000);
      });

      // Should not fetch after stopping
      expect(dashboardService.fetchDashboardData).not.toHaveBeenCalled();
    });

    it('should handle multiple stop calls safely', async () => {
      const { result } = renderHook(() => useRealTimeData());

      await waitFor(() => {
        expect(dashboardService.fetchDashboardData).toHaveBeenCalledTimes(1);
      });

      act(() => {
        result.current.stopPolling();
        result.current.stopPolling();
        result.current.stopPolling();
      });

      expect(result.current.isPolling).toBe(false);
    });
  });

  describe('refresh', () => {
    it('should manually fetch data', async () => {
      const { result } = renderHook(() => useRealTimeData());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      dashboardService.fetchDashboardData.mockClear();

      act(() => {
        result.current.refresh();
      });

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(dashboardService.fetchDashboardData).toHaveBeenCalledTimes(1);
        expect(result.current.loading).toBe(false);
      });
    });

    it('should update data on refresh', async () => {
      const { result } = renderHook(() => useRealTimeData());

      await waitFor(() => {
        expect(result.current.workflows).toEqual(mockDashboardData.workflows);
      });

      const updatedData = {
        workflows: [{ id: 'wf-3', name: 'New Workflow', status: 'idle' }],
        executions: [],
      };

      dashboardService.fetchDashboardData.mockResolvedValueOnce(updatedData);

      act(() => {
        result.current.refresh();
      });

      await waitFor(() => {
        expect(result.current.workflows).toEqual(updatedData.workflows);
        expect(result.current.executions).toEqual(updatedData.executions);
      });
    });
  });

  describe('return values', () => {
    it('should return all expected properties', async () => {
      const { result } = renderHook(() => useRealTimeData());

      await waitFor(() => {
        expect(result.current).toHaveProperty('workflows');
        expect(result.current).toHaveProperty('executions');
        expect(result.current).toHaveProperty('loading');
        expect(result.current).toHaveProperty('error');
        expect(result.current).toHaveProperty('isPolling');
        expect(result.current).toHaveProperty('refresh');
        expect(result.current).toHaveProperty('startPolling');
        expect(result.current).toHaveProperty('stopPolling');
      });
    });

    it('should provide function references that are stable across renders', async () => {
      const { result, rerender } = renderHook(() => useRealTimeData());

      const initialRefresh = result.current.refresh;
      const initialStartPolling = result.current.startPolling;
      const initialStopPolling = result.current.stopPolling;

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      rerender();

      expect(result.current.refresh).toBe(initialRefresh);
      expect(result.current.startPolling).toBe(initialStartPolling);
      expect(result.current.stopPolling).toBe(initialStopPolling);
    });
  });

  describe('edge cases', () => {
    it('should handle empty data response', async () => {
      dashboardService.fetchDashboardData.mockResolvedValue({
        workflows: [],
        executions: [],
      });

      const { result } = renderHook(() => useRealTimeData());

      await waitFor(() => {
        expect(result.current.workflows).toEqual([]);
        expect(result.current.executions).toEqual([]);
        expect(result.current.loading).toBe(false);
      });
    });

    it('should handle partial data response', async () => {
      dashboardService.fetchDashboardData.mockResolvedValue({
        workflows: mockDashboardData.workflows,
        executions: [],
      });

      const { result } = renderHook(() => useRealTimeData());

      await waitFor(() => {
        expect(result.current.workflows).toEqual(mockDashboardData.workflows);
        expect(result.current.executions).toEqual([]);
      });
    });
  });
});
