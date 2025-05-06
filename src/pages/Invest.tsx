import { useState } from "react";
import { useSimulation } from "@/hooks/useSimulation";
import { useAchievement } from "@/contexts/achievement-context";
import { PortfolioChart } from "@/components/invest/PortfolioChart";
import { QuickInvestCard } from "@/components/invest/QuickInvestCard";
import { WatchlistCard } from "@/components/invest/WatchlistCard";
import { PortfolioAnalytics } from "@/components/invest/PortfolioAnalytics";
import { EducationalTooltip } from "@/components/invest/EducationalTooltip";
import { Plus, Eye } from "lucide-react";
import PageContainer from "@/components/ui/page-container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { InvestModal } from "@/components/invest/InvestModal";
import { PageChat } from "@/components/shared/PageChat";
import { useUser } from "@/contexts/UserContext";
import { submitTrade } from "@/lib/api";
import { TradeRequest } from "@/types/trade";
import { useInfluxStockData } from "@/hooks/useInfluxStockData";

const symbols = ["AAPL", "GOOGL", "TSLA"];

const Invest = () => {
  const { userId } = useUser();
  const { state, addToWatchlist, removeFromWatchlist } = useSimulation();
  const { awardAchievement } = useAchievement();
  const { toast } = useToast();

  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);

  // Individual hook calls to follow React rules
  const aapl = useInfluxStockData("AAPL");
  const googl = useInfluxStockData("GOOGL");
  const tsla = useInfluxStockData("TSLA");

  const livePrices: Record<string, number> = {
    AAPL: aapl.data.at(-1)?.value ?? 0,
    GOOGL: googl.data.at(-1)?.value ?? 0,
    TSLA: tsla.data.at(-1)?.value ?? 0,
  };

  const selectedChart = useInfluxStockData(selectedSymbol);
  const chartData = Array.isArray(selectedChart.data) ? selectedChart.data : [];
  const isChartLoading = selectedChart.loading;

  const handleInvest = async (symbol: string, amount: number) => {
    const price = livePrices[symbol];
    if (!userId || !price) return;

    try {
      const tradeData: TradeRequest = {
        user_id: userId,
        stock_name: symbol,
        trade_type: "BUY",
        quantity: amount,
        price,
      };

      await submitTrade(tradeData);
      toast({ title: "Investment Successful", description: `You invested $${amount} in ${symbol}` });

      if (state.portfolio.length === 0) awardAchievement("first_investment");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleWatchlistToggle = (symbol: string) => {
    if (state.watchlist.includes(symbol)) {
      removeFromWatchlist(symbol);
      toast({ title: "Removed from Watchlist", description: `${symbol} removed.` });
    } else {
      addToWatchlist(symbol);
      toast({ title: "Added to Watchlist", description: `${symbol} added.` });
    }
  };

  return (
    <PageContainer className="space-y-6 px-4 sm:px-6 py-6">
      <div className="text-center space-y-3 mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Investment Hub</h1>
        <p className="text-gray-600 text-sm sm:text-base">Start your investment journey here</p>
      </div>

      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold">Portfolio Overview</h2>
          <div className="flex gap-2">
            <Button
              variant={state.watchlist.includes(selectedSymbol) ? "default" : "outline"}
              size="sm"
              onClick={() => handleWatchlistToggle(selectedSymbol)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {state.watchlist.includes(selectedSymbol) ? "Watching" : "Watch"}
            </Button>
            <Button size="sm" onClick={() => setIsInvestModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" /> Invest Now
            </Button>
          </div>
        </div>

        <select
          value={selectedSymbol}
          onChange={(e) => setSelectedSymbol(e.target.value)}
          className="block w-full max-w-xs px-4 py-2 border border-gray-300 rounded-md shadow-sm"
        >
          {symbols.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <PortfolioChart
          data={chartData}
          symbol={selectedSymbol}
          isLoading={isChartLoading}
          height="400px"
        />
      </Card>

      <InvestModal
        isOpen={isInvestModalOpen}
        onClose={() => setIsInvestModalOpen(false)}
        onInvest={(amt, _) => handleInvest(selectedSymbol, amt)}
        symbol={selectedSymbol}
        currentPrice={livePrices[selectedSymbol]}
      />

      {state.portfolio.length > 0 && (
        <div className="transition-all">
          <PortfolioAnalytics portfolio={state.portfolio} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="space-y-4">
          <EducationalTooltip topic="market-order">
            <h3 className="text-lg font-semibold">Quick Invest</h3>
          </EducationalTooltip>
          <div className="grid gap-4">
            {symbols.map((symbol) => (
              <QuickInvestCard
                key={symbol}
                symbol={symbol}
                name={symbol}
                price={livePrices[symbol]}
                change={0}
                tag=""
                onInvest={(amount) => handleInvest(symbol, amount)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <EducationalTooltip topic="watchlist">
            <h3 className="text-lg font-semibold">Watchlist</h3>
          </EducationalTooltip>
          <div className="grid gap-4">
            {state.watchlist.map((symbol) => (
              <WatchlistCard
                key={symbol}
                symbol={symbol}
                name={symbol}
                price={livePrices[symbol]}
                change={0}
                isWatched={true}
                onToggleWatch={() => handleWatchlistToggle(symbol)}
              />
            ))}
          </div>
        </div>
      </div>

      <PageChat />
    </PageContainer>
  );
};

export default Invest;
