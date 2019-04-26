import { Component, OnInit } from '@angular/core';
import { finalize, map } from 'rxjs/operators';

import { DashboardI } from '@interfaces/dashboard.interface';
import { DashboardService } from '@modules/ticket/services/dashboard/dashboard.service';
import { Service } from '@modules/ticket/models/service.model';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPageComponent implements OnInit {
  data: DashboardI;
  loading = false;
  limits = {
    services: 6,
    questions: 3
  };

  constructor(private dashboardDataService: DashboardService) { }

  ngOnInit() {
    this.loading = true;
    this.dashboardDataService.loadAll()
      .pipe(
        finalize(() => this.loading = false),
        map((data) => {
          data.services.map((service) =>  {
            service.questionLimit = this.limits.questions;

            return service;
          });

          return data;
        })
      )
      .subscribe((data) => this.data = data);
  }

  /**
   * Переключатель "Показать все вопросы".
   *
   * @param service - сервис, у которого необходимо показать/скрыть вопросы.
   */
  toggleQuestionLimit(service: Service): void {
    service.questionLimit = this.isNeedToDropDown(service) ? service.tickets.length + 1 : this.limits.questions;
  }

  /**
   * Проверка, меньше ли текущий лимит выводимых вопросов количества всех вопросов.
   *
   * @param service - сервис, содержащий вопросы.
   */
  isNeedToDropDown(service: Service): boolean {
    return service.questionLimit < service.tickets.length;
  }
}
