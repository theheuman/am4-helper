import { Component } from '@angular/core';
import {IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonDatetime} from '@ionic/angular/standalone';
import {NgForOf, NgIf} from "@angular/common";
import {MarkdownComponent} from "ngx-markdown";

type Guide = { src: string, open: boolean, title: string, author: string}
@Component({
  selector: 'app-guides-page',
  templateUrl: 'guides.page.html',
  styleUrls: ['guides.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonDatetime, NgIf, MarkdownComponent, NgForOf],
})
export class GuidesPage {

  guides: Guide[]

  constructor() {
    this.guides = [
      {
        title: "THE AM4 GUIDE",
        author: "Scuderia Airlines (Star Alliance)",
        src: 'assets/guides/AM4-guide.md',
        open: false
      },
      {
        title: "The best planes of am4 (2020)",
        author: "TAM Linhas Aéreas",
        src: 'assets/guides/best-planes.md',
        open: false
      },
    ]
  }

  toggleGuideOpen(guide: Guide) {
    guide.open = !guide.open
  }
}
