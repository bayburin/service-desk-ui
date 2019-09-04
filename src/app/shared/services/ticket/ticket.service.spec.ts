import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpParams } from '@angular/common/http';

import { environment } from 'environments/environment';
import { TicketService } from './ticket.service';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { TicketI } from '@interfaces/ticket.interface';
import { AnswerAttachmentI } from '@interfaces/answer_attachment.interface';
import { TicketFactory } from '@modules/ticket/factories/ticket.factory';
import { TagI } from '@interfaces/tag.interface';

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

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(ticketService).toBeTruthy();
  });

  describe('#raiseRating', () => {
    const ticket = new Ticket({ id: 1, serviceId: 2, popularity: 1, ticket_type: 'question' });
    const raiseRatingUrl = `${environment.serverUrl}/api/v1/services/${ticket.serviceId}/tickets/${ticket.id}`;
    const expectedTicket: TicketI = { id: 1, popularity: 2 } as TicketI;

    it('should return Observable with ticket data', () => {
      ticketService.raiseRating(ticket).subscribe(data => {
        expect(data).toEqual(expectedTicket);
      });

      httpTestingController.expectOne({
        method: 'GET',
        url: raiseRatingUrl
      }).flush(expectedTicket);
    });
  });

  describe('#downloadAttachmentFromAnswer', () => {
    const attachment = { id: 1, answer_id: 2 } as AnswerAttachmentI;
    const downloadAttachmentUrl = `${environment.serverUrl}/api/v1/answers/${attachment.answer_id}/attachments/${attachment.id}`;
    const expectedAttachment = new Blob(['test'], { type: 'application/json' });

    it('should return Observable with blob data', () => {
      ticketService.downloadAttachmentFromAnswer(attachment).subscribe(data => {
        expect(data).toEqual(expectedAttachment);
      });

      httpTestingController.expectOne({
        method: 'GET',
        url: downloadAttachmentUrl
      }).flush(expectedAttachment);
    });
  });

  describe('#createTicket', () => {
    const ticketI = { name: 'ТЕстовый вопрос', service_id: 1, ticket_type: 'question' } as TicketI;
    const ticketUri = `${environment.serverUrl}/api/v1/services/${ticketI.service_id}/tickets`;
    const expectedTicket = TicketFactory.create(ticketI);

    it('should return Observable with created Ticket', () => {
      ticketService.createTicket(ticketI as TicketI).subscribe(result => {
        expect(result).toEqual(expectedTicket);
      });

      httpTestingController.expectOne({
        method: 'POST',
        url: ticketUri
      }).flush(ticketI);
    });
  });

  describe('#loadTags', () => {
    const tagUri = `${environment.serverUrl}/api/v1/tags`;
    const tags: TagI[] = [
      { id: 1, name: 'tag 1' },
      { id: 2, name: 'tag 2' }
    ];
    const term = 'term';
    const searchParams = new HttpParams().set('search', term);

    it('should return Observable with finded tags', () => {
      ticketService.loadTags(term).subscribe(result => {
        expect(result).toEqual(tags);
      });

      httpTestingController.expectOne({
        method: 'GET',
        url: `${tagUri}?${searchParams}`
      }).flush(tags);
    });
  });
});
