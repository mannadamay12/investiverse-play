import { TradeRequest, TradeResponse } from "@/types/trade";

export async function submitTrade(tradeData: TradeRequest): Promise<TradeResponse> {
  try {
    const response = await fetch('http://0.0.0.0:8000/trades/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...tradeData,
        trade_type: tradeData.trade_type.toUpperCase()
      }),
    });

    if (!response.ok) {
      throw new Error('Trade submission failed');
    }

    const data = await response.json();
    return data as TradeResponse;
  } catch (error) {
    console.error('Error submitting trade:', error);
    throw new Error('Failed to submit trade');
  }
}

export async function fetchPortfolio(userId: string): Promise<any> {
  try {
    const response = await fetch(`http://0.0.0.0:8000/portfolio/${userId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Portfolio not found");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    throw new Error("Failed to fetch portfolio");
  }
}
