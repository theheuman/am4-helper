import { Injectable } from '@angular/core';
import {Preferences} from "@capacitor/preferences";
import {getRawDataConvertedToNumbers} from "./usage.data";
import {BehaviorSubject} from "rxjs";

const storageKey = 'dayStart';

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
  },
  fuel: {
    total: CalculatedUsageValues,
    individual: CalculatedUsageValues,
  }
}

@Injectable({
  providedIn: 'root'
})
export class UsageService {
  private startTimeSubject = new BehaviorSubject<number>(0);
  private endTime: number;
  private currentTimeSubject = new BehaviorSubject<number>(0);
  private usageSubject = new BehaviorSubject<{
    before: FrontendUsage[],
    after: FrontendUsage[],
    current: FrontendUsage | undefined,
  }>({before: [], after: [], current: undefined})
  private intervalTimeInMilliseconds = 30*60*1000

  constructor() {
    this.endTime = 0;
    this.setUsage(Date.now())

    this.initializeStartTime()
    this.startTimeSubject.subscribe(() => this.setUsage(this.currentTimeSubject.getValue()))

    setInterval(() => {
      const now = Date.now()
      this.setUsage(now)
    }, 20000);
  }

  getFrontendUsageSubject() {
    return this.usageSubject
  }

  getCurrentTimeSubject() {
    return this.currentTimeSubject
  }

  getStartTimeSubject() {
    return this.startTimeSubject
  }

  async initializeStartTime() {
    const storageResult = await Preferences.get({
      key: storageKey,
    })
    if (!storageResult.value) {
      throw Error('No start time value in storage')
    }
    const startTime = Number(storageResult.value)
    this.startTimeSubject.next(startTime);
    this.setEndTime(startTime)
  }

  async setStartTime(date?: Date): Promise<number> {
    const startTime = !!date ? date.getTime() : Date.now();

    await Preferences.set({
      key: storageKey,
      value: startTime + '',
    })

    this.startTimeSubject.next(startTime);
    this.setEndTime(startTime)
    return startTime;

  }

  getEndTime() {
    return this.endTime;
  }

  private setEndTime(startTime: number) {
    const sixteenHours = 57600000
    this.endTime = startTime + sixteenHours;
  }

  reset() {
    this.startTimeSubject.next(0);
    this.endTime = 0;
    return Preferences.remove({
      key: storageKey,
    })
  }

  convertDate(date: Date) {
    return date.toLocaleString('default', { hour: '2-digit', minute: 'numeric', hour12: false });
  }

  private isSameHalfHour(newTime: number, previousTime: number) {
    return newTime < previousTime
  }
  private setUsage(currentTime: number) {
    const previousTime = this.currentTimeSubject.getValue();
    this.currentTimeSubject.next(currentTime)
    if (!this.startTimeSubject.getValue() || this.isSameHalfHour(currentTime, previousTime)) {
      console.log('Start time or same half hour', this.startTimeSubject.getValue(), currentTime, previousTime)
      return;
    }
    const beforeUsage: FrontendUsage[] = [];
    const afterUsage: FrontendUsage[] = [];

    const startTimeDate = new Date(this.startTimeSubject.getValue())
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

    this.getBackEndUsage().forEach((usageEntry, index) => {
      const epochTime = startTimeDate.getTime() + (index * this.intervalTimeInMilliseconds);
      const localDate = new Date(epochTime)
      const cet = localDate.toLocaleString('default', { hour: '2-digit', minute: 'numeric', hour12: false, timeZone: 'Europe/Berlin' })
      usageEntry.time = this.convertDate(localDate) + ' (' + cet + ')';
      if (epochTime < currentTime) {
        beforeUsage.push(this.mapToFrontend(previousEntry, usageEntry))
      }
      else {
        const frontendEntry = this.mapToFrontend(previousEntry, usageEntry)
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

  mapToFrontend(previousUsage: {co2: CalculatedUsageValues, fuel: CalculatedUsageValues}, usageEntry: ResourceUsage): FrontendUsage {
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
        individual: usageEntry.co2
      },
      fuel: {
        total: totalFuel,
        individual: usageEntry.fuel
      }
    }
  }
}


