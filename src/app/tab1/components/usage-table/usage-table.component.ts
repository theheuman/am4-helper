import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ResourceUsage, UsageService} from "../../../services/usage.service";
import {DecimalPipe, NgForOf, NgIf} from "@angular/common";
import {MillionPipe} from "../../../pipes/million.pipe";
import {IonicModule} from "@ionic/angular";

interface FrontendUsage {
  time: string,
  co2: {
    total: number,
    individual: number,
  },
  fuel: {
    total: number,
    individual: number,
  }
}
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
    IonicModule
  ]
})
export class UsageTableComponent implements OnInit, OnChanges {
  @Input() currentTime!: number;
  usage: ResourceUsage[];
  beforeUsage: FrontendUsage[] = []
  afterUsage: FrontendUsage[] = []
  currentHalfHour: FrontendUsage | undefined;
  private intervalTimeInMilliseconds = 30*60*1000

  currentToggleText = 'Hide Before';
  showBefore = true;

  constructor(private usageService: UsageService) {
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
        co2: 0,
        fuel: 0,
      }

      this.usage.forEach((usageEntry, index) => {
        const epochTime = startTimeDate.getTime() + (index * this.intervalTimeInMilliseconds);
        const localDate = new Date(epochTime)
        const cet = localDate.toLocaleString('default', { hour: '2-digit', minute: 'numeric', hour12: false, timeZone: 'Europe/Berlin' })
        usageEntry.time = this.usageService.convertDate(localDate) + '(' + cet + ')';
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


  mapToFrontend(previousUsage: {co2: number, fuel: number}, usageEntry: ResourceUsage): FrontendUsage {
    const totalCo2 = previousUsage.co2 + usageEntry.co2.average;
    const totalFuel = previousUsage.fuel + usageEntry.fuel.average;
    return {
      time: usageEntry.time,
      co2: {
        total: totalCo2,
        individual: usageEntry.co2.average
      },
      fuel: {
        total: totalFuel,
        individual: usageEntry.fuel.average
      }
    }
  }

  toggleBeforeTable() {
    this.showBefore = !this.showBefore
    this.currentToggleText = this.showBefore ? 'Hide Before': 'Show Before'
  }
}
