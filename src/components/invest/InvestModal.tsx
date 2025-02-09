import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InvestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvest: (amount: number, orderType: string) => void;
  symbol: string;
  currentPrice: number;
}

export const InvestModal = ({
  isOpen,
  onClose,
  onInvest,
  symbol,
  currentPrice,
}: InvestModalProps) => {
  const [amount, setAmount] = useState("");
  const [orderType, setOrderType] = useState("market");
  const [shares, setShares] = useState("");

  const handleInvest = () => {
    const investAmount = orderType === "amount" ? Number(amount) : Number(shares) * currentPrice;
    if (investAmount > 0) {
      onInvest(investAmount, orderType);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invest in {symbol}</DialogTitle>
          <DialogDescription>
            Create your investment order for {symbol} at ${currentPrice.toFixed(2)}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label>Order Type</Label>
            <Select
              value={orderType}
              onValueChange={(value) => {
                setOrderType(value);
                setAmount("");
                setShares("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select order type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="amount">Dollar Amount</SelectItem>
                <SelectItem value="shares">Number of Shares</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {orderType === "amount" ? (
            <div>
              <Label>Amount to Invest ($)</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="0"
              />
              {amount && (
                <p className="text-sm text-gray-500 mt-1">
                  Estimated shares: {(Number(amount) / currentPrice).toFixed(4)}
                </p>
              )}
            </div>
          ) : (
            <div>
              <Label>Number of Shares</Label>
              <Input
                type="number"
                value={shares}
                onChange={(e) => setShares(e.target.value)}
                placeholder="Enter shares"
                min="0"
                step="0.0001"
              />
              {shares && (
                <p className="text-sm text-gray-500 mt-1">
                  Total cost: ${(Number(shares) * currentPrice).toFixed(2)}
                </p>
              )}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleInvest}>
            Invest Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
