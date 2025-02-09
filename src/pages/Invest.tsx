import { useState, useEffect, useMemo } from "react";
import { useSimulation } from "@/hooks/useSimulation";
import { useAchievement } from "@/contexts/achievement-context";
import PortfolioChart from "@/components/invest/PortfolioChart";
import { QuickInvestCard } from "@/components/invest/QuickInvestCard";
import { WatchlistCard } from "@/components/invest/WatchlistCard";
import { PortfolioAnalytics } from "@/components/invest/PortfolioAnalytics";
import { EducationalTooltip } from "@/components/invest/EducationalTooltip";
import { Plus, Eye } from "lucide-react";
import PageContainer from "@/components/ui/page-container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { processStockData, getAvailableSymbols } from '@/utils/stockDataProcessor';

interface MockStockData {
  name: string;
  price: number;
  change: number;
  tag: string;
}

const Invest = () => {
  const { state, executeTrade, addToWatchlist, removeFromWatchlist } = useSimulation();
  const { awardAchievement, hasAchievement } = useAchievement();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [chartData, setChartData] = useState([]);
  
  // Initialize mockStockData with proper structure
  const [mockStockData, setMockStockData] = useState<Record<string, MockStockData>>(() => {
    const symbols = getAvailableSymbols();
    return Object.fromEntries(
      symbols.map(symbol => [
        symbol,
        {
          name: symbol,
          price: 0,
          change: 0,
          tag: 'tech'
        }
      ])
    );
  });

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

  useEffect(() => {
    setIsLoading(true);
    const data = processStockData(selectedSymbol);
    setChartData(data);
    
    // Update mockStockData with latest price
    if (data.length > 0) {
      setMockStockData(prev => ({
        ...prev,
        [selectedSymbol]: {
          ...prev[selectedSymbol],
          price: data[data.length - 1].value,
          change: ((data[data.length - 1].value - data[0].value) / data[0].value) * 100
        }
      }));
    }
    
    setIsLoading(false);
  }, [selectedSymbol]);

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
  const chartDataMemo = useMemo(() => {
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
        <div className="mb-6">
          <select
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className="block w-full max-w-xs px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            {getAvailableSymbols().map((symbol) => (
              <option key={symbol} value={symbol}>
                {symbol}
              </option>
            ))}
          </select>
        </div>
        <PortfolioChart 
          data={chartData}
          height="300px"
          isLoading={isLoading}
        />
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

export default Invest;
