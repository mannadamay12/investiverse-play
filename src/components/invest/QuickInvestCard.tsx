import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface QuickInvestCardProps {
  symbol: string;
  name: string;
  price?: number;
  change: number;
  tag?: string;
  onInvest: (amount: number) => void;
  priceHistory?: { date: string; value: number }[];
}

export const QuickInvestCard: React.FC<QuickInvestCardProps> = ({
  symbol,
  name,
  price,
  change,
  tag,
  onInvest,
  priceHistory = [],
}) => {
  const priceColor = change >= 0 ? "text-green-600" : "text-red-600";
  const Icon = change >= 0 ? ArrowUpRight : ArrowDownRight;

  const formattedPrice = price !== undefined ? `$${price.toFixed(2)}` : "Loading...";

  return (
    <Card className="p-4 flex flex-col justify-between space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-semibold text-lg">{symbol}</h4>
          <p className="text-sm text-gray-500">{name}</p>
        </div>
        <div className="text-right">
          <p className="text-md font-mono">{formattedPrice}</p>
          {price !== undefined && (
            <span className={`text-xs flex items-center justify-end ${priceColor}`}>
              <Icon className="w-3 h-3 mr-1" />
              {change}%
            </span>
          )}
        </div>
      </div>

      {priceHistory.length > 0 && (
        <div className="h-16">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceHistory}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={change >= 0 ? "#16a34a" : "#dc2626"}
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <Button size="sm" className="mt-2" onClick={() => onInvest(100)}>
        Invest $100
      </Button>
    </Card>
  );
};
