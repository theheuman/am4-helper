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
import {CurrencyPipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-tab3',
  templateUrl: 'calculator.page.html',
  styleUrls: ['calculator.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonTextarea, IonButton, IonInput, IonLabel, IonCol, IonRow, CurrencyPipe, NgIf],
})
export class CalculatorPage {
  inputValue: string = '';
  distance: number = 0;
  ticketPrices: {
    y: number;
    j: number;
    f: number;
  } | undefined
  constructor() {}

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
