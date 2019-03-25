import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { DashboardI } from '@models/dashboard.interface';
import { DashboardService } from '@modules/ticket/services/dashboard/dashboard.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPageComponent implements OnInit {
  public data: Observable<DashboardI>;

  constructor(private dashboardDataService: DashboardService) { }

  ngOnInit() {
    this.data = this.dashboardDataService.getAll();
  }
}
