import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CalculatedUsageValues, ResourceUsage, UsageService} from "../../../services/usage.service";
import {DecimalPipe, NgForOf, NgIf} from "@angular/common";
import {MillionPipe} from "../../../pipes/million.pipe";
import {addIcons} from "ionicons";
import {caretUp, caretDown} from "ionicons/icons";
import {FrontendUsage, UsageRowComponent} from "../usage-row/usage-row.component";
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
export class UsageTableComponent implements OnInit, OnChanges {
  @Input() currentTime!: number;
  usage: ResourceUsage[];
  beforeUsage: FrontendUsage[] = []
  afterUsage: FrontendUsage[] = []
  currentHalfHour: FrontendUsage | undefined;
  private intervalTimeInMilliseconds = 30*60*1000

  currentToggleText = 'Show Before';
  showBefore = false;

  constructor(private usageService: UsageService) {
    addIcons({ caretUp, caretDown });

    this.usage = this.usageService.getUsage()
  }

  ngOnInit() {
    this.setTableInfo(this.currentTime)
  }

  ngOnChanges(changes: SimpleChanges) {
    const changedCurrentTime = changes['currentTime']?.currentValue;
    if (changedCurrentTime) {
      this.setTableInfo(changedCurrentTime)
    }
  }

  setTableInfo(currentTime: number) {
    this.beforeUsage = [];
    this.afterUsage = [];
    this.usageService.getStartTime().then((startTime) => {
      const startTimeDate = new Date(startTime)
      const minutes = startTimeDate.getMinutes()
      if (minutes < 30) {
        startTimeDate.setMinutes(0)
      }
      else {
        startTimeDate.setMinutes(30)
      }
      const previousEntry = {
        co2: {
          low: 0,
          high: 0,
          average: 0,
        },
        fuel: {
          low: 0,
          high: 0,
          average: 0,
        },
      }

      this.usage.forEach((usageEntry, index) => {
        const epochTime = startTimeDate.getTime() + (index * this.intervalTimeInMilliseconds);
        const localDate = new Date(epochTime)
        const cet = localDate.toLocaleString('default', { hour: '2-digit', minute: 'numeric', hour12: false, timeZone: 'Europe/Berlin' })
        usageEntry.time = this.usageService.convertDate(localDate) + ' (' + cet + ')';
        if (epochTime < currentTime) {
          this.beforeUsage.push(this.mapToFrontend(previousEntry, usageEntry))
        }
        else {
          const frontendEntry = this.mapToFrontend(previousEntry, usageEntry)
          this.afterUsage.push(frontendEntry)
          previousEntry.co2 = frontendEntry.co2.total;
          previousEntry.fuel = frontendEntry.fuel.total;
        }
      })
      // pop the current hour into a special place
      this.currentHalfHour = this.beforeUsage.pop()
    })

  }


  mapToFrontend(previousUsage: {co2: CalculatedUsageValues, fuel: CalculatedUsageValues}, usageEntry: ResourceUsage): FrontendUsage {
    const totalCo2: CalculatedUsageValues = {
      low: previousUsage.co2.low + usageEntry.co2.low,
      high: previousUsage.co2.high + usageEntry.co2.high,
      average: previousUsage.co2.average + usageEntry.co2.average,
    };
    const totalFuel: CalculatedUsageValues = {
      low: previousUsage.fuel.low + usageEntry.fuel.low,
      high: previousUsage.fuel.high + usageEntry.fuel.high,
      average: previousUsage.fuel.average + usageEntry.fuel.average,
    };
    return {
      time: usageEntry.time,
      co2: {
        total: totalCo2,
        individual: usageEntry.co2
      },
      fuel: {
        total: totalFuel,
        individual: usageEntry.fuel
      }
    }
  }

  toggleBeforeTable() {
    this.showBefore = !this.showBefore
    this.currentToggleText = this.showBefore ? 'Hide Before': 'Show Before'
  }
}
