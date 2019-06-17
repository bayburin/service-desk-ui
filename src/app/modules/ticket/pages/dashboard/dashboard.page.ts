import { Component, OnInit } from '@angular/core';
import { trigger, style, transition, animate, query, stagger } from '@angular/animations';
import { finalize, map } from 'rxjs/operators';

import { DashboardI } from '@interfaces/dashboard.interface';
import { DashboardService } from '@modules/ticket/services/dashboard/dashboard.service';
import { Service } from '@modules/ticket/models/service.model';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  animations: [
    trigger('ToggleQuestions', [
      transition('* => *', [
        query(':enter', [
          style({
            opacity: 0,
            height: 0,
            marginBottom: 0
          }),
          stagger(10, [
            animate(30, style({
              opacity: 1,
              height: '*',
              marginBottom: '*'
            })),
          ])
        ], { optional: true }),
        query(':leave', [
          stagger(30, [
            animate(50, style({
              opacity: 0,
              height: 0,
              marginBottom: 0
            })),
          ])
        ], { optional: true }),
      ]),
    ])
  ]
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

  trackByService(service: Service) {
    return service.id;
  }

  trackByTicket(ticket: Ticket) {
    return ticket.id;
  }
}
