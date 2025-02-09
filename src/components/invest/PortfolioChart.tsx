import { Area, AreaChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

interface PortfolioChartProps {
  data: Array<{
    date: string;
    value: number;
  }>;
}

const PortfolioChart: React.FC<PortfolioChartProps> = ({ data }) => {
  // Calculate min and max for better Y axis display
  const minValue = Math.floor(Math.min(...data.map(d => d.value)) * 0.95);
  const maxValue = Math.ceil(Math.max(...data.map(d => d.value)) * 1.05);

  const chartConfig = {
    value: {
      label: "Portfolio Value",
      theme: {
        light: "hsl(var(--primary))",
        dark: "hsl(var(--primary))"
      }
    }
  };

  return (
    <div className="h-[200px] w-full">
      <ChartContainer
        data={data}
        config={chartConfig}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
              fontSize={12}
              tickMargin={10}
            />
            <YAxis
              domain={[minValue, maxValue]}
              tickFormatter={(value) => `$${(value/1000).toFixed(1)}k`}
              fontSize={12}
              width={60}
            />
            <Tooltip
              formatter={(value: number) => [`$${value.toLocaleString()}`, "Portfolio Value"]}
              labelFormatter={(label) => new Date(label).toLocaleDateString()}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default PortfolioChart;