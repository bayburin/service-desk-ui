import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { environment } from 'environments/environment';
import { TicketService } from './ticket.service';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { TicketI } from '@interfaces/ticket.interface';
import { AnswerAttachmentI } from '@interfaces/answer_attachment.interface';

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
});
