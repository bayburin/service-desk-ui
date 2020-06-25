import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { QuestionService } from '@shared/services/question/question.service';
import { Question } from '@modules/ticket/models/question/question.model';

@Injectable()
export class TicketResolver implements Resolve<Question> {
  constructor(private questionService: QuestionService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Question> {
    const id = route.params.id;
    const serviceId = route.parent.parent.parent.params.id;

    return this.questionService.loadQuestion(serviceId, id);
  }
}
