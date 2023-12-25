import {Component, Input, OnInit} from '@angular/core';
import {ResourceUsage, UsageService} from "../../../services/usage.service";
import {DecimalPipe, NgForOf, NgIf} from "@angular/common";
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
export class UsageTableComponent implements OnInit {
  @Input() currentTime!: number;
  usage: ResourceUsage[];
  beforeUsage: ResourceUsage[] = []
  afterUsage: ResourceUsage[] = []
  private intervalTimeInMilliseconds = 30*60*1000

  currentToggleText = 'Hide Before';
  showBefore = true;

  constructor(private usageService: UsageService) {
    this.usage = this.usageService.getUsage()
  }

  ngOnInit() {
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
        usageEntry.time = this.usageService.convertDate(new Date(epochTime))
        if (epochTime < this.currentTime) {
          this.beforeUsage.push(usageEntry)
        }
        else {
          const newEntry = {
            time: usageEntry.time,
            usage: {
              fuel: usageEntry.usage.fuel + previousEntry.fuel,
              co2: usageEntry.usage.co2 + previousEntry.co2,
            }
          }
          this.afterUsage.push(newEntry)
          previousEntry.co2 = newEntry.usage.co2;
          previousEntry.fuel = newEntry.usage.fuel;
        }
      })
    })

  }

  toggleBeforeTable() {
    this.showBefore = !this.showBefore
    this.currentToggleText = this.showBefore ? 'Hide Before': 'Show Before'
  }
}
