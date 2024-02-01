import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton
} from '@ionic/angular/standalone';
import {Price, PriceService} from "../services/price.service";
import {CurrencyPipe, DatePipe, DecimalPipe, NgClass, NgForOf} from "@angular/common";
import {UsageTableComponent} from "./components/usage-table/usage-table.component";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
    imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, NgForOf, IonCol, DecimalPipe, CurrencyPipe, NgClass, IonButton, UsageTableComponent, DatePipe]
})
export class Tab2Page {
  prices: Price[] = [];

  constructor(private priceService: PriceService) {
    this.priceService.getPricesSubject().subscribe((prices) => {
      this.prices = [...prices.values()]
    })
  }
}
