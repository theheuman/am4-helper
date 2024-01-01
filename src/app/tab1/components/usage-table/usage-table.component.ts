import {Component, Input} from '@angular/core';
import {FrontendUsage, UsageService} from "../../../services/usage.service";
import {DecimalPipe, NgForOf, NgIf} from "@angular/common";
import {MillionPipe} from "../../../pipes/million.pipe";
import {addIcons} from "ionicons";
import {caretUp, caretDown} from "ionicons/icons";
import {UsageRowComponent} from "../usage-row/usage-row.component";
import { IonGrid, IonCol, IonRow } from '@ionic/angular/standalone';

@Component({
  selector: 'app-usage-table',
  templateUrl: './usage-table.component.html',
  styleUrls: ['./usage-table.component.scss'],
  standalone: true,
  imports: [
    NgForOf,
    DecimalPipe,
    NgIf,
    MillionPipe,
    IonGrid,
    IonCol,
    IonRow,
    UsageRowComponent,
  ]
})
export class UsageTableComponent {
  beforeUsage: FrontendUsage[] = []
  afterUsage: FrontendUsage[] = []
  currentHalfHour: FrontendUsage | undefined;

  currentToggleText = 'Show Before';
  showBefore = false;

  constructor(private usageService: UsageService) {
    addIcons({ caretUp, caretDown });

    this.usageService.getFrontendUsageSubject().subscribe(({before, after, current}) => {
      this.beforeUsage = before
      this.afterUsage = after
      this.currentHalfHour = current
    })
  }

  toggleBeforeTable() {
    this.showBefore = !this.showBefore
    this.currentToggleText = this.showBefore ? 'Hide Before': 'Show Before'
  }
}
