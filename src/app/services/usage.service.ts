import { Injectable } from '@angular/core';
import {Preferences} from "@capacitor/preferences";
import {LocalNotifications, LocalNotificationSchema} from "@capacitor/local-notifications";
import {notifications} from "ionicons/icons";
import {setNotifications} from "./notification.util";
import {getRawData, getRawDataConvertedToNumbers} from "./usage.data";

const storageKey = 'dayStart';

export interface ResourceUsage {
  time: string;
  fuel: {
    low: number;
    average: number;
    high: number;
  };
  co2: {
    low: number;
    average: number;
    high: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class UsageService {
  private startTime: number;
  private endTime: number;

  constructor() {
    this.startTime = 0;
    this.endTime = 0;
  }

  async getStartTime(): Promise<number> {
    if (this.startTime) {
      return this.startTime;
    }
    const storageResult = await Preferences.get({
      key: storageKey,
    })
    const startTime = Number(storageResult.value)
    this.startTime = startTime;
    this.setEndTime(startTime)
    return startTime

  }

  async setStartTime(): Promise<number> {
    const now = Date.now();

    await Preferences.set({
      key: storageKey,
      value: now + '',
    })

    this.startTime = now;
    this.setEndTime(now)
    return now;

  }

  getEndTime() {
    return this.endTime;
  }

  private setEndTime(startTime: number) {
    const sixteenHours = 57600000
    this.endTime = startTime + sixteenHours;
  }

  reset() {
    this.startTime = 0;
    this.endTime = 0;
    return Preferences.remove({
      key: storageKey,
    })
  }

  convertDate(date: Date) {
    return date.toLocaleString('default', { hour: '2-digit', minute: 'numeric', hour12: false });
  }

  getUsage(): ResourceUsage[] {
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
}


