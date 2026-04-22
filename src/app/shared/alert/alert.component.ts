import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertService } from './alert.service';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent {
  constructor(public alertService: AlertService) {}

  trackById(_: number, item: { id: string }) {
    return item.id;
  }
}
