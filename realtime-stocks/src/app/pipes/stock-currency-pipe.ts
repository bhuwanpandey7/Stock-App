import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
  name: 'stockCurrency',
  standalone: true,
})
export class StockCurrencyPipe implements PipeTransform {
  private currencyPipe = new CurrencyPipe('en-US');
  transform(
    value: number,
    currencyCode: string = 'USD',
    display: 'code' | 'symbol' = 'symbol',
    digitsInfo: string = '1.2-2'
  ): string | null {
    if (value == null) {
      return null;
    }
    return this.currencyPipe.transform(
      value,
      currencyCode,
      display,
      digitsInfo
    );
  }
}
