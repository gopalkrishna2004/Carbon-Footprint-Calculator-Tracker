import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import './CategoryPieChart.css';

const CategoryPieChart = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  // Transform data for pie chart
  const chartData = Object.entries(data).map(([category, info]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: parseFloat(info.emissions.toFixed(2)),
    count: info.count,
    icon: getCategoryIcon(category),
  }));

  // Category colors
  const COLORS = {
    Transportation: '#3b82f6',
    Energy: '#f59e0b',
    Diet: '#10b981',
    Consumption: '#8b5cf6',
  };

  function getCategoryIcon(category) {
    return '';
  }

  // Custom label
  const renderCustomLabel = (entry) => {
    const percent = ((entry.value / entry.payload.totalValue) * 100).toFixed(0);
    return `${percent}%`;
  };

  // Calculate total for percentages
  const total = chartData.reduce((sum, entry) => sum + entry.value, 0);
  const dataWithTotal = chartData.map(entry => ({
    ...entry,
    totalValue: total,
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percent = ((data.value / total) * 100).toFixed(1);
      return (
        <div className="pie-tooltip">
          <p className="tooltip-title">
            {data.icon} {data.name}
          </p>
          <p className="tooltip-emissions">{data.value} kg CO₂</p>
          <p className="tooltip-percent">{percent}% of total</p>
          <p className="tooltip-count">{data.count} activities</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="pie-chart-card card">
      <h2>Emissions by Category</h2>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={dataWithTotal}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {dataWithTotal.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.name]}
                stroke="white"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value, entry) => (
              <span style={{ color: '#374151', fontSize: '14px' }}>
                {entry.payload.icon} {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryPieChart;
