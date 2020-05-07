import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { of } from 'rxjs';
import { finalize, tap, switchMap } from 'rxjs/operators';

import { TicketService } from '@shared/services/ticket/ticket.service';
import { ServiceService } from '@shared/services/service/service.service';
import { Service } from '@modules/ticket/models/service/service.model';
import { QuestionTicket } from '@modules/ticket/models/question_ticket/question_ticket.model';
import { NotificationService } from '@shared/services/notification/notification.service';
import { ResponsibleUserService } from '@shared/services/responsible_user/responsible-user.service';

@Component({
  selector: 'app-edit-ticket-page',
  templateUrl: './edit-ticket.page.html',
  styleUrls: ['./edit-ticket.page.sass'],
})
export class EditTicketPageComponent implements OnInit {
  submitted = false;
  service: Service;
  question: QuestionTicket;
  questionForm: FormGroup;
  loading = false;
  @ViewChild('content', { static: true }) content: ElementRef;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private serviceService: ServiceService,
    private ticketService: TicketService,
    private notifyService: NotificationService,
    private responsibleUserService: ResponsibleUserService
  ) { }

  ngOnInit() {
    this.service = this.serviceService.service;
    this.route.data
      .pipe(
        tap(data => this.question = data.question),
        switchMap(() => {
          if (this.question.responsibleUsers.length) {
            return this.responsibleUserService.loadDetails(this.question.getResponsibleUsersTn());
          } else {
            return of([]);
          }
        }),
        tap(details => this.question.associateResponsibleUserDetails(details)),
      )
      .subscribe(() => this.buildForm());
  }

  /**
   * Сохраняет вопрос.
   */
  save(): void {
    this.submitted = true;
    if (this.questionForm.invalid) {
      return;
    }

    this.loading = true;
    this.ticketService.updateQuestion(this.question, this.questionForm.getRawValue())
      .pipe(
        finalize(() => this.loading = false),
        tap((updatedTicket: QuestionTicket) => {
          this.redirectToService();
          this.serviceService.replaceTicket(this.question.id, updatedTicket);
          this.notifyService.setMessage('Вопрос обновлен');
        }),
        switchMap(updatedTicket => {
          return this.responsibleUserService.loadDetails(updatedTicket.getResponsibleUsersTn())
            .pipe(tap(details => updatedTicket.associateResponsibleUserDetails(details)));
        })
      )
      .subscribe(
        () => {},
        error => console.log(error)
      );
  }

  /**
   * Возвращается к маршруту на уровень выше.
   */
  cancel(): void {
    this.redirectToService();
  }

  private buildForm(): void {
    this.questionForm = this.formBuilder.group({
      ticket: this.formBuilder.group({
        id: [this.question.ticketId],
        service_id: [this.question.serviceId],
        name: [this.question.name, [Validators.required, Validators.maxLength(255)]],
        is_hidden: [this.question.isHidden],
        sla: [this.question.sla],
        popularity: [this.question.popularity],
        tags: [this.question.tags],
        responsible_users: [this.question.responsibleUsers]
      }),
      answers: this.formBuilder.array([]),
    });
  }

  private redirectToService(): void {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }
}
