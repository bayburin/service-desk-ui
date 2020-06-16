import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from 'environments/environment';
import { TicketService, TicketDataI } from './ticket.service';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';
import { TicketFactory } from '@modules/ticket/factories/tickets/ticket.factory';
import { QuestionI } from '@interfaces/question.interface';

describe('TicketService', () => {
  let httpTestingController: HttpTestingController;
  let ticketService: TicketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    ticketService = TestBed.get(TicketService);
  });

  it('should be created', () => {
    expect(ticketService).toBeTruthy();
  });

  describe('#loadDraftTickets', () => {
    const service = ServiceFactory.create({ id: 1, name: 'Тестовая услуга' });
    const loadedQuestion = { id: 1, ticket: { name: 'Вопрос 1' } } as QuestionI;
    const expectedQuestion = TicketFactory.create(TicketTypes.QUESTION, loadedQuestion);
    const ticketData = {
      questions: [loadedQuestion],
      apps: []
    };
    const loadDraftTicketsUri = `${environment.serverUrl}/api/v1/services/${service.id}/tickets`;

    it('should return Observable with loaded data', () => {
      ticketService.loadDraftTickets(service).subscribe(data => {
        expect(data.questions).toEqual([expectedQuestion]);
      });

      httpTestingController.expectOne({
        method: 'GET',
        url: loadDraftTicketsUri
      }).flush(ticketData);
    });

    // it('should save loaded data into "draftQuestions" attribute', () => {
    //   ticketService.loadDraftTickets(service).subscribe(() => {
    //     expect(questionService.draftQuestions).toEqual([expectedQuestion]);
    //   });

    //   httpTestingController.expectOne({
    //     method: 'GET',
    //     url: loadDraftQuestionsForUri
    //   }).flush([loadedQuestion]);
    // });
  });
});
