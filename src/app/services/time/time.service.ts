import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

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

  getCurrentTimeSubject() {
    return this.currentTime
  }
}
