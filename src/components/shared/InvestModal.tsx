import { useState } from "react";
import { useUser } from "@/contexts/user-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { submitTrade } from "@/lib/api";
import type { TradeRequest } from "@/types/trade";

interface InvestModalProps {
  isOpen: boolean;
  onClose: () => void;
  stockName: string;
  currentPrice: number;
}

export function InvestModal({ isOpen, onClose, stockName, currentPrice }: InvestModalProps) {
  const { user } = useUser();
  const [shares, setShares] = useState<number>(0);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleTrade = async (tradeType: "BUY" | "SELL") => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to trade",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const tradeData: TradeRequest = {
        user_id: user.id,
        stock_name: stockName,
        trade_type: tradeType,
        quantity: shares,
        price: currentPrice
      };

      const response = await submitTrade(tradeData);
      
      toast({
        title: "Success",
        description: response.message,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit trade",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Trade {stockName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="shares">Number of Shares</Label>
            <Input
              id="shares"
              type="number"
              min="1"
              value={shares}
              onChange={(e) => setShares(Number(e.target.value))}
              required
            />
          </div>

          <div className="text-sm">
            <p>Current Price: ${currentPrice.toFixed(2)}</p>
            <p>Total Value: ${(shares * currentPrice).toFixed(2)}</p>
          </div>

          <div className="flex justify-between gap-2">
            <Button 
              onClick={() => handleTrade("BUY")} 
              disabled={isLoading}
              className="flex-1"
              variant="default"
            >
              Buy Shares
            </Button>
            <Button 
              onClick={() => handleTrade("SELL")} 
              disabled={isLoading}
              className="flex-1"
              variant="destructive"
            >
              Sell Shares
            </Button>
          </div>
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
