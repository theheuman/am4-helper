import { Injectable } from '@angular/core';
import {Preferences} from "@capacitor/preferences";
import {BehaviorSubject, Subject} from "rxjs";
import * as resourcePrices from '../../assets/resource-prices.json';

export interface Price {
  time: Date;
  co2: number;
  fuel: number;
}

export interface RawPrice {
  time: string;
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
    const todaysResourceKey = String(todaysUtcDate) as '1' // casted to a valid key in the resource prices object
    const tomorrowsResourceKey = String(tomorrowsUtcDate) as '1'
    const todaysPrices = resourcePrices[todaysResourceKey].map((price) => this.fixDate({time: price.time, fuel: price.fuel, co2: price.co2}, now))
    let tomorrowsPrices = resourcePrices[tomorrowsResourceKey].map((price) => this.fixDate({time: price.time, fuel: price.fuel, co2: price.co2}, tomorrow))
    const prices: Price[] = [...todaysPrices, ...tomorrowsPrices]
    const mappedPrices = this.mapArrayToHash(prices)
    this.pricesSubject.next(mappedPrices)
  }

  fixDate(rawPrice: RawPrice, correctDate: Date): Price {
    const monthString = String(correctDate.getUTCMonth()+1).padStart(2, '0');
    const dayString = String(correctDate.getUTCDate()).padStart(2, '0');
    const time = new Date(`${correctDate.getFullYear()}-${monthString}-${dayString}T${rawPrice.time}`)
    return {time, co2: Number(rawPrice.co2), fuel: Number(rawPrice.fuel)}
  }

  mapArrayToHash(priceArray: Price[]): Map<number, Price> {
    return new Map(priceArray.map(
        (price ) => {
          return [price.time.getTime(), { time: price.time, fuel: Number(price.fuel), co2: Number(price.co2)}]
        }));
  }
}
