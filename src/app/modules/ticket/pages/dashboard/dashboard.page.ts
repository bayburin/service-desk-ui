import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { DashboardI } from '@models/dashboard.interface';
import { DashboardService } from '@modules/ticket/services/dashboard/dashboard.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPageComponent implements OnInit {
  public data: DashboardI;
  public loading = false;

  constructor(private dashboardDataService: DashboardService) { }

  ngOnInit() {
    this.loading = true;
    this.dashboardDataService.loadAll()
      .pipe(finalize(() => this.loading = false))
      .subscribe((data: DashboardI) => this.data = data);
  }
}
