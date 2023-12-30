import { Injectable } from '@angular/core';
import {Preferences} from "@capacitor/preferences";
import {BehaviorSubject, Subject} from "rxjs";
import {time} from "ionicons/icons";

const storageKey = 'prices'

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
    const storageResult = await Preferences.get({
      key: storageKey,
    })
    if (!storageResult.value) {
      throw Error('No prices found in storage')
    }
    const prices: {time: string, fuel: string, co2:string}[] = JSON.parse(storageResult.value)
    const mappedPrices = this.mapArrayToHash(prices.map((price) => ({time: new Date(price.time), co2: Number(price.co2), fuel: Number(price.fuel)})))
    this.pricesSubject.next(mappedPrices)

  }

  async setPrices(prices: Price[]) {
    const lastPrices = [...this.pricesSubject.getValue().values()];
    const lastOfPreviousEntry = lastPrices[-1]
    if (lastOfPreviousEntry && (lastOfPreviousEntry.time > prices[0].time)) {
      throw Error("Your new prices are before previously set prices")
    }
    const now = new Date()
    const allPrices: Price[] = [...lastPrices, ...prices].filter((price) => price.time.getDate() > (now.getDate() - 2))
    await Preferences.set({
      key: storageKey,
      value: JSON.stringify(allPrices),
    })
    this.pricesSubject.next(this.mapArrayToHash(allPrices))
  }

  reset() {
    this.pricesSubject.next(new Map<number, Price>())
    return Preferences.remove({
      key: storageKey,
    })
  }

  mapArrayToHash(priceArray: Price[]): Map<number, Price> {
    return new Map(priceArray.map(
        (price ) => {
          return [price.time.getTime(), { time: price.time, fuel: Number(price.fuel), co2: Number(price.co2)}]
        }));
  }
}
