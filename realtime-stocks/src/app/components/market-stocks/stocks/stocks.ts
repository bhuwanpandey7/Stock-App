import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockListComponent } from '../stock-list/stock-list';

@Component({
  selector: 'app-stocks',
  standalone: true,
  imports: [CommonModule, StockListComponent],
  templateUrl: './stocks.html',
  styleUrls: ['./stocks.scss']
})
export class StocksComponent {
  isLoading = false;
  markets = [
    'US',
    'Europe',
    'Asia',
    'Australia',
    'Canada',
    'South America',
    'Africa',
    'Middle East'
  ];
  selectedMarket = 'US';

  selectMarket(market: string) {
    this.selectedMarket = market;
  }
}
