import express from "express";
import cors from "cors";
import yahooFinance from "yahoo-finance2";

const app = express();
const PORT = 3000;

app.use(cors());

const symbols = ["AAPL", "GOOGL", "MSFT", "TSLA"]; // just add more to scale UI for more stocks

app.get("/api/stocks", async (req, res) => {
  try {
    const results = await yahooFinance.quote(symbols);
    res.json({ quoteResponse: { result: results } });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});

app.listen(PORT, () => {
  console.log(`Back-end server running on http://localhost:${PORT}`);
});
