import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import {Preferences} from "@capacitor/preferences";
import {NgIf} from "@angular/common";

const storageKey = 'dayStart';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, NgIf],
})
export class Tab1Page {
  startedAt: string;

  constructor() {
    this.startedAt = '';
    Preferences.get({
      key: storageKey
    }).then((result) => {
      const milliseconds = Number(result.value)
      if (milliseconds) {
        this.startedAt = this.convertDate(new Date(milliseconds));
      }
    })
  }

  startDay() {
    const now = Date.now();
    const nowDate = new Date(now)

    Preferences.set({
      key: storageKey,
      value: now + '',
    }).then(() => {
      console.log("Day started!", nowDate)
      this.startedAt = this.convertDate(nowDate);
    })
  }

  reset() {
    Preferences.remove({
      key: storageKey,
    }).then(() => {
      console.log("Day reset!", )
      this.startedAt = '';
    })
  }

  convertDate(date: Date) {
    return date.toLocaleString('default', { hour: '2-digit', minute: 'numeric', hour12: false });
  }
}
