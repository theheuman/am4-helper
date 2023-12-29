import { Injectable } from '@angular/core';
import {Preferences} from "@capacitor/preferences";

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
  private prices: Price[] = []

  constructor() {
    this.getPrices()
  }

  async getPrices(refresh?: boolean): Promise<Price[]> {
    if (!refresh && this.prices.length > 1) {
      console.log("Prices set", this.prices)
      return this.prices;
    }
    const storageResult = await Preferences.get({
      key: storageKey,
    })
    console.log("Prices not set", storageResult.value)
    if (!storageResult.value) {
      throw Error('No prices found in storage')
    }
    const prices = JSON.parse(storageResult.value)
    this.prices = prices.map((price: {time: string, fuel: string, co2:string}) => ({time: new Date(price.time), fuel: Number(price.fuel), co2: Number(price.co2)}))
    console.log(this.prices)
    return this.prices

  }

  async setPrices(prices: Price[]) {
    const lastPreviousEntry = this.prices[this.prices.length - 1]
    if (lastPreviousEntry && (lastPreviousEntry.time > prices[0].time)) {
      throw Error("Your new prices are before previously set prices")
    }
    const now = new Date()
    const allPrices: Price[] = [...this.prices, ...prices].filter((price) => price.time.getDate() > (now.getDate() - 2))
    await Preferences.set({
      key: storageKey,
      value: JSON.stringify(allPrices),
    })
    console.log("set prices", JSON.stringify(allPrices))
    this.prices = allPrices;
  }
}
