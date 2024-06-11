import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonTextarea,
  IonButton,
  IonInput,
  IonLabel, IonCol, IonRow, IonToggle, IonGrid
} from '@ionic/angular/standalone';
import {CurrencyPipe, NgIf} from "@angular/common";
import {ToggleCustomEvent} from "@ionic/angular";

@Component({
  selector: 'app-tab3',
  templateUrl: 'calculator.page.html',
  styleUrls: ['calculator.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonTextarea, IonButton, IonInput, IonLabel, IonCol, IonRow, CurrencyPipe, NgIf, IonToggle, IonGrid],
})
export class CalculatorPage {
  distance: number = 0;
  demand?: {
    y: number;
    j: number;
    f: number;
  };
  flightsPerDay = 3;
  totalSeats = 600;
  mode: 'realism' | 'easy' = 'easy'
  hasLounge = true;

  ticketPrices?: {
    y: number;
    j: number;
    f: number;
  };
  seatAllotment: {
    y: number;
    j: number;
    f: number;
  } | undefined

  constructor() {}

  updateDistance(event: Event) {
    const target = event.target as HTMLInputElement
    this.distance = Number(target.value)
  }

  updateDemand(event: Event, seatClass: 'y' | 'j' | 'f') {
    const target = event.target as HTMLInputElement
    if (!this.demand) {
      this.demand = {
        y: 0,
        j: 0,
        f: 0
      }
    }
    this.demand[seatClass] = Number(target.value)
  }

  updateFlights(event: Event) {
    const target = event.target as HTMLInputElement
    this.flightsPerDay = Number(target.value)
  }

  updateSeats(event: Event) {
    const target = event.target as HTMLInputElement
    this.totalSeats = Number(target.value)
  }

  updateMode(event: ToggleCustomEvent) {
    this.mode = event.detail.checked ? 'realism' : 'easy'
  }

  updateLounge(event: ToggleCustomEvent) {
    this.hasLounge = event.detail.checked
  }

  calculate() {
    this.calculateTicketPrices()
    this.calculateSeatAllotment()
  }

  private calculateTicketPrices() {
    if (this.mode === 'easy') {
      this.ticketPrices = {
        y: Math.floor(Math.floor((this.distance * 0.3 + 150)) * 1.1),
        j: Math.floor(Math.floor((this.distance * 0.6 + 500)) * 1.08),
        f: Math.floor(Math.floor((this.distance * 0.9 + 1000)) * 1.06),
      }
    }
    else {
      this.ticketPrices = {
        y: Math.floor((this.distance * 0.4 + 170)) * 1.1,
        j: Math.floor((this.distance * 0.8 + 560)) * 1.08,
        f: Math.floor((this.distance * 1.2 + 1200)) * 1.06,
      }
    }
  }

  private calculateSeatAllotment() {
    const loungeMultiplier = this.hasLounge ? 1.1 : 1
    if (this.totalSeats && this.demand) {
      const maxY = Math.floor(this.demand.y * 1.05 / this.flightsPerDay);
      const maxJ = Math.floor(this.demand.j * loungeMultiplier * 1.05 / this.flightsPerDay);
      const maxF = Math.floor(this.demand.f * loungeMultiplier * 1.05 / this.flightsPerDay);

      // TODO calculate optimal seat allotment based on distance (also depends on mode)
      const f = maxF
      const j = maxJ
      const y = maxY

      this.seatAllotment = {
        y,
        j,
        f,
      }
    }
    else {
      this.seatAllotment = undefined;
    }
  }
}
