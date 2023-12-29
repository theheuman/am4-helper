import { Component } from '@angular/core';
import {IonHeader, IonToolbar, IonTitle, IonContent, IonTextarea, IonButton} from '@ionic/angular/standalone';
import {min} from "rxjs";
import {PriceService} from "../services/price.service";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonTextarea, IonButton],
})
export class Tab3Page {
  inputValue: string = '';
  prices: {
    time: string;
    co2: number;
    fuel: number;
  }[] = []
  constructor(private priceService: PriceService) {}

  updateInput(event: Event) {
    const target = event.target as HTMLInputElement
    this.inputValue = target.value
  }

  submitInput() {
    const mappedHalfHours = []
    const halfHours = this.inputValue.split('<:clock_white:1076054104905887744>')
    let previousTime = undefined;
    for (const halfHour of halfHours) {
      const halfHourSplit = halfHour.split('\n')
      if (!halfHourSplit[1]) {
        continue
      }
      const halfHourSplit2 = halfHourSplit[1].split('CO')
      const timeArray = halfHourSplit[0].trim().split(':')
      const hours = Number(timeArray[0])
      const minutes = Number(timeArray[1])
      const time = this.createDateFromHhmm(hours, minutes, previousTime)
      previousTime = time;
      const fuel = Number(halfHourSplit2[0].replace('Fuel: ', '').split('$')[0].replace(',', ''))
      const co2 = Number(halfHourSplit2[1].split('$')[0].replace('₂: ', ''))
      mappedHalfHours.push({
        time,
        fuel,
        co2,
      })
    }
    this.priceService.setPrices(mappedHalfHours).then(() => {
      this.inputValue = ''
    })
  }

  createDateFromHhmm(hours: number, minutes: number, previousTime: Date | undefined) {
    const now = new Date()
    const timeWithHours = now.setHours(hours)
    let time = new Date(new Date(timeWithHours).setMinutes(minutes));
    time = new Date(time.setSeconds(0));

    // convert date from berlin time to est by getting the diff between the two
    const invdate = new Date(time.toLocaleString('en-US', {
      timeZone: 'Europe/Berlin'
    }));
    const diff = Math.abs(time.getTime() - invdate.getTime());

    time = new Date(time.getTime() - diff);
    if (previousTime && previousTime > time) {
      time = new Date(time.setDate(time.getDate() + 1))
    }
    return time

  }
}
