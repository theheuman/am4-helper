import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonTextarea,
  IonButton,
  IonInput,
  IonLabel, IonCol, IonRow
} from '@ionic/angular/standalone';
import {PriceService} from "../services/price.service";
import {CurrencyPipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonTextarea, IonButton, IonInput, IonLabel, IonCol, IonRow, CurrencyPipe, NgIf],
})
export class Tab3Page {
  inputValue: string = '';
  distance: number = 0;
  ticketPrices: {
    y: number;
    j: number;
    f: number;
  } | undefined
  constructor(private priceService: PriceService) {}

  updateInput(event: Event) {
    const target = event.target as HTMLInputElement
    this.inputValue = target.value
  }

  updateDistance(event: Event) {
    const target = event.target as HTMLInputElement
    this.distance = Number(target.value)
  }

  calculateTicketPrices() {
    this.ticketPrices = {
      y: Math.floor((this.distance*0.4 + 170)) * 1.1,
      j: Math.floor((this.distance*0.8+560)) * 1.08,
      f: Math.floor((this.distance*1.2 + 1200)) * 1.06,
    }
  }
}
