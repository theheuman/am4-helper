import { Component } from '@angular/core';
import {IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonDatetime} from '@ionic/angular/standalone';
import {NgIf} from "@angular/common";
import { UsageService} from "../services/usage.service";
import {UsageTableComponent} from "./components/usage-table/usage-table.component";
import {setNotifications} from "../services/notification.util";
import {DatetimeChangeEventDetail} from "@ionic/angular";
import {TimeService} from "../services/time/time.service";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonDatetime, NgIf, UsageTableComponent],
})
export class Tab1Page {
  startedAt: string;
  currentTime: {
    milliseconds: number;
    hourMinutes: string;
  };
  endAt: string;
  selectedTime: string = '';

  constructor(private usageService: UsageService, private timeService: TimeService) {
    this.startedAt = '';
    this.endAt = '';
    const now = Date.now()
    this.currentTime = {
      milliseconds: now,
      hourMinutes: usageService.convertDate(new Date(now))
    };
    this.timeService.getCurrentTimeSubject().subscribe((currentTime) => {
      this.currentTime = {
        milliseconds: currentTime,
        hourMinutes: usageService.convertDate(new Date(currentTime))
      }
    })

    timeService.getDayParametersSubject().subscribe(({startTime, endTime}) => {
      if (!startTime) {
        this.startedAt = '';
        this.endAt = '';
        return
      }
      this.startedAt = this.usageService.convertDate(new Date(startTime));
      this.endAt = this.usageService.convertDate(new Date(endTime))
      setNotifications(startTime)
    })
  }

  startDay() {
    const selectedStartTime = !!this.selectedTime ? new Date(this.selectedTime) : undefined
    this.timeService.setStartTime(selectedStartTime);
  }

  reset() {
    this.timeService.reset()
  }

  selectTime(event: Event) {
    const details = event.target as DatetimeChangeEventDetail
    this.selectedTime = details.value as string;
    console.log(this.selectedTime)
  }
}
