import { Component } from '@angular/core';
import {IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol} from '@ionic/angular/standalone';
import {Price, PriceService} from "../services/price.service";
import {DecimalPipe, NgForOf} from "@angular/common";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, NgForOf, IonCol, DecimalPipe]
})
export class Tab2Page {
  prices: Price[] = [];

  constructor(private priceService: PriceService) {
    this.priceService.getPrices().then((prices) => {
      console.log("Setting prices", prices)
      this.prices = prices
    })
  }

}
