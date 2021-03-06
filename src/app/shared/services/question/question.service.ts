import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';
import { environment } from 'environments/environment';
import { TicketFactory } from '@modules/ticket/factories/tickets/ticket.factory';
import { Service } from '@modules/ticket/models/service/service.model';
import { ResponsibleUserI } from '@interfaces/responsible-user.interface';
import { QuestionI } from '@interfaces/question.interface';
import { Question } from '@modules/ticket/models/question/question.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  draftQuestions: Question[] = [];

  constructor(private http: HttpClient) {}

  /**
   * Загружает список черновых вопросов для указанной услуги.
   *
   * @param service - услуга.
   */
  loadDraftQuestionsFor(service: Service): Observable<Question[]> {
    const questionsUri = this.apiBaseUri(service.id);

    return this.http.get(questionsUri)
      .pipe(
        map((questions: QuestionI[]) => questions.map(question => TicketFactory.create(TicketTypes.QUESTION, question))),
        tap(questions => this.draftQuestions = questions)
      );
  }

  /**
   * Добавляет вопросы к списку черновых.
   *
   * @param questions - список вопросов
   */
  addDraftQuestions(questions: Question[]): void {
    this.draftQuestions.push(...questions);
  }

  /**
   * Отправляет запрос на сервер на изменение рейтинга указанного вопроса.
   *
   * @param question - вопрос, у которого необходимо поднять рейтинг
   */
  raiseRating(question: Question): Observable<QuestionI> {
    const raiseRatingUrl = `${this.apiBaseUri(question.serviceId)}/${question.ticketId}/raise_rating`;

    return this.http.post<QuestionI>(raiseRatingUrl, {});
  }

  /**
   * Создает вопрос.
   *
   * @param questionI - объект QuestionI
   */
  createQuestion(questionI: QuestionI): Observable<Question> {
    const questionUri = this.apiBaseUri(questionI.ticket.service_id);

    return this.http.post(questionUri, { question: questionI })
      .pipe(map((question: QuestionI) => TicketFactory.create(TicketTypes.QUESTION, question)));
  }

  /**
   * Загрузить вопрос.
   *
   * @param serviceId - id услуги.
   * @param questionId - id вопроса.
   */
  loadQuestion(serviceId: number, questionId: number): Observable<Question> {
    const questionUri = `${this.apiBaseUri(serviceId)}/${questionId}`;

    return this.http.get(questionUri).pipe(map((question: QuestionI) => TicketFactory.create(TicketTypes.QUESTION, question)));
  }

  /**
   * Обновить вопрос.
   *
   * @params question - объект Question
   * @params data - новые данные.
   */
  updateQuestion(question: Question, data: QuestionI): Observable<Question> {
    const questionUri = `${this.apiBaseUri(question.serviceId)}/${question.id}`;

    question.responsibleUsers.forEach(user => {
      if (!data.ticket.responsible_users.find((u: ResponsibleUserI) => u.id === user.id)) {
        user._destroy = true;
        data.ticket.responsible_users.push(user);
      }
    });

    return this.http.put(questionUri, { question: data })
      .pipe(map((questionI: QuestionI) => TicketFactory.create(TicketTypes.QUESTION, questionI)));
  }

  /**
   * Утвердить изменения в указанных вопросах.
   *
   * @param questionIds - список id вопросов для утверждения изменений.
   */
  publishQuestions(questionIds: number[]): Observable<Question[]> {
    const questionUri = `${environment.serverUrl}/api/v1/questions/publish`;
    const httpParams = new HttpParams().append('ids', `${[questionIds]}`);

    return this.http.post(questionUri, {}, { params: httpParams })
      .pipe(map((questionsI: QuestionI[]) => questionsI.map(question => TicketFactory.create(TicketTypes.QUESTION, question))));
  }

  /**
   * Удалить вопрос из списка черновых.
   *
   * @param question - удаляемый вопрос.
   */
  removeDraftQuestion(question: Question): void {
    const index = this.draftQuestions.findIndex(draft => draft.id === question.id);

    if (index !== -1) {
      this.draftQuestions.splice(index, 1);
    }
  }

  /**
   * Удалить вопрос.
   *
   * @param question - удаляемый вопрос.
   */
  destroyQuestion(question: Question): Observable<any> {
    const questionUri = `${this.apiBaseUri(question.serviceId)}/${question.id}`;

    return this.http.delete(questionUri);
  }

  private apiBaseUri(serviceId: number) {
    return `${environment.serverUrl}/api/v1/services/${serviceId}/questions`;
  }
}
