import { Component } from '@angular/core';
import {IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonDatetime} from '@ionic/angular/standalone';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-guides-page',
  templateUrl: 'guides.page.html',
  styleUrls: ['guides.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonDatetime, NgIf],
})
export class GuidesPage {

  constructor() {}
}
