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
const symbols = ["AAPL", "GOOGL", "MSFT", "TSLA"];

let stockCache = {};
const clientDisabledStocks = {};

io.on("connection", (socket) => {
  clientDisabledStocks[socket.id] = new Set();
  socket.on("toggleStock", ({ name, enabled }) => {
    if (!enabled) {
      clientDisabledStocks[socket.id].add(name);
    } else {
      clientDisabledStocks[socket.id].delete(name);
    }
  });
  const sendStockData = async () => {
    try {
      const results = await yahooFinance.quote(symbols);
      results.forEach((stock) => {
        const key = stock.shortName || stock.symbol;
        stockCache[key] = stock;
      });
      const disabledSet = clientDisabledStocks[socket.id];
      const finalData = Object.values(stockCache).map((stock) => {
        const key = stock.shortName || stock.symbol;
        if (disabledSet.has(key)) {
          return { ...stockCache[key], _frozen: true };
        }
        return stock;
      });
      socket.emit("stockUpdate", {
        quoteResponse: { result: finalData },
      });
    } catch (error) {
      socket.emit("error", "Failed to fetch stock data");
    }
  };
  sendStockData();
  const intervalId = setInterval(sendStockData, 6000);
  socket.on("disconnect", () => {
    clearInterval(intervalId);
    delete clientDisabledStocks[socket.id];
  });
});

server.listen(PORT, () => {});
