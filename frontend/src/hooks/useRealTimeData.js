import { useState, useEffect, useCallback, useRef } from 'react';
import dashboardService from '../services/dashboardService';

const POLLING_INTERVAL = 4000; // 4 seconds for real-time updates

export const useRealTimeData = () => {
  const [data, setData] = useState({ workflows: [], executions: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPolling, setIsPolling] = useState(true);
  const intervalRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      const dashboardData = await dashboardService.fetchDashboardData();
      setData(dashboardData);
      setError(null);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  const startPolling = useCallback(() => {
    setIsPolling(true);
    fetchData(); // Immediate fetch

    intervalRef.current = setInterval(() => {
      fetchData();
    }, POLLING_INTERVAL);
  }, [fetchData]);

  const stopPolling = useCallback(() => {
    setIsPolling(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const refresh = useCallback(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    startPolling();

    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  return {
    workflows: data.workflows,
    executions: data.executions,
    loading,
    error,
    isPolling,
    refresh,
    startPolling,
    stopPolling,
  };
};
