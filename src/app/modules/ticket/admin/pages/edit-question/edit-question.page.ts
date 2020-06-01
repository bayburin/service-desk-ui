import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { of } from 'rxjs';
import { finalize, tap, switchMap } from 'rxjs/operators';

import { QuestionService } from '@shared/services/question/question.service';
import { ServiceService } from '@shared/services/service/service.service';
import { Service } from '@modules/ticket/models/service/service.model';
import { Question } from '@modules/ticket/models/question/question.model';
import { NotificationService } from '@shared/services/notification/notification.service';
import { ResponsibleUserService } from '@shared/services/responsible_user/responsible-user.service';

@Component({
  selector: 'app-edit-question-page',
  templateUrl: './edit-question.page.html',
  styleUrls: ['./edit-question.page.sass'],
})
export class EditQuestionPageComponent implements OnInit {
  submitted = false;
  service: Service;
  question: Question;
  questionForm: FormGroup;
  loading = false;
  @ViewChild('content', { static: true }) content: ElementRef;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private serviceService: ServiceService,
    private questionService: QuestionService,
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
    this.questionService.updateQuestion(this.question, this.questionForm.getRawValue())
      .pipe(
        finalize(() => this.loading = false),
        tap(() => {
          this.redirectToService();
          this.notifyService.setMessage('Вопрос обновлен');
        }),
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
