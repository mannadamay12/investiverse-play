export interface TradeRequest {
  user_id: string;
  stock_name: string;
  trade_type: "BUY" | "SELL";
  quantity: number;
  price: number;
}

export interface TradeResponse {
  message: string;
}
