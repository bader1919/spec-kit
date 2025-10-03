import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Execution {
  id: string;
  startTime: string;
  duration?: number;
  status: string;
}

interface ChartsProps {
  executions: Execution[];
}

const Charts: React.FC<ChartsProps> = ({ executions }) => {
  const chartData = useMemo(() => {
    const sortedExecutions = [...executions]
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .slice(-10); // Last 10 executions

    return {
      labels: sortedExecutions.map((exec) =>
        new Date(exec.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      ),
      datasets: [
        {
          label: 'Execution Time (ms)',
          data: sortedExecutions.map((exec) => exec.duration || 0),
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.3,
          pointRadius: 3, // Smaller points for better performance
          pointHoverRadius: 5,
        },
      ],
    };
  }, [executions]);

  // Memoize options to prevent re-creation on each render
  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 300, // Reduce animation time for faster rendering
      },
      interaction: {
        mode: 'index' as const,
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: 'Execution Performance',
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: (context: any) => `Duration: ${context.parsed.y}ms`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Duration (ms)',
          },
        },
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 45,
          },
        },
      },
      // Performance optimizations
      parsing: false, // Disable data parsing for better performance
      normalized: true, // Data already normalized
    }),
    []
  );

  return (
    <div style={{ height: '300px', padding: '16px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

// Memoize component to prevent unnecessary re-renders
export default React.memo(Charts);
