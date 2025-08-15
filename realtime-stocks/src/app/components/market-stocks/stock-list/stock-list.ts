import {
  Component,
  OnInit,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Stock } from '../../../models/stock.interface';
import { StockPriceService } from '../../../services/stock-price.service';
import { CommonModule } from '@angular/common';
import { StockItemComponent } from '../stock-item/stock-item';

@Component({
  selector: 'app-stock-list',
  imports: [CommonModule, StockItemComponent],
  providers: [StockPriceService],
  templateUrl: './stock-list.html',
  styleUrls: ['./stock-list.scss'],
})
export class StockListComponent implements OnInit, OnChanges {
  @Input() market!: string;
  stocks: Stock[] = [];
  currencyType = 'USD';
  isMobile = window.innerWidth <= 768;
  isConnected = false;
  loading = false;

  constructor(private stockService: StockPriceService) {}

  ngOnInit() {
    this.stockService.stocks$.subscribe((data) => {
      this.stocks = data;
      this.loading = false;
    });

    this.stockService.connectionStatus$.subscribe((status) => {
      this.isConnected = status;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['market'] && this.market) {
      this.loading = true;
      this.stocks = [];
      this.stockService.selectMarket(this.market);
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth <= 768;
  }

  toggle(stock: Stock) {
    this.stockService.toggleStock({
      name: stock.name,
      enabled: !stock.enabled,
    });
  }
}
