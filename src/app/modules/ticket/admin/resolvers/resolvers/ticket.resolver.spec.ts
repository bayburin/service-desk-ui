import { StubTicketService } from '@shared/services/ticket/ticket.service.stub';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { of } from 'rxjs';

import { TicketResolver } from './ticket.resolver';
import { TicketService } from '@shared/services/ticket/ticket.service';
import { TicketFactory } from '@modules/ticket/factories/tickets/ticket.factory';
import { Ticket, TicketTypes } from '@modules/ticket/models/ticket/ticket.model';

describe('TicketResolver', () => {
  let ticketResolver: TicketResolver;
  let ticketService: TicketService;
  let ticket: Ticket;
  let stubSnapshot: ActivatedRouteSnapshot;
  let stubSnapshotProxy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: TicketService, useClass: StubTicketService },
        TicketResolver
      ]
    });

    ticketResolver = TestBed.get(TicketResolver);
    ticketService = TestBed.get(TicketService);
    ticket = TicketFactory.create(TicketTypes.QUESTION, { id: 1, service_id: 2, name: 'Тестовый вопрос', ticket_type: 'question' });

    stubSnapshot = jasmine.createSpyObj<ActivatedRouteSnapshot>('ActivatedRouteSnapshot', ['parent', 'params']);
    stubSnapshotProxy = new Proxy(stubSnapshot, {
      get(target, prop) {
        if (prop === 'parent') {
          return { parent: { parent: { params: ticket.serviceId } } };
        } else if (prop === 'params') {
          return { id: ticket.id };
        }
      }
    });
  });

  it('should return Observable with loaded Ticket', () => {
    spyOn(ticketService, 'loadTicket').and.returnValue(of(ticket));

    ticketResolver.resolve(stubSnapshotProxy).subscribe(result => {
      expect(result).toEqual(ticket);
    });
  });
});
