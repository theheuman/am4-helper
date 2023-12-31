import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Preferences} from "@capacitor/preferences";

const storageKey = 'dayStart';

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  dayParameters = new BehaviorSubject({
    startTime: 0,
    endTime: 0,
  })
  currentTime = new BehaviorSubject(Date.now());

  constructor() {
    this.initializeCurrentTime()
    this.initializeStartTime()
  }

  private initializeCurrentTime() {
    console.log("Initializing start time")
    const time = new Date()
    const secondsRemaining = (60 - time.getSeconds()) * 1000;

    const updateCurrentTime = () => {
      console.log("Updating current time")
      this.currentTime.next(Date.now())
    }

    setTimeout(function() {
      console.log("First update")
      updateCurrentTime()
      setInterval(updateCurrentTime, 60000);
    }, secondsRemaining);
  }

  async initializeStartTime() {
    const storageResult = await Preferences.get({
      key: storageKey,
    })
    if (!storageResult.value) {
      throw Error('No start time value in storage')
    }
    const startTime = Number(storageResult.value)
    const endTime = this.getEndTime(startTime)
    this.dayParameters.next({
      startTime,
      endTime,
    });
  }

  async setStartTime(date?: Date) {
    const startTime = !!date ? date.getTime() : Date.now();

    await Preferences.set({
      key: storageKey,
      value: startTime + '',
    })

    this.dayParameters.next({
      startTime: startTime,
      endTime: this.getEndTime(startTime),
    });
  }


  private getEndTime(startTime: number) {
    const sixteenHours = 57600000
    const endTime = startTime + sixteenHours;
    if (endTime < Date.now()) {
      throw Error('End time before now, start new day')
    }
    return endTime;
  }

  reset() {
    this.dayParameters.next({
      startTime: 0,
      endTime: 0,
    });
    return Preferences.remove({
      key: storageKey,
    })
  }

  getCurrentTimeSubject() {
    return this.currentTime
  }

  getDayParametersSubject() {
    return this.dayParameters
  }
}
