import { Injectable } from '@angular/core';
import {Preferences} from "@capacitor/preferences";
import {LocalNotifications, LocalNotificationSchema} from "@capacitor/local-notifications";
import {notifications} from "ionicons/icons";
import {setNotifications} from "./notification.util";

const storageKey = 'dayStart';

export interface ResourceUsage {
  time: string;
  usage: {
    co2: number;
    fuel: number;
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
    return [
      {
        time: "9:00",
        usage: {
          co2: 133093224,
          fuel: 38208384
        }
      },
      {
        time: "9:30",
        usage: {
          co2: 0,
          fuel: 0
        }
      },
      {
        time: "10:00",
        usage: {
          co2: 922780,
          fuel: 381962
        }
      },
      {
        time: "10:30",
        usage: {
          co2: 3573423,
          fuel: 1945861
        }
      },
      {
        time: "11:00",
        usage: {
          co2: 4033176,
          fuel: 2364449
        }
      },
      {
        time: "11:30",
        usage: {
          co2: 3197661,
          fuel: 1299847
        }
      },
      {
        time: "12:00",
        usage: {
          co2: 5373858,
          fuel: 1648824
        }
      },
      {
        time: "12:30",
        usage: {
          co2: 8859726,
          fuel: 2656788
        }
      },
      {
        time: "13:00",
        usage: {
          co2: 8662130,
          fuel: 3005027
        }
      },
      {
        time: "13:30",
        usage: {
          co2: 15526518,
          fuel: 4885676
        }
      },
      {
        time: "14:00",
        usage: {
          co2: 23961258,
          fuel: 6877879
        }
      },
      {
        time: "14:30",
        usage: {
          co2: 7115069,
          fuel: 2667538
        }
      },
      {
        time: "15:00",
        usage: {
          co2: 4526012,
          fuel: 1695270
        }
      },
      {
        time: "15:30",
        usage: {
          co2: 7504658,
          fuel: 2389637
        }
      },
      {
        time: "16:00",
        usage: {
          co2: 16360055,
          fuel: 5344825
        }
      },
      {
        time: "16:30",
        usage: {
          co2: 57007776,
          fuel: 16187090
        }
      },
      {
        time: "17:00",
        usage: {
          co2: 5517619,
          fuel: 2166080
        }
      },
      {
        time: "17:30",
        usage: {
          co2: 5667265,
          fuel: 1880335
        }
      },
      {
        time: "18:00",
        usage: {
          co2: 8159889,
          fuel: 2638758
        }
      },
      {
        time: "18:30",
        usage: {
          co2: 15664452,
          fuel: 4977656
        }
      },
      {
        time: "19:00",
        usage: {
          co2: 7439036,
          fuel: 2249721
        }
      },
      {
        time: "19:30",
        usage: {
          co2: 21721241,
          fuel: 6560804
        }
      },
      {
        time: "20:00",
        usage: {
          co2: 8831313,
          fuel: 3174627
        }
      },
      {
        time: "20:30",
        usage: {
          co2: 7281869,
          fuel: 2299856
        }
      },
      {
        time: "21:00",
        usage: {
          co2: 4480367,
          fuel: 1805389
        }
      },
      {
        time: "21:30",
        usage: {
          co2: 5568370,
          fuel: 2070782
        }
      },
      {
        time: "22:00",
        usage: {
          co2: 5969359,
          fuel: 2201158
        }
      },
      {
        time: "22:30",
        usage: {
          co2: 4864653,
          fuel: 1680456
        }
      },
      {
        time: "23:00",
        usage: {
          co2: 8666142,
          fuel: 2782809
        }
      },
      {
        time: "23:30",
        usage: {
          co2: 548488,
          fuel: 133114
        }
      },
      {
        time: "0:00",
        usage: {
          co2: 86048332,
          fuel: 24924900
        }
      },
      {
        time: "0:30",
        usage: {
          co2: 0,
          fuel: 0
        }
      },
      {
        time: "1:00",
        usage: {
          co2: 21568699,
          fuel: 6682620
        }
      }
    ];
  }
}


