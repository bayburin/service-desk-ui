import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpParams } from '@angular/common/http';

import { environment } from 'environments/environment';
import { QuestionTicketService } from './question-ticket.service';
import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';
import { TicketFactory } from '@modules/ticket/factories/tickets/ticket.factory';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';
import { ResponsibleUserI } from '@interfaces/responsible-user.interface';
import { QuestionTicketI } from '@interfaces/question-ticket.interface';
import { QuestionTicket } from '@modules/ticket/models/question-ticket/question-ticket.model';

describe('QuestionTicketService', () => {
  let httpTestingController: HttpTestingController;
  let questionTicketService: QuestionTicketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    questionTicketService = TestBed.get(QuestionTicketService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(questionTicketService).toBeTruthy();
  });

  describe('#loadDraftQuestionsFor', () => {
    const service = ServiceFactory.create({ id: 1, name: 'Тестовая услуга' });
    const loadedQuestion = { id: 1, ticket: { name: 'Вопрос 1' } } as QuestionTicketI;
    const expectedQuestion = TicketFactory.create(TicketTypes.QUESTION, loadedQuestion);
    const loadDraftQuestionsForUri = `${environment.serverUrl}/api/v1/services/${service.id}/question_tickets`;

    it('should return Observable with tickets array', () => {
      questionTicketService.loadDraftQuestionsFor(service).subscribe(data => {
        expect(data).toEqual([expectedQuestion]);
      });

      httpTestingController.expectOne({
        method: 'GET',
        url: loadDraftQuestionsForUri
      }).flush([loadedQuestion]);
    });

    it('should save loaded data into "draftQuestions" attribute', () => {
      questionTicketService.loadDraftQuestionsFor(service).subscribe(() => {
        expect(questionTicketService.draftQuestions).toEqual([expectedQuestion]);
      });

      httpTestingController.expectOne({
        method: 'GET',
        url: loadDraftQuestionsForUri
      }).flush([loadedQuestion]);
    });
  });

  describe('#addDraftQuestions', () => {
    let questions: QuestionTicket[];

    beforeEach(() => {
      questions = [
        TicketFactory.create(TicketTypes.QUESTION, { id: 1, ticket: { name: 'Ticket 1' } }),
        TicketFactory.create(TicketTypes.QUESTION, { id: 1, ticket: { name: 'Ticket 1' } })
      ];
    });

    it('should add ticket to "draftQuestions" array', () => {
      questionTicketService.addDraftQuestions(questions);

      expect(questionTicketService.draftQuestions.length).toEqual(2);
    });
  });

  describe('#raiseRating', () => {
    const question = TicketFactory.create(TicketTypes.QUESTION, { id: 1, ticket: { id: 2, service_id: 2, popularity: 1 } });
    const raiseRatingUri = `${environment.serverUrl}/api/v1/services/${question.serviceId}/question_tickets/${question.ticketId}/raise_rating`;
    const expectedQuestion: QuestionTicketI = { id: 1, ticket: { popularity: 2 } } as QuestionTicketI;

    it('should return Observable with ticket data', () => {
      questionTicketService.raiseRating(question).subscribe(data => {
        expect(data).toEqual(expectedQuestion);
      });

      httpTestingController.expectOne({
        method: 'POST',
        url: raiseRatingUri
      }).flush(expectedQuestion);
    });
  });

  describe('#createQuestion', () => {
    const questionI: QuestionTicketI = { ticket: { name: 'Тестовый вопрос', service_id: 1 } } as QuestionTicketI;
    const ticketUri = `${environment.serverUrl}/api/v1/services/${questionI.ticket.service_id}/question_tickets`;
    const expectedTicket = TicketFactory.create(TicketTypes.QUESTION, questionI);

    it('should return Observable with created Ticket', () => {
      questionTicketService.createQuestion(questionI).subscribe(result => {
        expect(result).toEqual(expectedTicket);
      });

      httpTestingController.expectOne({
        method: 'POST',
        url: ticketUri
      }).flush(questionI);
    });
  });

  describe('#loadQuestion', () => {
    const questionI = { id: 2, ticket: { name: 'Тестовый вопрос', service_id: 1 } } as QuestionTicketI;
    const questionUri = `${environment.serverUrl}/api/v1/services/${questionI.ticket.service_id}/question_tickets/${questionI.id}`;
    const expectedQuestion = TicketFactory.create(TicketTypes.QUESTION, questionI);

    it('should return Observable with Ticket', () => {
      questionTicketService.loadQuestion(questionI.ticket.service_id, questionI.id).subscribe(result => {
        expect(result).toEqual(expectedQuestion);
      });

      httpTestingController.expectOne({
        method: 'GET',
        url: questionUri
      }).flush(questionI);
    });
  });

  describe('#updateTicket', () => {
    let responsibleUsers: ResponsibleUserI[];
    let questionI: QuestionTicketI;
    let question: QuestionTicket;
    let data: any = {};
    let ticketUri: string;

    beforeEach(() => {
      responsibleUsers = [{ id: 1, tn: 123 } as ResponsibleUserI];
      questionI = { id: 2, ticket: { name: 'Тестовый вопрос', service_id: 1, responsible_users: responsibleUsers } } as QuestionTicketI;
      Object.assign(data, questionI);
      data.ticket.responsible_users = [];
      question = TicketFactory.create(TicketTypes.QUESTION, questionI);
      ticketUri = `${environment.serverUrl}/api/v1/services/${questionI.ticket.service_id}/question_tickets/${questionI.id}`;
    });

    it('should set "_destory" flag on removed element of "responsible_users" array', () => {
      question.responsibleUsers = responsibleUsers;
      questionTicketService.updateQuestion(question, data).subscribe(() => {
        expect(responsibleUsers[0]._destroy).toBeTruthy();
        expect(data.ticket.responsible_users).toContain(responsibleUsers[0]);
      });

      httpTestingController.expectOne({
        method: 'PUT',
        url: ticketUri
      }).flush(questionI);
    });

    it('should return Observable with QuestionTicket', () => {
      questionTicketService.updateQuestion(question, data).subscribe(result => {
        expect(result).toEqual(question);
      });

      httpTestingController.expectOne({
        method: 'PUT',
        url: ticketUri
      }).flush(questionI);
    });
  });

  describe('#publishQuestions', () => {
    const questionUri = `${environment.serverUrl}/api/v1/question_tickets/publish`;
    const correction = { id: 3, ticket: { service_id: 2, name: 'Тестовый вопрос 3' } };
    const questionsI = [
      { id: 1, ticket: { service_id: 2, name: 'Тестовый вопрос 1', }, correction },
      { id: 2, ticket: { service_id: 2, name: 'Тестовый вопрос 2' } }
    ];
    const questions = questionsI.map(questionI => TicketFactory.create(TicketTypes.QUESTION, questionI));
    const ids = questionsI.map(t => t.correction ? t.correction.id : t.id);
    const httpParams = new HttpParams().append('ids', `${ids}`);

    it('should return Observable with Ticket array', () => {
      questionTicketService.publishQuestions(ids).subscribe(result => {
        expect(result).toEqual(questions);
      });

      httpTestingController.expectOne({
        method: 'POST',
        url: `${questionUri}?${httpParams}`
      }).flush(questionsI);
    });
  });

  describe('#removeDraftQuestion', () => {
    let selectedQuestion: QuestionTicket;

    beforeEach(() => {
      const questionsI = [
        { id: 1, ticket: { service_id: 2, name: 'Тестовый вопрос 1' } },
        { id: 2, ticket: { service_id: 2, name: 'Тестовый вопрос 2' } }
      ];
      questionTicketService.draftQuestions = questionsI.map(questionI => TicketFactory.create(TicketTypes.QUESTION, questionI));
      selectedQuestion = questionTicketService.draftQuestions[0];
    });

    it('should remove ticket from "draftQuestions" array', () => {
      questionTicketService.removeDraftQuestion(selectedQuestion);

      expect(questionTicketService.draftQuestions.find(el => el === selectedQuestion)).toBeFalsy();
    });
  });

  describe('#destroyQuestion', () => {
    let questionI: QuestionTicketI;
    let question: QuestionTicket;
    let questionUri: string;

    beforeEach(() => {
      questionI = { id: 2, ticket: { name: 'Тестовый вопрос', service_id: 1 } } as QuestionTicketI;
      question = TicketFactory.create(TicketTypes.QUESTION, questionI);
      questionUri = `${environment.serverUrl}/api/v1/services/${questionI.ticket.service_id}/question_tickets/${questionI.id}`;
    });

    it('should return Observable with removed ticket', () => {
      questionTicketService.destroyQuestion(question).subscribe(result => {
        expect(result).toEqual(question);
      });

      httpTestingController.expectOne({
        method: 'DELETE',
        url: questionUri
      }).flush(question);
    });
  });
});
