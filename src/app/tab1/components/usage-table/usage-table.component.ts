import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ResourceUsage, UsageService} from "../../../services/usage.service";
import {DecimalPipe, NgForOf, NgIf} from "@angular/common";

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
    NgIf
  ]
})
export class UsageTableComponent implements OnInit, OnChanges {
  @Input() currentTime!: number;
  usage: ResourceUsage[];
  beforeUsage: FrontendUsage[] = []
  afterUsage: FrontendUsage[] = []
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
          this.afterUsage.push(this.mapToFrontend(previousEntry, usageEntry))
          previousEntry.co2 = usageEntry.usage.co2;
          previousEntry.fuel = usageEntry.usage.fuel;
        }
      })
    })

  }


  mapToFrontend(previousUsage: {co2: number, fuel: number}, usageEntry: ResourceUsage): FrontendUsage {
    const totalCo2 = previousUsage.co2 + usageEntry.usage.co2;
    const totalFuel = previousUsage.fuel + usageEntry.usage.fuel;
    return {
      time: usageEntry.time,
      co2: {
        total: totalCo2,
        individual: usageEntry.usage.co2
      },
      fuel: {
        total: totalFuel,
        individual: usageEntry.usage.fuel
      }
    }
  }

  toggleBeforeTable() {
    this.showBefore = !this.showBefore
    this.currentToggleText = this.showBefore ? 'Hide Before': 'Show Before'
  }
}
