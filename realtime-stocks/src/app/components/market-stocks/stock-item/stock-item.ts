import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Stock } from '../../../models/stock.interface';
import { CommonModule } from '@angular/common';
import { StockCurrencyPipe } from '../../../pipes/stock-currency-pipe';
import { StockStats } from '../../../types/stock-stats.type';

@Component({
  selector: 'app-stock-item',
  imports: [CommonModule, StockCurrencyPipe],
  templateUrl: './stock-item.html',
  styleUrls: ['./stock-item.scss'],
})
export class StockItemComponent implements OnInit {
  @Input() stock!: Stock;
  @Input() isMobile = false;
  @Input() currencyType!: string;
  @Output() toggleStock = new EventEmitter<Stock>();
  stockClasses!: Record<string, boolean>;
  dailyStats!: StockStats[];
  weekStats!: StockStats[];

  ngOnInit() {
    this.dailyStats = [
      { label: 'Daily High Price:', value: this.stock.dailyHigh },
      { label: 'Daily Low Price:', value: this.stock.dailyLow },
    ];

    this.weekStats = [
      { label: '52W High Price:', value: this.stock.week52High },
      { label: '52W Low Price:', value: this.stock.week52Low },
    ];
  }

  onToggle() {
    this.toggleStock.emit(this.stock);
  }
}
