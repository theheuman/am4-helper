import {Component, Input, OnInit} from '@angular/core';
import {CalculatedUsageValues} from "../../../services/usage.service";
import {IonCol, IonicModule, IonRow} from "@ionic/angular";
import {NgIf} from "@angular/common";
import {MillionPipe} from "../../../pipes/million.pipe";

export interface FrontendUsage {
  time: string,
  co2: {
    total: CalculatedUsageValues,
    individual: CalculatedUsageValues,
  },
  fuel: {
    total: CalculatedUsageValues,
    individual: CalculatedUsageValues,
  }
}

@Component({
  selector: 'app-usage-row',
  templateUrl: './usage-row.component.html',
  styleUrls: ['./usage-row.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    MillionPipe,
  ]
})
export class UsageRowComponent {
  @Input() usageEntry!: FrontendUsage
  constructor() { }
}
