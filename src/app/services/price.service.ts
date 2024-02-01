import { Injectable } from '@angular/core';
import {Preferences} from "@capacitor/preferences";
import {BehaviorSubject, Subject} from "rxjs";
import * as resourcePrices from '../../assets/resource-prices.json';

export interface Price {
  time: Date;
  co2: number;
  fuel: number;
}
@Injectable({
  providedIn: 'root'
})
export class PriceService {
  // date.getTime() as key
  private pricesSubject = new BehaviorSubject<Map<number, Price>>(new Map<number, Price>())

  constructor() {
    this.getPrices()
  }

  getPricesSubject(): BehaviorSubject<Map<number, Price>> {
    return this.pricesSubject
  }

  private async getPrices(refresh?: boolean) {
    if (!refresh && this.pricesSubject.getValue().size > 1) {
      return;
    }
    const now = new Date()
    const todaysDate = now.getUTCDate() + '' as '1'
    console.log(todaysDate)
    const prices: Price[] = resourcePrices[todaysDate].map((price) => ({time: new Date(price.time), fuel: price.fuel, co2: price.co2}))
    const mappedPrices = this.mapArrayToHash(prices.map((price) => {
      const wrongMonthTime = new Date(price.time)
      const rightMonthTime = new Date(wrongMonthTime.setUTCMonth(now.getUTCMonth()))
      return {time: rightMonthTime, co2: Number(price.co2), fuel: Number(price.fuel)}
    }))
    this.pricesSubject.next(mappedPrices)
  }

  mapArrayToHash(priceArray: Price[]): Map<number, Price> {
    return new Map(priceArray.map(
        (price ) => {
          return [price.time.getTime(), { time: price.time, fuel: Number(price.fuel), co2: Number(price.co2)}]
        }));
  }
}
