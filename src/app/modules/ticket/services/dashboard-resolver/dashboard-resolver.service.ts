import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { DashboardService } from '@modules/ticket/services/dashboard/dashboard.service';
import { DashboardI } from '@models/dashboard.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardResolverService implements Resolve<DashboardI> {
  constructor(private dashboardService: DashboardService) {}

  resolve(): Observable<DashboardI> | Observable<never> {
    return this.dashboardService.getAll();
  }
}
