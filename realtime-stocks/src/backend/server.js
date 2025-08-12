import express from "express";
import cors from "cors";
import yahooFinance from "yahoo-finance2";
import http from "http";
import { Server } from "socket.io";

const app = express();
const PORT = 3000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200",
  },
});

app.use(cors());

// ** Bhuwan ** - Just add any symbol to scale UI without any UI change
const symbols = ["AAPL", "GOOGL", "MSFT", "TSLA"];

io.on("connection", (socket) => {
  const sendStockData = async () => {
    try {
      const results = await yahooFinance.quote(symbols);
      socket.emit("stockUpdate", { quoteResponse: { result: results } });
    } catch (error) {
      socket.emit("error", "Failed to fetch stock data");
    }
  };

  sendStockData();
  const intervalId = setInterval(sendStockData, 6000);

  socket.on("disconnect", () => {
    clearInterval(intervalId);
  });
});

server.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
