import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { toggleAnswer } from '@modules/ticket/animations/toggle-answer.animation';
import { Question } from '@modules/ticket/models/question/question.model';
import { Answer } from '@modules/ticket/models/answer/answer.model';
import { ServiceService } from '@shared/services/service/service.service';
import { QuestionService } from '@shared/services/question/question.service';
import { NotificationService } from '@shared/services/notification/notification.service';
import { TagI } from '@interfaces/tag.interface';
import { ResponsibleUserService } from '@shared/services/responsible_user/responsible-user.service';
import { tap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.sass'],
  animations: [toggleAnswer]
})
export class QuestionComponent implements OnInit {
  @Input() question: Question;
  open: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private serviceService: ServiceService,
    private questionService: QuestionService,
    private notifyService: NotificationService,
    private responsibleUserService: ResponsibleUserService
  ) {}

  ngOnInit() {
    if (this.question.correction) {
      this.showCorrection();
    }
  }

  /**
   * "Раскрывает" вопрос.
   */
  toggleQuestion(): void {
    this.question.open = !this.question.open;
  }

  trackByTag(index, tag: TagI) {
    return tag.id;
  }

  trackByAnswer(index, answer: Answer) {
    return answer.id;
  }

  /**
   * Перейти по адресу редактирования вопроса.
   */
  editQuestion(): void {
    this.router.navigate([this.question.id, 'edit'], { relativeTo: this.route });
  }

  /**
   * Показать исправления.
   */
  showCorrection(): void {
    if (!this.question.correction) {
      return;
    }

    this.open = this.question.open;
    this.question = this.question.correction;
    this.question.open = this.open;
  }

  /**
   * Показать оригинал.
   */
  showOriginal(): void {
    if (!this.question.original) {
      return;
    }

    this.open = this.question.open;
    this.question = this.question.original;
    this.question.open = this.open;
  }

  /**
   * Опубликовать вопрос.
   */
  publishQuestion(): void {
    if (!confirm('Вы действительно хотите опубликовать вопрос?')) {
      return;
    }

    const id = this.question.correction ? this.question.correction.id : this.question.id;

    this.questionService.publishQuestions([id])
      .pipe(
        tap((questions: Question[]) => {
          if (questions.length === 0) {
            return;
          }

          this.serviceService.replaceQuestion((this.question.original || this.question).id, questions[0]);
          this.notifyService.setMessage('Вопрос опубликован');
        }),
        switchMap((tickets: Question[]) => {
          const tns = tickets.flatMap(ticket => ticket.getResponsibleUsersTn());

          return this.responsibleUserService.loadDetails(tns)
            .pipe(tap(details => tickets.forEach(ticket => ticket.associateResponsibleUserDetails(details))));
        })
    )
    .subscribe();
  }

  /**
   * Удалить опубликованный вопрос.
   */
  destroyPublishedQuestion(): void {
    if (!confirm('Вы действительно хотите удалить вопрос?')) {
      return;
    }

    this.questionService.destroyQuestion(this.question).subscribe(() => {
      this.notifyService.setMessage('Вопрос удален');
      this.serviceService.removeQuestions([this.question]);
    });
  }

  /**
   * Удалить черновой вопрос.
   */
  destroyDraftQuestion(): void {
    if (!confirm('Вы действительно хотите удалить черновик?')) {
      return;
    }

    this.questionService.destroyQuestion(this.question).subscribe(() => {
      this.notifyService.setMessage('Черновик удален');

      if (this.question.original) {
        this.showOriginal();
        this.question.correction = null;
      } else {
        this.serviceService.removeQuestions([this.question]);
      }
    });
  }
}
