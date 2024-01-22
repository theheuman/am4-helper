import { Injectable } from '@angular/core';
import {getRawDataConvertedToNumbers} from "./usage.data";
import {BehaviorSubject} from "rxjs";
import {TimeService} from "./time/time.service";
import {Price, PriceService} from "./price.service";

export interface CalculatedUsageValues {
  low: number;
  high: number;
  average: number;
}
export interface ResourceUsage {
  time: string;
  fuel: CalculatedUsageValues;
  co2: CalculatedUsageValues;
}

export interface FrontendUsage {
  time: string,
  co2: {
    total: CalculatedUsageValues,
    individual: CalculatedUsageValues,
    price?: number,
  },
  fuel: {
    total: CalculatedUsageValues,
    individual: CalculatedUsageValues,
    price?: number,
  }
}

interface ResourceBuy {
  reserves: {
    average: number,
    high: number
  }
  buy: {
    average: number,
    high: number
  }
}
export interface BuyingGuideEntry {
  fuel: ResourceBuy,
  co2: ResourceBuy,
}

const fuelCapacity = 40000000
const co2Capacity = 35000000

@Injectable({
  providedIn: 'root'
})
export class UsageService {
  private usageSubject = new BehaviorSubject<{
    before: FrontendUsage[],
    after: FrontendUsage[],
    current: FrontendUsage | undefined,
  }>({before: [], after: [], current: undefined})
  private buyingGuideSubject = new BehaviorSubject<BuyingGuideEntry[]>([])
  previousTime = 0;
  private intervalTimeInMilliseconds = 30*60*1000

  constructor(private timeService: TimeService, private priceService: PriceService) {
    this.setUsage(Date.now())

    this.timeService.getDayParametersSubject().subscribe(() => {
      this.previousTime = 0; // reset previous time on day start
      this.setUsage(this.timeService.currentTime.getValue())
    })
    this.timeService.getCurrentTimeSubject().subscribe((currentTime) => {
      this.setUsage(currentTime)
    })
    this.priceService.getPricesSubject().subscribe((prices) => {
      this.previousTime = 0; // reset previous time to trigger rerender of table
      this.setUsage(this.timeService.currentTime.getValue())
    })
  }

  getFrontendUsageSubject() {
    return this.usageSubject
  }

  convertDate(date: Date) {
    return date.toLocaleString('default', { hour: '2-digit', minute: 'numeric', hour12: false });
  }

  calculateGuide(usage: FrontendUsage[]) {
    const guide: BuyingGuideEntry[] = []
    let indexOutside = 0
    for (const currentEntry of usage) {
      const guideEntry: BuyingGuideEntry = {
        fuel: {
          reserves: {
            average: fuelCapacity,
            high: fuelCapacity
          },
          buy: {
            average: currentEntry.fuel.individual.average,
            high: currentEntry.fuel.individual.high
          }
        },
        co2: {
          reserves: {
            average: fuelCapacity,
            high: fuelCapacity
          },
          buy: {
            average: currentEntry.co2.individual.average,
            high: currentEntry.co2.individual.high
          }
        }
      }

      const currentFuelPrice = currentEntry.fuel.price ?? 1400
      const currentCo2price = currentEntry.co2.price ?? 150

      for (let i = indexOutside + 1; i < usage.length; i++) {
        const nextEntry = usage[i]
        const nextFuelPrice = nextEntry.fuel.price ?? 1400
        const nextCo2price = nextEntry.co2.price ?? 150
        if (nextFuelPrice < currentFuelPrice) {
          // calculate how much to buy for current entry
        }
      }
      indexOutside++;
    }
  }

  private isSameHalfHour(newTime: number, previousTime: number) {
    const newAsDate = new Date(newTime);
    const prevAsDate = new Date(previousTime);
    const newIsSecondHalf = newAsDate.getMinutes() >= 30
    const previousIsSecondHalf = prevAsDate.getMinutes() >= 30
    return newAsDate.getHours() === prevAsDate.getHours() && newIsSecondHalf === previousIsSecondHalf
  }

