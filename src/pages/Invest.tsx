
import { ArrowUpRight, ArrowDownRight, Plus } from "lucide-react";
import PageContainer from "@/components/ui/page-container";
import { Button } from "@/components/ui/button";

const Invest = () => {
  return (
    <PageContainer className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">Investment Hub</h1>
        <p className="text-gray-600">Start your investment journey here</p>
      </div>

      {/* Portfolio Overview */}
      <div className="bg-white/80 backdrop-blur p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Your Portfolio</h2>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" /> Invest Now
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <div className="text-gray-600">Total Value</div>
            <div className="text-2xl font-bold">$1,234.56</div>
            <div className="text-success flex items-center text-sm">
              <ArrowUpRight className="w-4 h-4 mr-1" /> +2.4%
            </div>
          </div>
          <div>
            <div className="text-gray-600">Available Cash</div>
            <div className="text-2xl font-bold">$500.00</div>
            <div className="text-gray-500 text-sm">Ready to invest</div>
          </div>
        </div>
      </div>

      {/* Market Trends */}
      <div className="bg-white/80 backdrop-blur p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Market Trends</h2>
        <div className="space-y-4">
          <StockItem
            symbol="AAPL"
            name="Apple Inc."
            price="150.23"
            change="+1.2%"
            positive={true}
          />
          <StockItem
            symbol="GOOGL"
            name="Alphabet Inc."
            price="2,750.50"
            change="-0.5%"
            positive={false}
          />
          <StockItem
            symbol="MSFT"
            name="Microsoft Corp."
            price="285.30"
            change="+0.8%"
            positive={true}
          />
        </div>
      </div>

      {/* Investment Tips */}
      <div className="bg-white/80 backdrop-blur p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Pro Tips</h2>
        <div className="space-y-3">
          <Tip
            title="Diversification is Key"
            description="Don't put all your eggs in one basket. Spread your investments across different sectors."
          />
          <Tip
            title="Start Small"
            description="Begin with small investments and gradually increase as you learn more."
          />
          <Tip
            title="Research First"
            description="Always research and understand what you're investing in before making decisions."
          />
        </div>
      </div>
    </PageContainer>
  );
};

const StockItem = ({ symbol, name, price, change, positive }: { symbol: string; name: string; price: string; change: string; positive: boolean }) => (
  <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
    <div>
      <div className="font-semibold">{symbol}</div>
      <div className="text-sm text-gray-600">{name}</div>
    </div>
    <div className="text-right">
      <div className="font-semibold">${price}</div>
      <div className={`text-sm flex items-center ${positive ? 'text-success' : 'text-red-500'}`}>
        {positive ? (
          <ArrowUpRight className="w-4 h-4 mr-1" />
        ) : (
          <ArrowDownRight className="w-4 h-4 mr-1" />
        )}
        {change}
      </div>
    </div>
  </div>
);

const Tip = ({ title, description }: { title: string; description: string }) => (
  <div className="p-3 hover:bg-gray-50 rounded-lg transition-colors">
    <div className="font-medium mb-1">{title}</div>
    <div className="text-sm text-gray-600">{description}</div>
  </div>
);

export default Invest;
