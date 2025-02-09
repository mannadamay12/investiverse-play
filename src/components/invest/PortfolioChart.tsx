import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { StockDataPoint } from '../../utils/stockDataProcessor';

interface PortfolioChartProps {
  data: StockDataPoint[];
  symbol?: string;
  height?: string;
  isLoading?: boolean;
}

const PortfolioChart: React.FC<PortfolioChartProps> = ({ 
  data, 
  symbol, 
  height = "400px",
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className={`h-[${height}] flex items-center justify-center`}>
        <div className="animate-pulse">Loading chart...</div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`h-[${height}] w-full`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
          />
          <YAxis 
            tickFormatter={formatCurrency}
            domain={['auto', 'auto']}
          />
          <Tooltip 
            formatter={(value: number) => formatCurrency(value)}
            labelFormatter={(label) => formatDate(label as string)}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PortfolioChart;