import { useState, useEffect, useMemo } from "react";
import { useSimulation } from "@/hooks/useSimulation";
import { useAchievement } from "@/contexts/achievement-context";
import { useAchievements } from "@/contexts/useAchievements";
// import { PortfolioChart } from "@/components/invest/PortfolioChart";
import { QuickInvestCard } from "@/components/invest/QuickInvestCard";
import { WatchlistCard } from "@/components/invest/WatchlistCard";
import { PortfolioAnalytics } from "@/components/invest/PortfolioAnalytics";
import { EducationalTooltip } from "@/components/invest/EducationalTooltip";
import { ArrowUpRight, ArrowDownRight, Plus, Eye, EyeOff, TrendingUp } from "lucide-react";
import PageContainer from "@/components/ui/page-container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { ChartContainer } from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { HistoricalDataPoint } from "@/utils/mockData";

const Invest = () => {
  const { state, executeTrade, addToWatchlist, removeFromWatchlist } = useSimulation();
  const { awardAchievement, hasAchievement } = useAchievement();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  
  // Check for achievements
  useEffect(() => {
    if (state.portfolio.length >= 5 && !hasAchievement("diversified_portfolio")) {
      awardAchievement("diversified_portfolio");
    }
    if (state.watchlist.length >= 3 && !hasAchievement("watch_and_learn")) {
      awardAchievement("watch_and_learn");
    }
  }, [state.portfolio.length, state.watchlist.length, awardAchievement, hasAchievement]);

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleInvest = (symbol: string, amount: number) => {
    const price = mockStockData[symbol]?.price || 0;
    const shares = amount / price;
    
    executeTrade(symbol, shares, price);
    toast({
      title: "Investment Successful!",
      description: `You invested $${amount} in ${symbol}`,
    });
    
    // Award achievement for first investment
    if (state.portfolio.length === 0) {
      awardAchievement("first_investment");
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Add data transformation for the chart if needed
  const chartData = useMemo(() => {
    return state.historicalData.map(point => ({
      ...point,
      value: Math.round(point.value) // Round values for cleaner display
    }));
  }, [state.historicalData]);

  return (
    <PageContainer className="space-y-6 px-4 sm:px-6 py-6">
      {/* Header section - adjusted spacing */}
      <div className="text-center space-y-3 mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Investment Hub</h1>
        <p className="text-gray-600 text-sm sm:text-base">Start your investment journey here</p>
      </div>

      {/* Portfolio Overview with Chart - improved chart */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold">Portfolio Overview</h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="flex-1 sm:flex-initial">
              <Eye className="w-4 h-4 mr-2" /> Watchlist
            </Button>
            <Button size="sm" className="flex-1 sm:flex-initial">
              <Plus className="w-4 h-4 mr-2" /> Invest Now
            </Button>
          </div>
        </div>
        <div className="h-[300px] sm:h-[400px]">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-pulse">Loading chart...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  tickFormatter={formatCurrency}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  dx={-10}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 rounded-lg shadow-lg border">
                          <p className="text-sm text-gray-500">
                            {payload[0].payload.date}
                          </p>
                          <p className="text-lg font-semibold text-primary">
                            {formatCurrency(payload[0].value as number)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#portfolioGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* Portfolio Analytics - with loading state */}
      {state.portfolio.length > 0 && (
        <div className="transition-all">
          {isLoading ? (
            <Card className="p-6 animate-pulse">
              <div className="h-20 bg-gray-200 rounded"></div>
            </Card>
          ) : (
            <PortfolioAnalytics portfolio={state.portfolio} />
          )}
        </div>
      )}

      {/* Quick Invest & Watchlist Sections - improved grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <EducationalTooltip topic="market-order">
            <h3 className="text-lg font-semibold">Quick Invest</h3>
          </EducationalTooltip>
          <div className="grid gap-4">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <Card key={i} className="p-4 animate-pulse">
                  <div className="h-24 bg-gray-200 rounded"></div>
                </Card>
              ))
            ) : (
              Object.entries(mockStockData).map(([symbol, data]) => (
                <QuickInvestCard
                  key={symbol}
                  symbol={symbol}
                  name={data.name}
                  price={data.price}
                  change={data.change}
                  tag={data.tag}
                  onInvest={(amount) => handleInvest(symbol, amount)}
                />
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <EducationalTooltip topic="watchlist">
            <h3 className="text-lg font-semibold">Watchlist</h3>
          </EducationalTooltip>
          <div className="grid gap-4">
            {isLoading ? (
              Array(2).fill(0).map((_, i) => (
                <Card key={i} className="p-4 animate-pulse">
                  <div className="h-24 bg-gray-200 rounded"></div>
                </Card>
              ))
            ) : (
              state.watchlist.map((symbol) => {
                const data = mockStockData[symbol];
                return (
                  <WatchlistCard
                    key={symbol}
                    symbol={symbol}
                    name={data.name}
                    price={data.price}
                    change={data.change}
                    isWatched={true}
                    onToggleWatch={() => removeFromWatchlist(symbol)}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

// Mock data for stocks
const mockStockData = {
  AAPL: { name: "Apple Inc.", price: 150.23, change: 1.2, tag: "Tech Giant" },
  GOOGL: { name: "Alphabet Inc.", price: 2750.50, change: -0.5, tag: "Tech Leader" },
  MSFT: { name: "Microsoft Corp.", price: 285.30, change: 0.8, tag: "Stable Growth" },
  // Add more stocks as needed
};

export default Invest;
