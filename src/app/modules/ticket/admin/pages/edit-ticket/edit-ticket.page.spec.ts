import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { EditTicketPageComponent } from './edit-ticket.page';
import { ServiceService } from '@shared/services/service/service.service';
import { StubTicketService } from '@shared/services/ticket/ticket.service.stub';
import { TicketService } from '@shared/services/ticket/ticket.service';
import { StubServiceService } from '@shared/services/service/service.service.stub';
import { Service } from '@modules/ticket/models/service/service.model';
import { ServiceI } from '@interfaces/service.interface';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';
import { NotificationService } from '@shared/services/notification/notification.service';
import { StubNotificationService } from '@shared/services/notification/notification.service.stub';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { TicketI } from '@interfaces/ticket.interface';
import { TicketFactory } from '@modules/ticket/factories/ticket.factory';
import { ResponsibleUserService } from '@shared/services/responsible_user/responsible-user.service';
import { StubResponsibleUserService } from '@shared/services/responsible_user/responsible-user.service.stub';
import { ResponsibleUserDetailsI } from '@interfaces/responsible_user_details.interface';

describe('EditTicketPageComponent', () => {
  let component: EditTicketPageComponent;
  let fixture: ComponentFixture<EditTicketPageComponent>;
  let ticketI: TicketI;
  let ticket: Ticket;
  let serviceI: ServiceI;
  let service: Service;
  let serviceService: ServiceService;
  let notifyService: NotificationService;
  let responsibleUserService: ResponsibleUserService;
  let details: ResponsibleUserDetailsI[];

  ticketI = {
    id: 1,
    service_id: 2,
    name: 'Тестовый вопрос',
    ticket_type: 'question',
    state: 'draft',
    is_hidden: false,
    responsible_users: [{ tn: 123 }]
  } as TicketI;
  ticket = TicketFactory.create(ticketI);
  const stubRoute = jasmine.createSpyObj<ActivatedRoute>('ActivatedRoute', ['snapshot', 'data']);
  const stubRouteProxy = new Proxy(stubRoute, {
    get(target, prop) {
      if (prop === 'data') {
        return of({ ticket: ticket });
      } else if (prop === 'snapshot') {
        return {};
      }
    }
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NgbModule,
        ReactiveFormsModule
      ],
      declarations: [EditTicketPageComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ServiceService, useClass: StubServiceService },
        { provide: TicketService, useClass: StubTicketService },
        { provide: NotificationService, useClass: StubNotificationService },
        { provide: ActivatedRoute, useValue: stubRouteProxy },
        { provide: ResponsibleUserService, useClass: StubResponsibleUserService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTicketPageComponent);
    component = fixture.componentInstance;
    serviceService = TestBed.get(ServiceService);
    notifyService = TestBed.get(NotificationService);
    responsibleUserService = TestBed.get(ResponsibleUserService);

    details = [{ tn: 123, full_name: 'ФИО' } as ResponsibleUserDetailsI];
    serviceI = {
      id: 1,
      category_id: 2,
      name: 'Тестовая услуга',
      is_hidden: false
    } as ServiceI;
    service = ServiceFactory.create(serviceI);
    service.tickets = [ticket];

    serviceService.service = service;
    spyOn(responsibleUserService, 'loadDetails').and.returnValue(of(details));
    spyOn(ticket, 'associateResponsibleUserDetails');
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should set service data in "service" attribute', () => {
    fixture.detectChanges();

    expect(component.service).toEqual(service);
  });

  describe('when responsibleUsers array is not empty', () => {
    it('should call "loadDetails" method of ResponsibleUserService service', () => {
      fixture.detectChanges();

      expect(responsibleUserService.loadDetails).toHaveBeenCalled();
    });

    it('should call "associateResponsibleUserDetails" method for loaded ticket with occured details', () => {
      fixture.detectChanges();

      expect(ticket.associateResponsibleUserDetails).toHaveBeenCalledWith(details);
    });
  });

  describe('#save', () => {
    let ticketService: TicketService;

    beforeEach(() => {
      ticketService = TestBed.get(TicketService);
    });

    describe('when form is invalid', () => {
      it('should not save ticket', () => {
        spyOn(ticketService, 'updateTicket');
        fixture.detectChanges();
        component.ticketForm.controls.name.setValue('');
        component.save();

        expect(ticketService.updateTicket).not.toHaveBeenCalled();
      });
    });

    describe('when form valid', () => {
      let newTicket: Ticket;

      beforeEach(() => {
        const newTicketI = {
          id: ticket.id,
          service_id: 2,
          name: 'Тестовый вопрос. Новая редакция',
          ticket_type: 'question',
          state: 'draft',
          is_hidden: false
        } as TicketI;
        newTicket = TicketFactory.create(newTicketI);
        fixture.detectChanges();
        component.ticketForm.controls.name.setValue('Тестовый вопрос');
        spyOn(ticketService, 'updateTicket').and.returnValue(of(newTicket));
        spyOn(newTicket, 'associateResponsibleUserDetails');
      });

      it('should call "updateTicket" method from TicketService with ticket params', () => {
        component.save();

        expect(ticketService.updateTicket).toHaveBeenCalledWith(component.ticket, component.ticketForm.getRawValue());
      });

      it('should redirect to parent page', inject([Router], (router: Router) => {
        const spy = spyOn(router, 'navigate');
        component.save();

        expect(spy.calls.first().args[0]).toEqual(['../../']);
      }));

      it('should replace ticket in "tickets" array', () => {
        spyOn(serviceService, 'replaceTicket');
        component.save();

        expect(serviceService.replaceTicket).toHaveBeenCalledWith(ticket.id, newTicket);
      });

      it('should notify user', () => {
        spyOn(notifyService, 'setMessage');
        component.save();

        expect(notifyService.setMessage).toHaveBeenCalled();
      });

      it('should call "loadDetails" method of responsibleUserService service', () => {
        component.save();

        expect(responsibleUserService.loadDetails).toHaveBeenCalled();
      });

      it('should call "associateResponsibleUserDetails" method for updated ticket with occured details', () => {
        component.save();

        expect(newTicket.associateResponsibleUserDetails).toHaveBeenCalledWith(details);
      });
    });
  });

  describe('#cancel', () => {
    beforeEach(() => fixture.detectChanges());

    it('should redirect to parent component', inject([Router], (router: Router) => {
      const spy = spyOn(router, 'navigate');
      component.cancel();

      expect(spy.calls.first().args[0]).toEqual(['../../']);
    }));
  });
});
