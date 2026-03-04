/**
 * Chart Card Component
 * Displays financial charts with glassmorphism design
 */

import React, { memo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

const ChartCard = memo(({ chartData }) => {
  if (!chartData) return null;

  // Transform data for Recharts
  const data = chartData.labels.map((label, index) => {
    const point = { name: label };
    chartData.datasets.forEach(dataset => {
      point[dataset.label] = dataset.data[index];
    });
    return point;
  });

  const chartIcons = {
    line: TrendingUp,
    bar: BarChart3,
    pie: PieChartIcon
  };

  const ChartIcon = chartIcons[chartData.type] || TrendingUp;

  const renderChart = () => {
    switch (chartData.type) {
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
            <XAxis
              dataKey="name"
              stroke="currentColor"
              style={{ fontSize: '12px' }}
              className="text-gray-600 dark:text-gray-400"
            />
            <YAxis
              stroke="currentColor"
              style={{ fontSize: '12px' }}
              className="text-gray-600 dark:text-gray-400"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              labelStyle={{ color: '#374151', fontWeight: 600 }}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
              iconType="circle"
            />
            {chartData.datasets.map((dataset, idx) => (
              <Line
                key={idx}
                type="monotone"
                dataKey={dataset.label}
                stroke={dataset.color || '#3b82f6'}
                strokeWidth={3}
                dot={{ fill: dataset.color || '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
            <XAxis
              dataKey="name"
              stroke="currentColor"
              style={{ fontSize: '12px' }}
              className="text-gray-600 dark:text-gray-400"
            />
            <YAxis
              stroke="currentColor"
              style={{ fontSize: '12px' }}
              className="text-gray-600 dark:text-gray-400"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            {chartData.datasets.map((dataset, idx) => (
              <Bar
                key={idx}
                dataKey={dataset.label}
                fill={dataset.color || '#3b82f6'}
                radius={[8, 8, 0, 0]}
                isAnimationActive={false}
              />
            ))}
          </BarChart>
        );

      case 'pie':
        const pieData = chartData.labels.map((label, index) => ({
          name: label,
          value: chartData.datasets[0].data[index]
        }));

        const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

        return (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              animationDuration={1000}
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
          </PieChart>
        );

      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <div
      className="my-6 p-6 rounded-2xl bg-white/60 dark:bg-dark-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-dark-700/50 shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 text-white shadow-lg"
        >
          <ChartIcon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {chartData.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Financial Analysis
          </p>
        </div>
      </div>

      {/* Chart */}
      <div
        className="w-full"
      >
        <ResponsiveContainer width="100%" height={300}>
          {renderChart()}
        </ResponsiveContainer>
      </div>

    </div>
  );
});

ChartCard.displayName = 'ChartCard';

export default ChartCard;
