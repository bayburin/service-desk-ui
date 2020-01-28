import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpParams } from '@angular/common/http';

import { environment } from 'environments/environment';
import { TicketService } from './ticket.service';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { TicketI } from '@interfaces/ticket.interface';
import { TicketFactory } from '@modules/ticket/factories/ticket.factory';
import { TagI } from '@interfaces/tag.interface';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';
import { ResponsibleUserI } from '@interfaces/responsible-user.interface';

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

  describe('#loadDraftTicketsFor', () => {
    const service = ServiceFactory.create({ id: 1, name: 'Тестовая услуга' });
    const loadedTicket = { id: 1, name: 'Вопрос 1', ticket_type: 'question' } as TicketI;
    const expectedTicket = TicketFactory.create(loadedTicket);
    const loadDraftTicketsForUrl = `${environment.serverUrl}/api/v1/services/${service.id}/tickets`;
    const httpParams = new HttpParams().set('state', 'draft');

    it('should return Observable with tickets array', () => {
      ticketService.loadDraftTicketsFor(service).subscribe(data => {
        expect(data).toEqual([expectedTicket]);
      });

      httpTestingController.expectOne({
        method: 'GET',
        url: `${loadDraftTicketsForUrl}?${httpParams}`
      }).flush([loadedTicket]);
    });

    it('should save loaded data into "draftTickets" attribute', () => {
      ticketService.loadDraftTicketsFor(service).subscribe(() => {
        expect(ticketService.draftTickets).toEqual([expectedTicket]);
      });

      httpTestingController.expectOne({
        method: 'GET',
        url: `${loadDraftTicketsForUrl}?${httpParams}`
      }).flush([loadedTicket]);
    });
  });

  describe('#addDraftTickets', () => {
    let tickets: Ticket[];

    beforeEach(() => {
      tickets = [
        TicketFactory.create({ id: 1, name: 'Ticket 1', ticket_type: 'question' }),
        TicketFactory.create({ id: 1, name: 'Ticket 1', ticket_type: 'question' })
      ];
    });

    it('should add ticket to "draftTickets" array', () => {
      ticketService.addDraftTickets(tickets);

      expect(ticketService.draftTickets.length).toEqual(2);
    });
  });

  describe('#raiseRating', () => {
    const ticket = new Ticket({ id: 1, serviceId: 2, popularity: 1, ticket_type: 'question' });
    const raiseRatingUrl = `${environment.serverUrl}/api/v1/services/${ticket.serviceId}/tickets/${ticket.id}/raise_rating`;
    const expectedTicket: TicketI = { id: 1, popularity: 2 } as TicketI;

    it('should return Observable with ticket data', () => {
      ticketService.raiseRating(ticket).subscribe(data => {
        expect(data).toEqual(expectedTicket);
      });

      httpTestingController.expectOne({
        method: 'POST',
        url: raiseRatingUrl
      }).flush(expectedTicket);
    });
  });

  describe('#createTicket', () => {
    const ticketI = { name: 'Тестовый вопрос', service_id: 1, ticket_type: 'question' } as TicketI;
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

  describe('#loadTicket', () => {
    const ticketI = { id: 2, name: 'Тестовый вопрос', service_id: 1, ticket_type: 'question' } as TicketI;
    const ticketUri = `${environment.serverUrl}/api/v1/services/${ticketI.service_id}/tickets/${ticketI.id}`;
    const expectedTicket = TicketFactory.create(ticketI);

    it('should return Observable with Ticket', () => {
      ticketService.loadTicket(ticketI.service_id, ticketI.id).subscribe(result => {
        expect(result).toEqual(expectedTicket);
      });

      httpTestingController.expectOne({
        method: 'GET',
        url: ticketUri
      }).flush(ticketI);
    });
  });

  describe('#updateTicket', () => {
    let responsibleUsers: ResponsibleUserI[];
    let ticketI: TicketI;
    let ticket: Ticket;
    let data: any;
    let ticketUri: string;

    beforeEach(() => {
      data = { responsible_users: [], ...ticketI };
      responsibleUsers = [{ id: 1, tn: 123 } as ResponsibleUserI];
      ticketI = { id: 2, name: 'Тестовый вопрос', service_id: 1, ticket_type: 'question' } as TicketI;
      ticket = TicketFactory.create(ticketI);
      ticketUri = `${environment.serverUrl}/api/v1/services/${ticketI.service_id}/tickets/${ticketI.id}`;
    });

    it('should set "_destory" flag on removed element of "responsible_users" array', () => {
      ticket.responsibleUsers = responsibleUsers;
      ticketService.updateTicket(ticket, data).subscribe(() => {
        expect(responsibleUsers[0]._destroy).toBeTruthy();
        expect(data.responsible_users).toContain(responsibleUsers[0]);
      });

      httpTestingController.expectOne({
        method: 'PUT',
        url: ticketUri
      }).flush(ticketI);
    });

    it('should return Observable with Ticket', () => {
      ticketService.updateTicket(ticket, data).subscribe(result => {
        expect(result).toEqual(ticket);
      });

      httpTestingController.expectOne({
        method: 'PUT',
        url: ticketUri
      }).flush(ticketI);
    });
  });

  describe('#publishTickets', () => {
    const ticketUri = `${environment.serverUrl}/api/v1/tickets/publish`;
    const correction = { id: 3, name: 'Тестовый вопрос 3', ticket_type: 'question' };
    const ticketsI = [
      { id: 1, service_id: 2, name: 'Тестовый вопрос 1', ticket_type: 'question', correction },
      { id: 2, service_id: 2, name: 'Тестовый вопрос 2', ticket_type: 'question' }
    ];
    const tickets = ticketsI.map(ticketI => TicketFactory.create(ticketI));
    const httpParams = new HttpParams().append('ids', `${ticketsI.map(t => t.correction ? t.correction.id : t.id)}`);

    it('should return Observable with Ticket array', () => {
      ticketService.publishTickets(tickets).subscribe(result => {
        expect(result).toEqual(tickets);
      });

      httpTestingController.expectOne({
        method: 'POST',
        url: `${ticketUri}?${httpParams}`
      }).flush(ticketsI);
    });
  });

  describe('#removeDraftTicket', () => {
    let selectedTicket: Ticket;

    beforeEach(() => {
      const ticketsI = [
        { id: 1, service_id: 2, name: 'Тестовый вопрос 1', ticket_type: 'question' },
        { id: 2, service_id: 2, name: 'Тестовый вопрос 2', ticket_type: 'question' }
      ];
      ticketService.draftTickets = ticketsI.map(ticketI => TicketFactory.create(ticketI));
      selectedTicket = ticketService.draftTickets[0];
    });

    it('should remove ticket from "draftTickets" array', () => {
      ticketService.removeDraftTicket(selectedTicket);

      expect(ticketService.draftTickets.find(el => el === selectedTicket)).toBeFalsy();
    });
  });

  describe('#destroyTicket', () => {
    let ticketI: TicketI;
    let ticket: Ticket;
    let ticketUri: string;

    beforeEach(() => {
      ticketI = { id: 2, name: 'Тестовый вопрос', service_id: 1, ticket_type: 'question' } as TicketI;
      ticket = TicketFactory.create(ticketI);
      ticketUri = `${environment.serverUrl}/api/v1/services/${ticketI.service_id}/tickets/${ticketI.id}`;
    });

    it('should return Observable with removed ticket', () => {
      ticketService.destroyTicket(ticket).subscribe(result => {
        expect(result).toEqual(ticket);
      });

      httpTestingController.expectOne({
        method: 'DELETE',
        url: ticketUri
      }).flush(ticket);
    });
  });
});
