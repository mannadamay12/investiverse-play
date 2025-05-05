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

/**
 * Fetches financial advice for a user based on their question.
 */
export async function fetchAdvice(userId: string, question: string): Promise<{ response: string }> {
  try {
    const resp = await fetch(`http://0.0.0.0:8000/advice/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ question })
    });

    if (!resp.ok) {
      throw new Error('Failed to fetch advice');
    }

    const data = await resp.json();
    return data as { response: string };
  } catch (error) {
    console.error('Error fetching advice:', error);
    throw error;
  }
}