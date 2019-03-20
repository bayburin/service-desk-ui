import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DashboardI } from '@models/dashboard.interface';
import { AppLoadService } from './../../../../core/initializer/app-load.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPageComponent implements OnInit {
  public data: DashboardI;

  constructor(private route: ActivatedRoute, private loadDataService: AppLoadService) { }

  ngOnInit() {
    // this.data = this.route.snapshot.data.data;
    this.data = this.loadDataService.getData();
  }
}
