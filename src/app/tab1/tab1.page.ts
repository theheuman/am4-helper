import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import {NgIf} from "@angular/common";
import { UsageService} from "../services/usage.service";
import {UsageTableComponent} from "./components/usage-table/usage-table.component";
import {setNotifications} from "../services/notification.util";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, NgIf, UsageTableComponent],
})
export class Tab1Page {
  startedAt: string;
  currentTime: {
    milliseconds: number;
    hourMinutes: string;
  };
  endAt: string;

  constructor(private usageService: UsageService) {
    this.startedAt = '';
    this.endAt = '';
    const now = Date.now()
    this.currentTime = {
      milliseconds: now,
      hourMinutes: usageService.convertDate(new Date(now))
    };

    usageService.getStartTime().then((milliseconds) => {
      this.startedAt = this.usageService.convertDate(new Date(milliseconds));
      this.endAt = this.usageService.convertDate(new Date(this.usageService.getEndTime()))
      setNotifications(milliseconds)
    })

    setInterval(() => {
      const now = Date.now()
      this.currentTime = {
        milliseconds: now,
        hourMinutes: usageService.convertDate(new Date(now))
      };
    }, 20000);
  }

  startDay() {
    this.usageService.setStartTime().then((milliseconds) => {
      this.startedAt = this.usageService.convertDate(new Date(milliseconds));
      this.endAt = this.usageService.convertDate(new Date(this.usageService.getEndTime()))
      setNotifications(milliseconds)
    })
  }

  reset() {
    this.usageService.reset().then(() => {
      this.startedAt = '';
      this.endAt = '';
    })
  }
}
