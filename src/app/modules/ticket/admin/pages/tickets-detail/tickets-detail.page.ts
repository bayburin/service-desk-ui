import { Component, OnInit, OnDestroy, ViewChild, AfterViewChecked } from '@angular/core';
import { finalize, tap, switchMap, filter, delay, map, takeWhile, first } from 'rxjs/operators';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { Subscription, Subject, zip } from 'rxjs';

import { QuestionService } from '@shared/services/question/question.service';
import { ServiceService } from '@shared/services/service/service.service';
import { Service } from '@modules/ticket/models/service/service.model';
import { contentBlockAnimation } from '@animations/content.animation';
import { ResponsibleUserService } from '@shared/services/responsible_user/responsible-user.service';
import { ServiceDetailComponent } from '@modules/ticket/admin/components/service-detail/service-detail.component';
import { QuestionComponent } from '../../components/question/question.component';
import { TicketService, TicketDataI } from '@shared/services/ticket/ticket.service';

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
  private loadedDraft = new Subject();
  private openedQuestion = new Subject();
  private ticketId: number;
  private questionClosed = true;

  constructor(
    private serviceService: ServiceService,
    private questionService: QuestionService,
    private router: Router,
    private route: ActivatedRoute,
    private responsibleUserService: ResponsibleUserService,
    private ticketService: TicketService
  ) { }

  ngOnInit() {
    this.service = this.serviceService.service;
    this.ticketId = this.route.snapshot.queryParams.ticket;
    this.loadDraftTickets();
    this.openQuestionStream();
    this.routeSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart && !event.url.includes('/admin')) {
        this.serviceService.removeQuestions(this.questionService.draftQuestions);
      }
    });

    if (this.ticketId) {
      this.subscribeToOpenQuestion();
    }
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

    this.ticketService.loadDraftTickets(this.service)
      .pipe(
        finalize(() => this.loading = false),
        tap((data: TicketDataI) => {
          this.serviceService.removeDraftTickets();
          this.serviceService.addTickets(data);
          this.questionService.addDraftQuestions(data.questions);
          this.loadedDraft.next(true);
        }),
        switchMap(data => {
          const questionTns = data.questions.flatMap(question => question.getResponsibleUsersTn());
          // const caseTns = data.cases.flatMap(app => app.getResponsibleUsersTn());
          const caseTns = [];
          const tns = [...questionTns, ...caseTns];

          return this.responsibleUserService.loadDetails(tns)
            .pipe(tap(details => {
              data.questions.forEach(question => question.associateResponsibleUserDetails(details));
              // data.cases.forEach(app => app.associateResponsibleUserDetails(details));
            }));
        })
      )
      .subscribe();

    // this.questionService.loadDraftQuestionsFor(this.service)
    //   .pipe(
    //     finalize(() => this.loading = false),
    //     tap((tickets: Question[]) => {
    //       this.serviceService.removeDraftTickets();
    //       this.serviceService.addTickets(tickets);
    //       this.loadedDraft.next(true);
    //     }),
    //     switchMap(tickets => {
    //       const tns = tickets.flatMap(ticket => ticket.getResponsibleUsersTn());

    //       return this.responsibleUserService.loadDetails(tns)
    //         .pipe(tap(details => tickets.forEach(ticket => ticket.associateResponsibleUserDetails(details))));
    //     })
    //   )
    //   .subscribe();
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
   * Вызывает метод toggleQuestion() у компонента для раскрытия вопроса.
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

    this.openedQuestion.next(questionComponent);
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

  /**
   * Открывает подписку на "раскрытие" вопроса.
   */
  private subscribeToOpenQuestion() {
    zip(
      this.loadedDraft,
      this.openedQuestion
    )
    .pipe(first())
    .subscribe((arr: [boolean, QuestionComponent]) => {
      const loadedDraft = arr[0];
      const questionComponent = arr[1];

      if (loadedDraft) {
        this.scrollToTicket(questionComponent.question.originalId || questionComponent.question.id);
      }
    });
  }
}
