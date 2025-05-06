import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";

interface PortfolioChartProps {
  data: { date: string; value: number | null }[] | any;
  symbol: string;
  isLoading: boolean;
  height?: string;
}

export const PortfolioChart: React.FC<PortfolioChartProps> = ({
  data,
  symbol,
  isLoading,
  height = "400px",
}) => {
  // Filter out null values from aggregation (due to createEmpty: true)
  const safeData: { date: string; value: number }[] = Array.isArray(data)
    ? data.filter((d) => typeof d.value === "number")
    : [];

  console.log("📊 Rendering PortfolioChart with cleaned data:", safeData);

  if (isLoading) {
    return (
      <div className="text-center text-sm text-muted-foreground">
        Loading chart...
      </div>
    );
  }

  if (safeData.length === 0) {
    return (
      <div className="text-center text-sm text-muted-foreground">
        No data available for {symbol}
      </div>
    );
  }

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={safeData}>
          <XAxis
            dataKey="date"
            tickFormatter={(tick) => dayjs(tick).format("HH:mm:ss")}
          />
          <YAxis />
          <Tooltip
            labelFormatter={(label) => `Time: ${dayjs(label).format("HH:mm:ss")}`}
            formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
