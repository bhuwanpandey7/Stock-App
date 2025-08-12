import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
  name: 'stockCurrency',
  standalone: true
})
export class StockCurrencyPipe implements PipeTransform {
  private currencyPipe = new CurrencyPipe('en-US');

  transform(value: number | null | undefined): string {
    return this.currencyPipe.transform(value, 'USD', 'symbol', '1.2-2') ?? '';
  }
}
