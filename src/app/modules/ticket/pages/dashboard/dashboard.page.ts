import { Component, OnInit } from '@angular/core';
import { finalize, map } from 'rxjs/operators';

import { DashboardI } from '@models/dashboard.interface';
import { DashboardService } from '@modules/ticket/services/dashboard/dashboard.service';
import { ServiceI } from '@models/service.interface';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPageComponent implements OnInit {
  public data: DashboardI;
  public loading = false;
  public limits = {
    services: 6,
    questions: 3
  };

  constructor(private dashboardDataService: DashboardService) { }

  ngOnInit() {
    this.loading = true;
    this.dashboardDataService.loadAll()
      .pipe(
        finalize(() => this.loading = false),
        map((data: DashboardI) => {
          data.services.map((service: ServiceI) => service.questionLimit = this.limits.questions);

          return data;
        })
      )
      .subscribe((data: DashboardI) => this.data = data);
  }

  /**
   * Переключатель "Показать все вопросы".
   *
   * @param service - сервис, у которого необходимо показать/скрыть вопросы.
   */
  toggleQuestionLimit(service: ServiceI): void {
    service.questionLimit = service.questionLimit ? undefined : this.limits.questions;
  }
}
