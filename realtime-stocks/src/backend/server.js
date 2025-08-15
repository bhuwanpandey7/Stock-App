import express from "express";
import cors from "cors";
import yahooFinance from "yahoo-finance2";
import http from "http";
import { Server } from "socket.io";

const app = express();
const PORT = 3000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:4200" },
});

app.use(cors());

const marketSymbols = {
  US: [
    "AAPL",
    "GOOGL",
    "MSFT",
    "TSLA",
    "AMZN",
    "NVDA",
    "META",
    "NFLX",
    "JPM",
    "V",
  ],
  Europe: [
    "AIR.PA", // Airbus - Paris
    "RDSA.AS", // Shell - Amsterdam
    "BAS.DE", // BASF - Germany
    "SIE.DE", // Siemens - Germany
    "SAN.PA", // Sanofi - France
    "BMW.DE", // BMW - Germany
    "NESN.SW", // Nestlé - Switzerland
    "NOVN.SW", // Novartis - Switzerland
  ],
  Asia: [
    "7203.T", // Toyota - Tokyo
    "9984.T", // SoftBank - Tokyo
    "0005.HK", // HSBC - Hong Kong
    "2318.HK", // Ping An - Hong Kong
    "6758.T", // Sony - Tokyo
    "6861.T", // Keyence - Tokyo
    "0700.HK", // Tencent - Hong Kong
  ],
  Australia: [
    "BHP.AX", // BHP Group
    "CBA.AX", // Commonwealth Bank
    "WBC.AX", // Westpac
    "TLS.AX", // Telstra
    "WES.AX", // Wesfarmers
    "CSL.AX", // CSL Limited
  ],
  Canada: [
    "RY.TO", // Royal Bank of Canada
    "TD.TO", // Toronto-Dominion Bank
    "BNS.TO", // Bank of Nova Scotia
    "ENB.TO", // Enbridge
    "CNQ.TO", // Canadian Natural Resources
  ],
  MiddleEast: [
    "ARAMCO.SR", // Saudi Aramco - Saudi Stock Exchange
    "SABIC.SR", // SABIC
    "EMAAR.DU", // Emaar Properties - Dubai
    "DPW.DU", // Dubai Ports World
  ],
};

const stockCache = {};
const clientDisabledStocks = {};
const clientMarket = {};

io.on("connection", (socket) => {
  clientDisabledStocks[socket.id] = new Set();
  clientMarket[socket.id] = "US";

  socket.on("selectMarket", (market) => {
    if (marketSymbols[market]) {
      clientMarket[socket.id] = market;
      sendStockData();
    }
  });

  socket.on("toggleStock", ({ name, enabled }) => {
    if (!enabled) {
      clientDisabledStocks[socket.id].add(name);
    } else {
      clientDisabledStocks[socket.id].delete(name);
    }
  });

  const sendStockData = async () => {
    try {
      const market = clientMarket[socket.id];
      const symbols = marketSymbols[market] || [];

      const results = (await yahooFinance.quote(symbols)).filter(
        (r) => r !== null
      );
      results.forEach((stock) => {
        stockCache[stock.symbol] = stock;
      });

      const disabledSet = clientDisabledStocks[socket.id];
      const finalData = symbols.map((symbol) => {
        if (disabledSet.has(symbol)) {
          return { ...stockCache[symbol], _frozen: true };
        }
        return stockCache[symbol];
      });

      socket.emit("stockUpdate", {
        quoteResponse: { result: finalData },
      });
    } catch (error) {
      socket.emit("error", "Failed to fetch stock data");
    }
  };

  sendStockData();
  const intervalId = setInterval(sendStockData, 5000);

  socket.on("disconnect", () => {
    clearInterval(intervalId);
    delete clientDisabledStocks[socket.id];
    delete clientMarket[socket.id];
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
