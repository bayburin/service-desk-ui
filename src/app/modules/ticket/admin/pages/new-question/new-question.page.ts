import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { QuestionService } from '@shared/services/question/question.service';
import { ServiceService } from '@shared/services/service/service.service';
import { Service } from '@modules/ticket/models/service/service.model';
import { NotificationService } from '@shared/services/notification/notification.service';

@Component({
  selector: 'app-new-question-page',
  templateUrl: './new-question.page.html',
  styleUrls: ['./new-question.page.sass']
})
export class NewQuestionPageComponent implements OnInit {
  submitted = false;
  service: Service;
  questionForm: FormGroup;
  loading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private serviceService: ServiceService,
    private questionService: QuestionService,
    private notifyService: NotificationService
  ) {}

  ngOnInit() {
    this.service = this.serviceService.service;
    this.buildForm();
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
    this.questionService.createQuestion(this.questionForm.getRawValue())
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        () => {
          this.redirectToService();
          this.notifyService.setMessage('Новый вопрос добавлен');
        },
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
        service_id: [this.service.id],
        name: ['', [Validators.required, Validators.maxLength(255)]],
        is_hidden: [false],
        sla: [null],
        popularity: [0],
        tags: [[]],
        responsible_users: [[]]
      }),
      answers: this.formBuilder.array([]),
    });
  }

  private redirectToService(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
