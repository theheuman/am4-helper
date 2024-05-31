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
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate()+1);
    const todaysUtcDate = now.getUTCDate()
    const tomorrowsUtcDate = tomorrow.getUTCDate()
    const todaysResourceKey = todaysUtcDate + '' as '1' // casted to a valid key in the resource prices object
    const tomorrowsResourceKey = tomorrowsUtcDate + '' as '1'
    const todaysPrices = resourcePrices[todaysResourceKey].map((price) => this.fixDate({time: new Date(price.time), fuel: price.fuel, co2: price.co2}, now))
    let tomorrowsPrices = resourcePrices[tomorrowsResourceKey].map((price) => this.fixDate({time: new Date(price.time), fuel: price.fuel, co2: price.co2}, tomorrow))
    const prices: Price[] = [...todaysPrices, ...tomorrowsPrices]
    const mappedPrices = this.mapArrayToHash(prices)
    this.pricesSubject.next(mappedPrices)
  }

  fixDate(price: Price, correctDate: Date): Price {
    const wrongMonthTime = new Date(price.time)
    const rightMonthTime = new Date(wrongMonthTime.setUTCMonth(correctDate.getUTCMonth()))
    return {time: rightMonthTime, co2: Number(price.co2), fuel: Number(price.fuel)}
  }

  mapArrayToHash(priceArray: Price[]): Map<number, Price> {
    return new Map(priceArray.map(
        (price ) => {
          return [price.time.getTime(), { time: price.time, fuel: Number(price.fuel), co2: Number(price.co2)}]
        }));
  }
}
