import { Component, OnInit, OnDestroy, ViewChild, AfterViewChecked } from '@angular/core';
import { finalize, tap, switchMap, filter, delay, map, takeWhile } from 'rxjs/operators';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { Subscription, Subject } from 'rxjs';

import { TicketService } from '@shared/services/ticket/ticket.service';
import { ServiceService } from '@shared/services/service/service.service';
import { Service } from '@modules/ticket/models/service/service.model';
import { contentBlockAnimation } from '@animations/content.animation';
import { QuestionTicket } from '@modules/ticket/models/question_ticket/question_ticket.model';
import { ResponsibleUserService } from '@shared/services/responsible_user/responsible-user.service';
import { ServiceDetailComponent } from '@modules/ticket/admin/components/service-detail/service-detail.component';
import { QuestionComponent } from '../../components/question/question.component';

@Component({
  selector: 'app-tickets-detail-page',
  templateUrl: './tickets-detail.page.html',
  styleUrls: ['./tickets-detail.page.sass'],
  animations: [contentBlockAnimation]
})
export class TicketsDetailPageComponent implements OnInit, OnDestroy, AfterViewChecked {
  loading = false;
  service: Service;
  @ViewChild(ServiceDetailComponent, { static: false }) private serviceDetailComponent: ServiceDetailComponent;
  private routeSub: Subscription;
  private questionStream = new Subject();
  private ticketId: number;
  private questionClosed = true;

  constructor(
    private serviceService: ServiceService,
    private ticketService: TicketService,
    private router: Router,
    private route: ActivatedRoute,
    private responsibleUserService: ResponsibleUserService
  ) { }

  ngOnInit() {
    this.service = this.serviceService.service;
    this.ticketId = this.route.snapshot.queryParams.ticket;
    this.loadDraftTickets();
    this.openQuestionStream();

    this.routeSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart && !event.url.includes('/admin')) {
        this.serviceService.removeTickets(this.ticketService.draftTickets);
      }
    });
  }

  ngAfterViewChecked() {
    if (!this.ticketId || !this.serviceDetailComponent) {
      return;
    }

    const serviceDetailComponent = this.serviceDetailComponent.questionTemplateComponent.toArray();

    this.questionStream.next(serviceDetailComponent);
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  private loadDraftTickets() {
    this.loading = true;
    this.ticketService.loadDraftTicketsFor(this.service)
      .pipe(
        finalize(() => this.loading = false),
        tap((tickets: QuestionTicket[]) => {
          this.serviceService.removeDraftTickets();
          this.serviceService.addTickets(tickets);
        }),
        switchMap(tickets => {
          const tns = tickets.flatMap(ticket => ticket.getResponsibleUsersTn());

          return this.responsibleUserService.loadDetails(tns)
            .pipe(tap(details => tickets.forEach(ticket => ticket.associateResponsibleUserDetails(details))));
        })
      )
      .subscribe();
  }

  /**
   * Создает подписку для раскрытия выбранного вопроса после рендера страницы.
   */
  private openQuestionStream(): void {
    this.questionStream
      .pipe(
        filter((componentArr: []) => componentArr.length !== 0),
        delay(300),
        takeWhile(() => this.questionClosed),
        map(componentArr => this.openSelectedQuestion(componentArr))
      )
      .subscribe();
  }

  /**
   * Вызывает метод toggleTicket() у компонента для раскрытия вопроса.
   *
   * @param componentArr - массив компонентов, содержащих вопросы.
   */
  private openSelectedQuestion(componentArr: QuestionComponent[]): void {
    const selectedComponent = componentArr.find(el => el.question.hasId(this.ticketId));

    if (selectedComponent) {
      selectedComponent.showOriginal();
      this.openQuestionComponent(selectedComponent);
    }
  }

  private openQuestionComponent(questionComponent: QuestionComponent): void {
    questionComponent.toggleQuestion();
    this.scrollToTicket(questionComponent.question.originalId || questionComponent.question.id);
    this.questionClosed = false;
  }

  /**
   * Перемещает экран к указанному id.
   *
   * @param id - id вопроса.
   */
  private scrollToTicket(id: number): void {
    setTimeout(() => {
      const el = document.getElementById(`${id}`);

      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
}
