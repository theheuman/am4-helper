import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import {NgIf} from "@angular/common";
import {ResourceUsage, UsageService} from "../services/usage.service";
import {UsageTableComponent} from "./components/usage-table/usage-table.component";

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
      this.calculateTimes(milliseconds)
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
      this.calculateTimes(milliseconds)
    })
  }

  calculateTimes(milliseconds: number) {
    this.startedAt = this.usageService.convertDate(new Date(milliseconds));
    const sixteenHours = 57600000
    this.endAt = this.usageService.convertDate(new Date(milliseconds + sixteenHours))
  }

  reset() {
    this.usageService.reset().then(() => {
      this.startedAt = '';
      this.endAt = '';
    })
  }
}
