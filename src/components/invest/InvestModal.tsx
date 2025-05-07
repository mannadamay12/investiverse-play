import { useEffect, useState } from "react";

interface InvestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvest: (amount: number) => void;
  symbol: string;
  currentPrice?: number;
  tradeType: "BUY" | "SELL";
}

export const InvestModal = ({
  isOpen,
  onClose,
  onInvest,
  symbol,
  currentPrice,
  tradeType,
}: InvestModalProps) => {
  const [amount, setAmount] = useState("");
  const [lockedPrice, setLockedPrice] = useState<number | undefined>(undefined);

  // Lock the currentPrice only once when modal opens
  useEffect(() => {
    if (isOpen) {
      setLockedPrice(currentPrice);
    } else {
      setAmount("");
      setLockedPrice(undefined);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    const value = parseFloat(amount);
    if (!value || value <= 0 || !lockedPrice) return;
    onInvest(value);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {tradeType === "BUY" ? "Buy" : "Sell"} {symbol}
        </h2>

        <p className="text-sm text-gray-600 mb-2">
          Locked Price:{" "}
          {lockedPrice !== undefined
            ? `$${lockedPrice.toFixed(2)}`
            : "Loading..."}
        </p>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount in dollars"
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={!lockedPrice || !amount || parseFloat(amount) <= 0}
          >
            Confirm {tradeType}
          </button>
        </div>
      </div>
    </div>
  );
};
