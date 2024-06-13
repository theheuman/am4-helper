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

type SeatConfiguration = {
  y: number;
  j: number;
  f: number;
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'calculator.page.html',
  styleUrls: ['calculator.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonTextarea, IonButton, IonInput, IonLabel, IonCol, IonRow, CurrencyPipe, NgIf, IonToggle, IonGrid],
})
export class CalculatorPage {
  showDistanceHint = false;
  distance: number = 0;
  demand?: SeatConfiguration
  flightsPerDay = 3;
  totalSeats = 600;
  mode: 'realism' | 'easy' = 'easy'
  hasLounge = true;

  ticketPrices?: SeatConfiguration
  seatAllotment?: SeatConfiguration

  constructor() {}

  toggleDistanceHint() {
    this.showDistanceHint = !this.showDistanceHint
  }

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
    this.ticketPrices = this.calculateTicketPrices()
    this.seatAllotment = this.calculateSeatAllotment(this.ticketPrices)
  }

  private calculateTicketPrices() {
    if (this.mode === 'easy') {
      return {
        y: Math.floor((this.distance * 0.4 + 170)) * 1.1,
        j: Math.floor((this.distance * 0.8 + 560)) * 1.08,
        f: Math.floor((this.distance * 1.2 + 1200)) * 1.06,
      }
    }
    else {
      return {
        y: Math.floor(Math.floor((this.distance * 0.3 + 150)) * 1.1),
        j: Math.floor(Math.floor((this.distance * 0.6 + 500)) * 1.08),
        f: Math.floor(Math.floor((this.distance * 0.9 + 1000)) * 1.06),
      }
    }
  }

  private calculateSeatAllotment(ticketPrices: SeatConfiguration) {
    const loungeMultiplier = this.hasLounge ? 1.1 : 1
    if (this.totalSeats && this.demand) {
      const maxY = Math.floor(this.demand.y * 1.05 / this.flightsPerDay);
      const maxJ = Math.floor(this.demand.j * loungeMultiplier * 1.05 / this.flightsPerDay);
      const maxF = Math.floor(this.demand.f * loungeMultiplier * 1.05 / this.flightsPerDay);

      const seatInformationY = { seatClass: 'y', price: ticketPrices.y, seatsTaken: 1, seatsAlloted: 0, max: maxY }
      const seatInformationJ = { seatClass: 'j', price: ticketPrices.j, seatsTaken: 2, seatsAlloted: 0, max: maxJ }
      const seatInformationF = { seatClass: 'f', price: ticketPrices.f, seatsTaken: 3, seatsAlloted: 0, max: maxF }


      const sortedByProfit = [seatInformationY, seatInformationJ, seatInformationF].sort((a, b) => (b.price / b.seatsTaken) - (a.price / a.seatsTaken))

      // now that we have sorted profit, we know which class is more profitable. Fill up seats to the max with that one, then next, until we get to totalSeats cap
      let spaceAvailable = this.totalSeats;
      for (const seatInformation of sortedByProfit) {
        const potentialSpaceTakenByClassTotal = seatInformation.max * seatInformation.seatsTaken;
        const spaceTakenByClassTotal = Math.min(potentialSpaceTakenByClassTotal, spaceAvailable)
        seatInformation.seatsAlloted = Math.floor( spaceTakenByClassTotal / seatInformation.seatsTaken)
        spaceAvailable -= spaceTakenByClassTotal
      }

      return {
        y: seatInformationY.seatsAlloted,
        j: seatInformationJ.seatsAlloted,
        f: seatInformationF.seatsAlloted,
        seatsLeft: spaceAvailable
      }
    }
    else {
      return undefined;
    }
  }
}
