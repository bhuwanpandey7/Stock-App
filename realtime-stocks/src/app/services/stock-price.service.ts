import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Stock } from '../models/stock.interface';
import { StockItem } from '../types/stock.type';

@Injectable()
export class StockPriceService implements OnDestroy {
  private stocksSubject = new BehaviorSubject<Stock[]>([]);
  stocks$ = this.stocksSubject.asObservable();

  private manualOff = new Set<string>();
  private socket!: Socket;

  private connectionStatusSubject = new BehaviorSubject<boolean>(false);
  connectionStatus$ = this.connectionStatusSubject.asObservable();

  constructor() {
    this.initSocket();
  }

  private initSocket(): void {
    this.socket = io('http://localhost:3000');

    this.socket.on('connect', () => this.connectionStatusSubject.next(true));
    this.socket.on('disconnect', () =>
      this.connectionStatusSubject.next(false)
    );
    this.socket.on('error', () => this.stocksSubject.next([]));

    this.socket.on('stockUpdate', (res) => {
      const stocks = this.mergeManualOff(StockPriceService.mapResponse(res));
      this.stocksSubject.next(stocks);
    });
  }

  private mergeManualOff(stocks: Stock[]): Stock[] {
    return stocks.map((stock) =>
      this.manualOff.has(stock.name) ? { ...stock, enabled: false } : stock
    );
  }

  selectMarket(market: string) {
    this.socket.emit('selectMarket', market);
  }

  private static mapResponse(response: any): Stock[] {
    return (
      response?.quoteResponse?.result
        ?.filter((item: any) => item !== null && item !== undefined)
        .map((item: any) => ({
          symbol: item.symbol,
          name: item.shortName || item.longName || item.symbol,
          currentPrice: item.regularMarketPrice,
          regularMarketPreviousClose: item.regularMarketPreviousClose,
          dailyHigh: item.regularMarketDayHigh,
          dailyLow: item.regularMarketDayLow,
          week52High: item.fiftyTwoWeekHigh,
          week52Low: item.fiftyTwoWeekLow,
          enabled: true,
        })) ?? []
    );
  }

  toggleStock({ name, enabled }: StockItem): void {
    enabled ? this.manualOff.delete(name) : this.manualOff.add(name);
    this.socket.emit('toggleStock', { name, enabled });

    this.stocksSubject.next(
      this.stocksSubject.value.map((stock) =>
        stock.name === name ? { ...stock, enabled } : stock
      )
    );
  }

  ngOnDestroy(): void {
    this.socket?.disconnect();
  }
}
