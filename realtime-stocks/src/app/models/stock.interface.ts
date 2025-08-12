export interface Stock {
  symbol: string;
  name: string;
  regularMarketPreviousClose: number;
  currentPrice: number;
  dailyHigh: number;
  dailyLow: number;
  week52High: number;
  week52Low: number;
  enabled: boolean;
}
