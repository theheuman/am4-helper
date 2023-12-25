import {Component, Input, OnInit} from '@angular/core';
import {ResourceUsage, UsageService} from "../../../services/usage.service";
import {DecimalPipe, NgForOf} from "@angular/common";
@Component({
  selector: 'app-usage-table',
  templateUrl: './usage-table.component.html',
  styleUrls: ['./usage-table.component.scss'],
  standalone: true,
  imports: [
    NgForOf,
    DecimalPipe
  ]
})
export class UsageTableComponent {
  @Input() currentTime!: number;
  usage: ResourceUsage[];

  constructor(private usageService: UsageService) {
    this.usage = this.usageService.getUsage()
  }



}
