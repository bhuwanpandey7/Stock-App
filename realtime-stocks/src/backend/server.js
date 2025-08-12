import express from 'express';
import cors from 'cors';
import yahooFinance from 'yahoo-finance2';

const app = express();
const PORT = 3000;

app.use(cors());

// Your stock symbols
const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA'];

app.get('/api/stocks', async (req, res) => {
  try {
    const results = await yahooFinance.quote(symbols);
    res.json({ quoteResponse: { result: results } });
  } catch (error) {
    console.error('Yahoo Finance API error:', error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
