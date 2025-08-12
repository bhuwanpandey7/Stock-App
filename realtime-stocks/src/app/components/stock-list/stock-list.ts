import { Component, OnInit, HostListener } from '@angular/core';
import { Stock } from '../../models/stock.interface';
import { StockPriceService } from '../../services/stock-price.service';
import { CommonModule } from '@angular/common';
import { StockItemComponent } from './stock-item/stock-item';
import { StockItem } from '../../types/stock.type';

@Component({
  selector: 'app-stock-list',
  imports: [CommonModule, StockItemComponent],
  providers: [StockPriceService],
  templateUrl: './stock-list.html',
  styleUrls: ['./stock-list.scss']
})
export class StockListComponent implements OnInit {
  stocks: Stock[] = [];
  currencyType: string =  'USD';
  isMobile = window.innerWidth <= 768;
  isConnected = false;

  constructor(private stockService: StockPriceService) {}
  ngOnInit() {
    this.stockService.stocks$.subscribe((data) => (this.stocks = data));
    this.stockService.connectionStatus$.subscribe((status) => {
      this.isConnected = status;
    });
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth <= 768;
  }

  toggle(stock: Stock) {
    this.stockService.toggleStock({name: stock.name, enabled: !stock.enabled});
  }
}
