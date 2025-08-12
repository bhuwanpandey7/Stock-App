import { Component, OnInit, HostListener } from '@angular/core';
import { Stock } from '../../models/stock.interface';
import { StockPriceService } from '../../services/stock-price.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { StockItemComponent } from './stock-item/stock-item';

@Component({
  selector: 'app-stock-list',
  imports: [CommonModule, StockItemComponent],
  templateUrl: './stock-list.html',
  styleUrls: ['./stock-list.scss']
})
export class StockListComponent implements OnInit {
  stocks: Stock[] = [];
  isMobile = window.innerWidth <= 768;

  constructor(private stockService: StockPriceService) {}

  ngOnInit() {
    this.stockService.getStocks().subscribe(data => this.stocks = data);
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth <= 768;
  }

  toggle(stock: Stock) {
    this.stockService.toggleStock(stock.name, !stock.enabled);
  }
}
