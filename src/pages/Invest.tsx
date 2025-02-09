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
import { processStockData, getAvailableSymbols, getStockDataForSymbol, getEnhancedStockData } from '@/utils/stockDataProcessor';
import { EnhancedStockData, StockData, StockDataPoint } from '@/types/stock';
import stockData from '@/assets/dow30_daily_close.json';
import { InvestModal } from "@/components/invest/InvestModal";

interface stockData {
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
  const [stocksData, setStocksData] = useState<Record<string, EnhancedStockData>>({});
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);

  const chartData = useMemo(() => {
    if (!selectedSymbol || !stockData[selectedSymbol]) return [];
    
    return Object.entries(stockData[selectedSymbol])
      .map(([date, value]) => ({
        date,
        value: value as number
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [selectedSymbol]);

  useEffect(() => {
    const enhanced = getAvailableSymbols().reduce((acc, symbol) => {
      acc[symbol] = getEnhancedStockData(symbol);
      return acc;
    }, {} as Record<string, EnhancedStockData>);
    
    setStocksData(enhanced);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [selectedSymbol]);

  const handleInvest = (symbol: string, amount: number) => {
    const stockInfo = stocksData[symbol];
    if (!stockInfo) return;

    const shares = amount / stockInfo.price;
    
    executeTrade(symbol, shares, stockInfo.price);
    toast({
      title: "Investment Successful!",
      description: `You invested $${amount} in ${stockInfo.name}`,
    });
    
    if (state.portfolio.length === 0) {
      awardAchievement("first_investment");
    }
  };

  const handleWatchlistToggle = (symbol: string) => {
    if (state.watchlist.includes(symbol)) {
      removeFromWatchlist(symbol);
      toast({
        title: "Removed from Watchlist",
        description: `${symbol} has been removed from your watchlist`,
      });
    } else {
      addToWatchlist(symbol);
      toast({
        title: "Added to Watchlist",
        description: `${symbol} has been added to your watchlist`,
      });
    }
  };

  const handleDetailedInvest = (amount: number, orderType: string) => {
    handleInvest(selectedSymbol, amount);
    
    // Award achievement for using advanced trading
    if (!hasAchievement("advanced_trader")) {
      awardAchievement("advanced_trader");
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
            <Button 
              variant={state.watchlist.includes(selectedSymbol) ? "default" : "outline"}
              size="sm" 
              className="flex-1 sm:flex-initial"
              onClick={() => handleWatchlistToggle(selectedSymbol)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {state.watchlist.includes(selectedSymbol) ? 'Watching' : 'Watch'}
            </Button>
            <Button 
              size="sm" 
              className="flex-1 sm:flex-initial"
              onClick={() => setIsInvestModalOpen(true)}
            >
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
            {Object.keys(stockData).map((symbol) => (
              <option key={symbol} value={symbol}>
                {symbol}
              </option>
            ))}
          </select>
        </div>
        <PortfolioChart 
          data={chartData}
          symbol={selectedSymbol}
          isLoading={isLoading}
          height="400px"
        />
      </Card>

      <InvestModal
        isOpen={isInvestModalOpen}
        onClose={() => setIsInvestModalOpen(false)}
        onInvest={handleDetailedInvest}
        symbol={selectedSymbol}
        currentPrice={stocksData[selectedSymbol]?.price ?? 0}
      />

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
              Object.values(stocksData).map((stock) => (
                <QuickInvestCard
                  key={stock.symbol}
                  symbol={stock.symbol}
                  name={stock.name}
                  price={stock.price}
                  change={stock.change}
                  tag={stock.tag}
                  onInvest={(amount) => handleInvest(stock.symbol, amount)}
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
            ) : state.watchlist.length === 0 ? (
              <Card className="p-4">
                <p className="text-center text-muted-foreground">
                  Your watchlist is empty. Add stocks to track them.
                </p>
              </Card>
            ) : (
              state.watchlist.map((symbol) => {
                const data = stocksData[symbol];
                return (
                  <WatchlistCard
                    key={symbol}
                    symbol={symbol}
                    name={data.name}
                    price={data.price}
                    change={data.change}
                    isWatched={true}
                    onToggleWatch={() => handleWatchlistToggle(symbol)}
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
