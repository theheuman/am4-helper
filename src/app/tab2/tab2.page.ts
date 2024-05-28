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
import {Price, PriceService} from "../services/price.service";
import {CurrencyPipe, DatePipe, DecimalPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {UsageTableComponent} from "./components/usage-table/usage-table.component";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, NgForOf, IonCol, DecimalPipe, CurrencyPipe, NgClass, IonButton, UsageTableComponent, DatePipe, NgIf]
})
export class Tab2Page {
  prices: Price[] = [];

  constructor(private priceService: PriceService) {
    const now = new Date()
    this.priceService.getPricesSubject().subscribe((prices) => {
      this.prices = [...prices.values()].filter((price) => this.shouldShowPrice(price, now))
    })
  }

  // show if price is less than 1 hour old, but not more than 16 hours ahead
  shouldShowPrice(price: Price, now: Date) {
    const oneHourInMilliseconds = 1000 * 60 * 60
    const sixtenHoursInMilliseconds = oneHourInMilliseconds * 16;
    const isAfterNow = price.time.getTime()  >= now.getTime() - oneHourInMilliseconds
    const isBefore16hoursFromNow = price.time.getTime() <= now.getTime() + sixtenHoursInMilliseconds
    return isAfterNow && isBefore16hoursFromNow
  }

  isCurrentHour(price: Price) {
    const thirtyMinutesInMilliseconds = 1000 * 60 * 30
    const now = new Date()
    now.setMinutes(now.getMinutes() >= 30 ? 30 : 0)
    return price.time.getDate() === now.getDate() && price.time.getHours() === now.getHours() && price.time.getMinutes() === now.getMinutes()
  }
}
