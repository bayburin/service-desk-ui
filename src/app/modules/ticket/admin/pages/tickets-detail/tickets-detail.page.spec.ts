import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketsDetailPageComponent } from './tickets-detail.page';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { ServiceService } from '@shared/services/service/service.service';
import { TicketService } from '@shared/services/ticket/ticket.service';
import { StubTicketService } from '@shared/services/ticket/ticket.service.stub';
import { Ticket, TicketTypes } from '@modules/ticket/models/ticket/ticket.model';
import { Service } from '@modules/ticket/models/service/service.model';
import { TicketFactory } from '@modules/ticket/factories/tickets/ticket.factory';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';
import { StubServiceService } from '@shared/services/service/service.service.stub';
import { ResponsibleUserService } from '@shared/services/responsible_user/responsible-user.service';
import { StubResponsibleUserService } from '@shared/services/responsible_user/responsible-user.service.stub';
import { ResponsibleUserDetailsI } from '@interfaces/responsible_user_details.interface';

describe('TicketsDetailPageComponent', () => {
  let component: TicketsDetailPageComponent;
  let fixture: ComponentFixture<TicketsDetailPageComponent>;
  let ticketService: TicketService;
  let serviceService: ServiceService;
  let tickets: Ticket[];
  let service: Service;
  let responsibleUserService: ResponsibleUserService;
  let details: ResponsibleUserDetailsI[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule],
      declarations: [TicketsDetailPageComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ServiceService, useClass: StubServiceService },
        { provide: TicketService, useClass: StubTicketService },
        { provide: ResponsibleUserService, useClass: StubResponsibleUserService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsDetailPageComponent);
    component = fixture.componentInstance;
    ticketService = TestBed.get(TicketService);
    serviceService = TestBed.get(ServiceService);
    responsibleUserService = TestBed.get(ResponsibleUserService);
    details = [{ tn: 123, full_name: 'ФИО' } as ResponsibleUserDetailsI];
    tickets = [
      TicketFactory.create(TicketTypes.QUESTION, { id: 2, name: 'Вопрос 2', ticket_type: 'question' }),
      TicketFactory.create(TicketTypes.QUESTION, { id: 3, name: 'Вопрос 3', ticket_type: 'question' })
    ];
    service = ServiceFactory.create({
      id: 1,
      categoryId: 2,
      name: 'Тестовая услуга',
      tickets: [{ id: 1, name: 'Вопрос 1', ticket_type: 'question' }]
    });
    serviceService.service = service;

    spyOn(ticketService, 'loadDraftTicketsFor').and.returnValue(of(tickets));
    spyOn(serviceService, 'addTickets');
    spyOn(responsibleUserService, 'loadDetails').and.returnValues(of(details));
    // spyOn();
    tickets.forEach(ticket => spyOn(ticket, 'associateResponsibleUserDetails'));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should loads tickets with draft state from server', () => {
    expect(ticketService.loadDraftTicketsFor).toHaveBeenCalledWith(component.service);
  });

  it('should call "loadDetails" method of responsibleUserService service', () => {
    expect(responsibleUserService.loadDetails).toHaveBeenCalled();
  });

  it('should call "associateResponsibleUserDetails" method for created ticket with occured details', () => {
    tickets.forEach(ticket => {
      expect(ticket.associateResponsibleUserDetails).toHaveBeenCalledWith(details);
    });
  });

  it('should call "addTickets" method with received tickets', () => {
    expect(serviceService.addTickets).toHaveBeenCalledWith(tickets);
  });

  it('should call "removeTickets" method with draft tickets if user leaves the admin module', () => {
    spyOn(serviceService, 'removeTickets');
    (component as any).router.navigateByUrl('/');

    expect(serviceService.removeTickets).toHaveBeenCalledWith(ticketService.draftTickets);
  });
});
