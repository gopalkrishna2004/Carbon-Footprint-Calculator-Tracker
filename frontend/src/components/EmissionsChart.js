import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import './EmissionsChart.css';

const EmissionsChart = ({ data, period }) => {
  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  // Convert data object to array and sort by date
  const chartData = Object.entries(data)
    .map(([date, emissions]) => ({
      date,
      emissions: parseFloat(emissions.toFixed(2)),
      displayDate: formatDate(date, period),
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Format date based on period
  function formatDate(dateStr, period) {
    const date = new Date(dateStr);
    if (period === 'day' || period === 'week') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else if (period === 'month') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    }
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-date">{payload[0].payload.displayDate}</p>
          <p className="tooltip-value">
            <span className="tooltip-label">Emissions:</span>
            <span className="tooltip-emissions">{payload[0].value} kg CO₂</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="emissions-chart-card card">
      <h2>📈 Emissions Trend</h2>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#667eea" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#764ba2" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="displayDate"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              label={{ value: 'kg CO₂', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="emissions"
              stroke="#667eea"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorEmissions)"
              name="CO₂ Emissions"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EmissionsChart;
