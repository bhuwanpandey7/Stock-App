/*
Adapter Service to transform API response to the shape of the Stock Item Interface
*/

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, interval, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Stock } from '../models/stock.interface';

@Injectable({
  providedIn: 'root',
})
export class StockPriceService {
  private stocksSubject = new BehaviorSubject<Stock[]>([]);
  private apiUrl = 'http://localhost:3000/api/stocks';

  constructor(private http: HttpClient) {
    this.fetchStocks();
    interval(60000).subscribe(() => this.fetchStocks());
  }

  getStocks(): Observable<Stock[]> {
    return this.stocksSubject.asObservable();
  }

  private fetchStocks(): void {
    let stocks: Stock[] = [];
    this.http
      .get<any>(this.apiUrl)
      .pipe(
        tap((response) => {
          if (response?.quoteResponse?.result?.length) {
            stocks = this.transformStocksRealTimeData(stocks, response);
          } else if (!stocks.length) {
            stocks = [];
          }
          this.stocksSubject.next(stocks);
        }),
        catchError((error) => {
          stocks = [];
          this.stocksSubject.next(stocks);
          return of(stocks);
        })
      )
      .subscribe();
  }

  private transformStocksRealTimeData(stocks: Stock[], response: any) {
    stocks = response.quoteResponse.result.map((item: any) => ({
      symbol: item.symbol,
      name: item.shortName || item.longName || item.symbol,
      currentPrice: item.regularMarketPrice,
      dailyHigh: item.regularMarketDayHigh,
      dailyLow: item.regularMarketDayLow,
      week52High: item.fiftyTwoWeekHigh,
      week52Low: item.fiftyTwoWeekLow,
      enabled: true,
    }));
    return stocks;
  }

  toggleStock(name: string, enabled: boolean) {
    const updated = this.stocksSubject.value.map((stock) =>
      stock.name === name ? { ...stock, enabled } : stock
    );
    this.stocksSubject.next(updated);
  }
}
