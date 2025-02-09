import { TradeRequest, TradeResponse } from "@/types/trade";

export async function submitTrade(tradeData: TradeRequest): Promise<TradeResponse> {
  try {
    const response = await fetch('https://fastapi-project-production-fc1c.up.railway.app/trades/add', {
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
