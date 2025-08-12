import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Stock } from '../../../models/stock.interface';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-stock-item',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './stock-item.html',
  styleUrls: ['./stock-item.scss']
})
export class StockItemComponent {
  @Input() stock!: Stock;
  @Input() isMobile = false;
  @Output() toggleStock = new EventEmitter<Stock>();

  onToggle() {
    this.toggleStock.emit(this.stock);
  }
}
