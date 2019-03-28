import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { map, filter, switchMap, first } from 'rxjs/operators';

import { AnswerI } from '@models/answer.interface';
import { BreadcrumbServiceI } from '@models/breadcrumb-service.interface';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnswerService implements BreadcrumbServiceI {
  private loadAnswersUrl: string;
  private answers = new BehaviorSubject<AnswerI[]>([]);

  constructor(private http: HttpClient) { }

  loadAnswers(serviceId: number, id: number): Observable<AnswerI[]> {
    this.loadAnswersUrl = `${environment.serverUrl}/api/v1/services/${serviceId}/tickets/${id}`;

    return this.http.get<AnswerI[]>(this.loadAnswersUrl).pipe(map((answers: AnswerI[]) => {
      this.answers.next(answers);

      return answers;
    }));
  }

  getParentNodeName(highLevel: boolean = false): Observable<string> {
    return this.answers.asObservable().pipe(
      filter((arr) => arr.length !== 0),
      switchMap((arr) => {
        return from(arr).pipe(
          first(),
          map((answer: AnswerI) => highLevel ? answer.ticket.service.name : answer.ticket.name)
        );
      })
    );
  }

  getAnswers(): AnswerI[] {
    return this.answers.getValue();
  }
}
