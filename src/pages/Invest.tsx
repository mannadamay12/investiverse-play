import { useEffect, useState } from "react";
import { useSimulation } from "@/hooks/useSimulation";
import { useAchievement } from "@/contexts/achievement-context";
import { PortfolioChart } from "@/components/invest/PortfolioChart";
import { QuickInvestCard } from "@/components/invest/QuickInvestCard";
import { WatchlistCard } from "@/components/invest/WatchlistCard";
import { EducationalTooltip } from "@/components/invest/EducationalTooltip";
import { Plus, Eye } from "lucide-react";
import PageContainer from "@/components/ui/page-container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { InvestModal } from "@/components/invest/InvestModal";
import { PageChat } from "@/components/shared/PageChat";
import { useUser } from "@/contexts/UserContext";
import { useInfluxStockData } from "@/hooks/useInfluxStockData";

const symbols = ["AAPL", "GOOGL", "TSLA"];

const getLatestValue = (data: any[]): number | undefined => {
  const last = data?.at(-1)?.value;
  return typeof last === "number" && last > 0 ? last : undefined;
};

const Invest = () => {
  const { userId } = useUser();
  const { state, addToWatchlist, removeFromWatchlist } = useSimulation();
  const { awardAchievement } = useAchievement();
  const { toast } = useToast();

  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const [tradeType, setTradeType] = useState<"BUY" | "SELL">("BUY");
  const [portfolioStocks, setPortfolioStocks] = useState<Record<string, number>>({});

  // Fetch portfolio
  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!userId) return;
      try {
        const res = await fetch(`http://localhost:8000/portfolio/${userId}`);
        const data = await res.json();
        setPortfolioStocks(data.stocks || {});
      } catch (err) {
        console.error("Failed to fetch portfolio", err);
      }
    };
    fetchPortfolio();
  }, [userId]);

  // Live stock data
  const aapl = useInfluxStockData("AAPL");
  const googl = useInfluxStockData("GOOGL");
  const tsla = useInfluxStockData("TSLA");

  const livePrices: Record<string, number | undefined> = {
    AAPL: getLatestValue(aapl.data),
    GOOGL: getLatestValue(googl.data),
    TSLA: getLatestValue(tsla.data),
  };

  const chartData = {
    AAPL: aapl.data,
    GOOGL: googl.data,
    TSLA: tsla.data,
  };

  const selectedChartData = chartData[selectedSymbol] || [];
  const isChartLoading =
    selectedSymbol === "AAPL" ? aapl.loading :
    selectedSymbol === "GOOGL" ? googl.loading :
    tsla.loading;

  const handleTrade = async (symbol: string, amount: number, type: "BUY" | "SELL") => {
    const price = livePrices[symbol];

    if (!userId || !price || isNaN(price) || amount <= 0) {
      toast({
        title: "Invalid Trade",
        description: "Price or amount is invalid.",
        variant: "destructive"
      });
      return;
    }

    const quantity = parseFloat((amount / price).toFixed(6));
    const tradeData = {
      user_id: String(userId),
      stock_name: symbol,
      trade_type: type.toUpperCase(),
      quantity,
      price: parseFloat(price.toFixed(2)),
    };

    console.log("✅ Submitting trade:", tradeData);

    try {
      const res = await fetch("http://localhost:8000/trades/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(tradeData),
      });

      const json = await res.json();

      if (!res.ok) {
        console.error("❌ Trade failed:", json);
        throw new Error(json.detail || "Trade submission failed");
      }

      toast({
        title: `${type === "BUY" ? "Investment" : "Sale"} Successful`,
        description: `${type === "BUY" ? "Bought" : "Sold"} $${amount.toFixed(2)} of ${symbol}`
      });

      awardAchievement("first_investment");

      const updated = await fetch(`http://localhost:8000/portfolio/${userId}`);
      const data = await updated.json();
      setPortfolioStocks(data.stocks || {});
    } catch (error: any) {
      toast({
        title: "Trade Error",
        description: error.message,
        variant: "destructive"
      });
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

  const holdingsValue = Object.entries(portfolioStocks)
    .filter(([_, shares]) => shares > 0)
    .map(([symbol, shares]) => {
      const price = livePrices[symbol] ?? 0;
      return {
        symbol,
        shares,
        value: shares * price,
      };
    });

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
            <Button size="sm" onClick={() => {
              setTradeType("BUY");
              setIsInvestModalOpen(true);
            }}>
              <Plus className="w-4 h-4 mr-2" /> Invest Now
            </Button>
            <Button variant="outline" size="sm" onClick={() => {
              setTradeType("SELL");
              setIsInvestModalOpen(true);
            }}>
              Sell Now
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
          data={selectedChartData}
          symbol={selectedSymbol}
          isLoading={isChartLoading}
          height="400px"
        />
      </Card>

      <Card className="p-4 sm:p-6">
        <h2 className="text-xl font-semibold mb-4">Your Holdings (Live Value)</h2>
        {holdingsValue.length === 0 ? (
          <p className="text-sm text-muted-foreground">You don't hold any stocks yet.</p>
        ) : (
          holdingsValue.map((entry) => (
            <div key={entry.symbol} className="flex justify-between text-sm border-b py-2">
              <span>{entry.symbol} — {entry.shares.toFixed(1)} shares</span>
              <span>${entry.value.toFixed(2)}</span>
            </div>
          ))
        )}
      </Card>

      <InvestModal
        isOpen={isInvestModalOpen}
        onClose={() => setIsInvestModalOpen(false)}
        onInvest={(amount) => handleTrade(selectedSymbol, amount, tradeType)}
        symbol={selectedSymbol}
        currentPrice={livePrices[selectedSymbol]}
        tradeType={tradeType}
      />

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
                priceHistory={chartData[symbol]}
                onInvest={(amount) => handleTrade(symbol, amount, "BUY")}
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
                price={livePrices[symbol] ?? 0}
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
