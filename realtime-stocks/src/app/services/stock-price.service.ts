import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Stock } from '../models/stock.interface';

@Injectable()
export class StockPriceService implements OnDestroy {
  private stocksSubject = new BehaviorSubject<Stock[]>([]);
  stocks$ = this.stocksSubject.asObservable();
  private socket!: Socket;
  private connectionStatusSubject = new BehaviorSubject<boolean>(false);
  connectionStatus$ = this.connectionStatusSubject.asObservable();

  constructor() {
    this.connectSocket();
  }

  private connectSocket() {
    this.socket = io('http://localhost:3000');

    this.socket.on('connect', () => {
      this.connectionStatusSubject.next(true);
    });

    this.socket.on('stockUpdate', (response: any) => {
      const stocks = this.transformStocksRealTimeData(response);
      this.stocksSubject.next(stocks);
    });

    this.socket.on('disconnect', () => {
      this.connectionStatusSubject.next(false);
    });

    this.socket.on('error', (err: any) => {
      console.error('WebSocket error:', err);
      this.stocksSubject.next([]);
    });
  }

  private transformStocksRealTimeData(response: any): Stock[] {
    return response?.quoteResponse?.result?.map((item: any) => ({
      symbol: item.symbol,
      name: item.shortName || item.longName || item.symbol,
      currentPrice: item.regularMarketPrice,
      dailyHigh: item.regularMarketDayHigh,
      dailyLow: item.regularMarketDayLow,
      week52High: item.fiftyTwoWeekHigh,
      week52Low: item.fiftyTwoWeekLow,
      enabled: true,
    }));
  }

  toggleStock(name: string, enabled: boolean) {
    const updated = this.stocksSubject.value.map((stock) =>
      stock.name === name ? { ...stock, enabled } : stock
    );
    this.stocksSubject.next(updated);
  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
