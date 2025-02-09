import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EducationalTooltip } from "./EducationalTooltip";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

interface PortfolioHolding {
  symbol: string;
  shares: number;
  averagePrice: number;
  lastPrice: number;
}

interface PortfolioAnalyticsProps {
  portfolio: PortfolioHolding[];
}

interface ProcessedHolding {
  symbol: string;
  value: number;
  percentage: number;
  profit: number;
  profitPercentage: number;
  shares: number;
  averagePrice: number;
  lastPrice: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function PortfolioAnalytics({ portfolio }: PortfolioAnalyticsProps) {
  const totalValue = portfolio.reduce(
    (acc, holding) => acc + holding.shares * holding.lastPrice,
    0
  );

  const holdings = portfolio.map(holding => {
    const value = holding.shares * holding.lastPrice;
    const costBasis = holding.shares * holding.averagePrice;
    const profit = value - costBasis;
    const profitPercentage = ((value - costBasis) / costBasis) * 100;

    return {
      symbol: holding.symbol,
      value,
      percentage: (value / totalValue) * 100,
      profit,
      profitPercentage,
      shares: holding.shares,
      averagePrice: holding.averagePrice,
      lastPrice: holding.lastPrice
    };
  });

  const totalProfit = holdings.reduce((acc, h) => acc + h.profit, 0);
  const totalProfitPercentage = (totalProfit / (totalValue - totalProfit)) * 100;
  const diversificationScore = calculateDiversificationScore(holdings);

  return (
    <Card className="p-6">
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <MetricCard
              label="Total Value"
              value={`$${totalValue.toLocaleString()}`}
              icon={<DollarSign className="h-4 w-4" />}
            />
            <MetricCard
              label="Total Return"
              value={`${totalProfitPercentage.toFixed(2)}%`}
              trend={totalProfitPercentage >= 0}
              icon={totalProfitPercentage >= 0 ? 
                <TrendingUp className="h-4 w-4" /> : 
                <TrendingDown className="h-4 w-4" />}
            />
            <MetricCard
              label="Diversification"
              value={`${diversificationScore}%`}
              icon={<AlertCircle className="h-4 w-4" />}
            />
          </div>

          <div>
            <EducationalTooltip topic="diversification">
              <h3 className="text-lg font-semibold mb-4">Asset Allocation</h3>
            </EducationalTooltip>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={holdings}
                    dataKey="value"
                    nameKey="symbol"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    label={({ symbol, percentage }) => 
                      `${symbol} (${percentage.toFixed(1)}%)`
                    }
                  >
                    {holdings.map((_, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="holdings">
          <div className="space-y-4">
            {holdings.map(holding => (
              <HoldingCard
                key={holding.symbol}
                holding={holding}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="metrics">
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-2">Risk Assessment</h4>
              <Progress value={getRiskScore(portfolio)} className="h-2" />
              <p className="text-sm text-muted-foreground mt-1">
                Based on portfolio diversity and market volatility
              </p>
            </div>
            <Separator />
            <div>
              <h4 className="font-medium mb-2">Portfolio Health</h4>
              <div className="space-y-2">
                {getPortfolioHealthMetrics(portfolio).map(metric => (
                  <MetricRow key={metric.label} {...metric} />
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

function MetricCard({ 
  label, 
  value, 
  trend, 
  icon 
}: { 
  label: string; 
  value: string; 
  trend?: boolean;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
        {icon}
        {label}
      </div>
      <div className={`text-xl font-semibold ${
        trend !== undefined ? (trend ? 'text-green-600' : 'text-red-600') : ''
      } overflow-hidden text-ellipsis whitespace-nowrap`}>
        {value}
      </div>
    </div>
  );
}

function HoldingCard({ holding }: { holding: ProcessedHolding }) {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="font-semibold">{holding.symbol}</div>
          <div className="text-sm text-muted-foreground">
            {holding.shares.toFixed(4)} shares
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono font-medium">
            ${holding.value.toLocaleString()}
          </div>
          <div className={`text-sm ${
            holding.profitPercentage >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {holding.profitPercentage.toFixed(2)}%
          </div>
        </div>
      </div>
    </Card>
  );
}

function MetricRow({ label, value, description }: { label: string; value: string; description: string }) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm">{value}</span>
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

function calculateDiversificationScore(holdings: Array<{ percentage: number }>): number {
  const idealPercentage = 100 / holdings.length;
  const deviation = holdings.reduce(
    (acc, h) => acc + Math.abs(h.percentage - idealPercentage),
    0
  );
  return Math.max(0, Math.min(100, 100 - (deviation / 2)));
}

function getRiskScore(portfolio: PortfolioHolding[]): number {
  if (portfolio.length === 0) return 0;
  const diversificationScore = calculateDiversificationScore(
    portfolio.map(p => ({ percentage: (p.shares * p.lastPrice) / 
      portfolio.reduce((acc, h) => acc + h.shares * h.lastPrice, 0) * 100 }))
  );
  return diversificationScore;
}

function getPortfolioHealthMetrics(portfolio: PortfolioHolding[]) {
  const diversificationScore = calculateDiversificationScore(
    portfolio.map(p => ({ percentage: (p.shares * p.lastPrice) / 
      portfolio.reduce((acc, h) => acc + h.shares * h.lastPrice, 0) * 100 }))
  );

  return [
    {
      label: "Diversification",
      value: diversificationScore > 70 ? "Good" : diversificationScore > 40 ? "Fair" : "Poor",
      description: "Portfolio distribution across different assets"
    },
    {
      label: "Risk Level",
      value: portfolio.length > 5 ? "Low" : portfolio.length > 2 ? "Moderate" : "High",
      description: "Based on number of holdings and diversification"
    },
    {
      label: "Rebalancing Needed",
      value: diversificationScore < 50 ? "Yes" : "No",
      description: diversificationScore < 50 
        ? "Consider spreading investments more evenly"
        : "Your portfolio allocation is balanced"
    }
  ];
}