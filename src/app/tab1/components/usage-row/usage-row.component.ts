import {Component, Input } from '@angular/core';
import {CalculatedUsageValues} from "../../../services/usage.service";
import { IonicModule } from "@ionic/angular";
import {NgClass, NgIf} from "@angular/common";
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
    NgClass,
    NgIf,
  ]
})
export class UsageRowComponent {
  @Input() usageEntry!: FrontendUsage
  @Input() isCurrent = false
  @Input() showTotal = false

  constructor() { }
}
