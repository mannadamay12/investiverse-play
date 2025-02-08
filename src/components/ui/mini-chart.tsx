import { ChartContainer } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer } from "recharts"

interface MiniChartProps {
  data: Array<{ value: number; date: string }>
  height?: number
  className?: string
}

export const MiniChart = ({ data, height = 60, className }: MiniChartProps) => {
  return (
    <div className={className} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="miniChartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity={0.2} />
              <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke="currentColor"
            fill="url(#miniChartGradient)"
            strokeWidth={1.5}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