  private setUsage(currentTime: number) {
    const startTime = this.timeService.getDayParametersSubject().getValue().startTime
    if (!startTime || this.isSameHalfHour(currentTime, this.previousTime)) {
      return;
    }
    this.previousTime = currentTime
    const beforeUsage: FrontendUsage[] = [];
    const afterUsage: FrontendUsage[] = [];

    const startTimeDate = new Date(startTime)
    const minutes = startTimeDate.getMinutes()
    if (minutes < 30) {
      startTimeDate.setMinutes(0)
    }
    else {
      startTimeDate.setMinutes(30)
    }
    const previousEntry = {
      co2: {
        low: 0,
        high: 0,
        average: 0,
      },
      fuel: {
        low: 0,
        high: 0,
        average: 0,
      },
    }

    const prices = this.priceService.getPricesSubject().getValue()
    this.getBackEndUsage().forEach((usageEntry, index) => {
      const epochTime = startTimeDate.getTime() + (index * this.intervalTimeInMilliseconds);
      const localDate = new Date(epochTime)
      const matchingPrice = prices.get(localDate.getTime())
      const cet = localDate.toLocaleString('default', { hour: '2-digit', minute: 'numeric', hour12: false, timeZone: 'Europe/Berlin' })
      usageEntry.time = this.convertDate(localDate) + ' (' + cet + ')';
      if (epochTime < currentTime) {
        beforeUsage.push(this.mapToFrontend(previousEntry, usageEntry, matchingPrice))
      }
      else {
        const frontendEntry = this.mapToFrontend(previousEntry, usageEntry, matchingPrice)
        afterUsage.push(frontendEntry)
        previousEntry.co2 = frontendEntry.co2.total;
        previousEntry.fuel = frontendEntry.fuel.total;
      }
    })
    // pop the current hour into a special place
    const currentHalfHour = beforeUsage.pop()
    this.usageSubject.next({
      before: beforeUsage,
      after: afterUsage,
      current: currentHalfHour,
    })
  }

  private getBackEndUsage(): ResourceUsage[] {
    return getRawDataConvertedToNumbers().map((rawDataEntry) => {
      const sortedCo2 = [rawDataEntry.co2one, rawDataEntry.co2two, rawDataEntry.co2three].sort((a, b) => a - b)
      const sortedFuel = [rawDataEntry.fuelOne, rawDataEntry.fuelTwo, rawDataEntry.fuelThree].sort((a, b) => a - b)
      return {
        time: rawDataEntry.time,
        fuel: {
          low: sortedFuel[0],
          high: sortedFuel[2],
          average: rawDataEntry.fuelAverage,
        },
        co2: {
          low: sortedCo2[0],
          high: sortedCo2[2],
          average: rawDataEntry.co2average,
        }
      }
    })
  }

  mapToFrontend(previousUsage: {co2: CalculatedUsageValues, fuel: CalculatedUsageValues}, usageEntry: ResourceUsage, matchingPrice?: Price): FrontendUsage {
    const totalCo2: CalculatedUsageValues = {
      low: previousUsage.co2.low + usageEntry.co2.low,
      high: previousUsage.co2.high + usageEntry.co2.high,
      average: previousUsage.co2.average + usageEntry.co2.average,
    };
    const totalFuel: CalculatedUsageValues = {
      low: previousUsage.fuel.low + usageEntry.fuel.low,
      high: previousUsage.fuel.high + usageEntry.fuel.high,
      average: previousUsage.fuel.average + usageEntry.fuel.average,
    };
    return {
      time: usageEntry.time,
      co2: {
        total: totalCo2,
        individual: usageEntry.co2,
        price: matchingPrice?.co2,
      },
      fuel: {
        total: totalFuel,
        individual: usageEntry.fuel,
        price: matchingPrice?.fuel
      }
    }
  }
}


