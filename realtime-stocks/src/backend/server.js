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
    "AIR.PA",
    "RDSA.AS",
    "BAS.DE",
    "SIE.DE",
    "SAN.PA",
    "BMW.DE",
    "NESN.SW",
    "NOVN.SW",
  ],
  Asia: [
    "7203.T",
    "9984.T",
    "0005.HK",
    "2318.HK",
    "6758.T",
    "6861.T",
    "0700.HK",
  ],
  Australia: ["BHP.AX", "CBA.AX", "WBC.AX", "TLS.AX", "WES.AX", "CSL.AX"],
  Canada: ["RY.TO", "TD.TO", "BNS.TO", "ENB.TO", "CNQ.TO"],
  MiddleEast: ["ARAMCO.SR", "SABIC.SR", "EMAAR.DU", "DPW.DU"],
  Africa: [
    // South Africa (JSE)
    "PRX",
    "BHG",
    "BTI",
    "NPN",
    "CPI",
    "FSR",
    "SBK",
    "MTN",
    // Egypt
    "EGX30",
    // Ghana
    "GSE Composite",
    // BRVM West Africa
    "ETIT",
    "SNTS",
    "PALC",
    "SGBC",
    "UNXC",
  ],
};

// Per-client state
const stockCache = {}; // last known stock data per client
const clientDisabledStocks = {}; // disabled stocks per client
const clientMarket = {}; // selected market per client

io.on("connection", (socket) => {
  stockCache[socket.id] = {};
  clientDisabledStocks[socket.id] = new Set();
  clientMarket[socket.id] = "US";

  socket.on("selectMarket", (market) => {
    if (marketSymbols[market]) {
      clientMarket[socket.id] = market;
      stockCache[socket.id] = {}; // reset cache when switching
      sendStockData(socket);
    }
  });

  socket.on("toggleStock", ({ name, enabled }) => {
    if (!enabled) {
      clientDisabledStocks[socket.id].add(name);
    } else {
      clientDisabledStocks[socket.id].delete(name);
    }
  });

  const sendStockData = async (sock = socket) => {
    const market = clientMarket[sock.id];
    const symbols = marketSymbols[market] || [];
    const cache = stockCache[sock.id];
    const disabledSet = clientDisabledStocks[sock.id];

    try {
      // Fetch latest from Yahoo
      const results = await yahooFinance.quote(symbols);

      // Update cache ONLY for enabled stocks
      results.forEach((stock) => {
        if (!stock) return;
        const symbol = stock.symbol;
        if (!disabledSet.has(symbol)) {
          cache[symbol] = stock;
        }
      });

      // Build final dataset
      const finalData = symbols
        .map((symbol) => {
          const stock = cache[symbol];
          if (!stock) return null;

          if (disabledSet.has(symbol)) {
            // Frozen: return last known with frozen flag
            return { ...stock, _frozen: true };
          }
          return stock;
        })
        .filter(Boolean);

      sock.emit("stockUpdate", {
        quoteResponse: { result: finalData },
      });
    } catch (error) {
      sock.emit("error", "Failed to fetch stock data");
    }
  };

  // Send immediately + every 5s
  sendStockData();
  const intervalId = setInterval(() => sendStockData(), 5000);

  socket.on("disconnect", () => {
    clearInterval(intervalId);
    delete stockCache[socket.id];
    delete clientDisabledStocks[socket.id];
    delete clientMarket[socket.id];
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
