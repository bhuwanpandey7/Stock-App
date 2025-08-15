import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockListComponent } from '../stock-list/stock-list';

@Component({
  selector: 'app-stocks',
  standalone: true,
  imports: [CommonModule, StockListComponent],
  templateUrl: './stocks.html',
  styleUrls: ['./stocks.scss'],
})
export class StocksComponent {
  isLoading = false;
  isNavCollapsed = true;
  // create separate enum
  markets = [
    'US',
    'Europe',
    'Asia',
    'Australia',
    'Canada',
    'South America',
    'Africa',
    'Middle East',
  ];
  selectedMarket = 'US';

  @HostListener('window:resize')
  onResize() {
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (window.innerWidth >= 992) {
      navbarCollapse?.classList.remove('show');
    }
  }

  selectMarket(market: string) {
    this.selectedMarket = market;
    this.isNavCollapsed = true;
    this.closeNavbar();
  }

  closeNavbar() {
    const navEl = document.getElementById('marketNav');
    if (navEl?.classList.contains('show')) {
      navEl.classList.remove('show');
    }
  }
}
