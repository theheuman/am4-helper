import {Component} from '@angular/core';
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonRow,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {Price, PriceService} from "../../services/price.service";
import {CurrencyPipe, DatePipe, DecimalPipe, NgClass, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-prices-page',
  templateUrl: 'prices.page.html',
  styleUrls: ['prices.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, NgForOf, IonCol, DecimalPipe, CurrencyPipe, NgClass, IonButton, DatePipe, NgIf]
})
export class PricesPage {
  prices: Price[] = [];
  timezone = '';
  utcOffset = 0;

  constructor(private priceService: PriceService) {
    const now = new Date()
    this.priceService.getPricesSubject().subscribe((prices) => {
      this.prices = [...prices.values()].filter((price) => this.shouldShowPrice(price, now))
    })
    this.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    this.utcOffset = now.getTimezoneOffset() / 60;
  }

  // show if price is less than 1 hour old, but not more than 16 hours ahead
  shouldShowPrice(price: Price, now: Date) {
    const oneHourInMilliseconds = 1000 * 60 * 60
    const hoursToShow = 23
    const cutOffTime = oneHourInMilliseconds * hoursToShow;
    const isAfterNow = price.time.getTime()  >= now.getTime() - oneHourInMilliseconds
    const isBeforeCutoffTime = price.time.getTime() <= now.getTime() + cutOffTime
    return isAfterNow && isBeforeCutoffTime
  }

  isCurrentHour(price: Price) {
    const now = new Date()
    now.setMinutes(now.getMinutes() >= 30 ? 30 : 0)
    return price.time.getDate() === now.getDate() && price.time.getHours() === now.getHours() && price.time.getMinutes() === now.getMinutes()
  }
}
