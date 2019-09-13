import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketsPageComponent } from './tickets.page';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ServiceService } from '@shared/services/service/service.service';
import { StubServicePolicy } from '@shared/policies/service/service.policy.stub';
import { TicketService } from '@shared/services/ticket/ticket.service';
import { StubTicketService } from '@shared/services/ticket/ticket.service.stub';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { Service } from '@modules/ticket/models/service/service.model';
import { TicketFactory } from '@modules/ticket/factories/ticket.factory';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';

describe('TicketsPageComponent', () => {
  let component: TicketsPageComponent;
  let fixture: ComponentFixture<TicketsPageComponent>;
  let ticketService: TicketService;
  let serviceService: ServiceService;
  let tickets: Ticket[];
  let service: Service;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [TicketsPageComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ServiceService, useClass: StubServicePolicy },
        { provide: TicketService, useClass: StubTicketService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsPageComponent);
    component = fixture.componentInstance;
    ticketService = TestBed.get(TicketService);
    serviceService = TestBed.get(ServiceService);
    tickets = [
      TicketFactory.create({ id: 2, name: 'Вопрос 2', ticket_type: 'question' }),
      TicketFactory.create({ id: 3, name: 'Вопрос 3', ticket_type: 'question' })
    ];
    service = ServiceFactory.create({
      id: 1,
      categoryId: 2,
      name: 'Тестовая услуга',
      tickets: [{ id: 1, name: 'Вопрос 1', ticket_type: 'question' }]
    });

    serviceService.service = service;

    spyOn(ticketService, 'loadDraftTicketsFor').and.returnValue(of(tickets));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should loads tickets with draft state from server', () => {
    expect(component.draftTickets).toEqual(tickets);
  });

  it ('should concat loaded tickets with current tickets', () => {
    expect(component.service.tickets.length).toEqual(3);
  });
});
