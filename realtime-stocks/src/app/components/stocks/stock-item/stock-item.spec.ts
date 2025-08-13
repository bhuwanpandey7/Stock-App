import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockCurrencyPipe } from '../../../pipes/stock-currency-pipe';
import { CommonModule } from '@angular/common';
import { Stock } from '../../../models/stock.interface';
import { By } from '@angular/platform-browser';
import { StockItemComponent } from './stock-item';

describe('StockItemComponent', () => {
  let component: StockItemComponent;
  let fixture: ComponentFixture<StockItemComponent>;

  const mockStock: Stock = {
    symbol: 'AAPL',
    name: 'Apple Inc',
    currentPrice: 150,
    dailyHigh: 155,
    dailyLow: 145,
    week52High: 200,
    week52Low: 120,
    enabled: true,
    regularMarketPreviousClose: 0
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, StockCurrencyPipe, StockItemComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StockItemComponent);
    component = fixture.componentInstance;
    component.stock = mockStock;
    component.currencyType = 'USD';
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize dailyStats and weekStats on ngOnInit', () => {
    component.ngOnInit();
    expect(component.dailyStats).toEqual([
      { label: 'Daily High Price:', value: 155 },
      { label: 'Daily Low Price:', value: 145 }
    ]);
    expect(component.weekStats).toEqual([
      { label: '52W High Price:', value: 200 },
      { label: '52W Low Price:', value: 120 }
    ]);
  });

  it('should emit toggleStock when onToggle is called', () => {
    spyOn(component.toggleStock, 'emit');
    component.onToggle();
    expect(component.toggleStock.emit).toHaveBeenCalledWith(mockStock);
  });

  it('should render stock name in template', () => {
    const nameElement = fixture.debugElement.query(By.css('.stock-name'));
    if (nameElement) {
      expect(nameElement.nativeElement.textContent).toContain('Apple');
    }
  });
});
