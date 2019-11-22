import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { NewTicketComponent } from './new-ticket.component';
import { ServiceService } from '@shared/services/service/service.service';
import { StubTicketService } from '@shared/services/ticket/ticket.service.stub';
import { TicketService } from '@shared/services/ticket/ticket.service';
import { StubServiceService } from '@shared/services/service/service.service.stub';
import { Service } from '@modules/ticket/models/service/service.model';
import { ServiceI } from '@interfaces/service.interface';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';
import { NotificationService } from '@shared/services/notification/notification.service';
import { StubNotificationService } from '@shared/services/notification/notification.service.stub';
import { TicketFactory } from '@modules/ticket/factories/ticket.factory';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { TicketI } from '@interfaces/ticket.interface';
import { ResponsibleUserService } from '@shared/services/responsible_user/responsible-user.service';
import { StubResponsibleUserService } from '@shared/services/responsible_user/responsible-user.service.stub';

describe('NewTicketComponent', () => {
  let component: NewTicketComponent;
  let fixture: ComponentFixture<NewTicketComponent>;
  let modalService: NgbModal;
  let serviceI: ServiceI;
  let service: Service;
  let serviceService: ServiceService;
  let notifyService: NotificationService;
  let responsibleUserService: ResponsibleUserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NgbModule,
        ReactiveFormsModule,
      ],
      declarations: [NewTicketComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        NgbModal,
        { provide: ServiceService, useClass: StubServiceService },
        { provide: TicketService, useClass: StubTicketService },
        { provide: NotificationService, useClass: StubNotificationService },
        { provide: ResponsibleUserService, useClass: StubResponsibleUserService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTicketComponent);
    component = fixture.componentInstance;
    modalService = TestBed.get(NgbModal);
    serviceService = TestBed.get(ServiceService);
    notifyService = TestBed.get(NotificationService);
    responsibleUserService = TestBed.get(ResponsibleUserService);

    serviceI = {
      id: 1,
      category_id: 2,
      name: 'Тестовая услуга',
      is_hidden: false
    } as ServiceI;
    service = ServiceFactory.create(serviceI);

    serviceService.service = service;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should set service data in "service" attribute', () => {
    fixture.detectChanges();

    expect(component.service).toEqual(service);
  });

  it('should call "open" method for modalService', () => {
    spyOn(modalService, 'open');

    fixture.detectChanges();
    expect(modalService.open).toHaveBeenCalled();
  });

  describe('#save', () => {
    let ticketService: TicketService;

    beforeEach(() => {
      ticketService = TestBed.get(TicketService);
    });

    describe('when form is invalid', () => {
      it('should not save ticket', () => {
        spyOn(ticketService, 'createTicket');
        fixture.detectChanges();
        component.save();

        expect(ticketService.createTicket).not.toHaveBeenCalled();
      });
    });

    describe('when form valid', () => {
      let ticketI: TicketI;
      let ticket: Ticket;

      beforeEach(() => {
        ticketI = {
          id: 1,
          ticket_type: 'question',
          name: 'Тестовый вопрос'
        } as TicketI;
        ticket = TicketFactory.create(ticketI);
        fixture.detectChanges();
        component.ticketForm.controls.name.setValue('Тестовый вопрос');
        spyOn(ticketService, 'createTicket').and.returnValue(of(ticket));
        spyOn(responsibleUserService, 'loadDetails').and.returnValue(of(null));
        spyOn(responsibleUserService, 'associateDetailsFor');
      });

      it('should call "createTicket" method from TicketService with ticket params', () => {
        component.save();

        expect(ticketService.createTicket).toHaveBeenCalledWith(component.ticketForm.getRawValue());
      });

      it('should close modal', () => {
        spyOn(component.modal, 'close');
        component.save();

        expect(component.modal.close).toHaveBeenCalled();
      });

      it('should redirect to parent page', inject([Router], (router: Router) => {
        const spy = spyOn(router, 'navigate');
        component.save();

        expect(spy.calls.first().args[0]).toEqual(['../']);
      }));

      it('should add ticket to "tickets" array', () => {
        spyOn(serviceService, 'addTickets');
        component.save();

        expect(serviceService.addTickets).toHaveBeenCalledWith([ticket]);
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
    });
  });

  describe('#cancel', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should close modal', () => {
      spyOn(component.modal, 'dismiss');
      component.cancel();

      expect(component.modal.dismiss).toHaveBeenCalled();
    });

    it('should redirect to parent component', inject([Router], (router: Router) => {
      const spy = spyOn(router, 'navigate');
      spyOn(component.modal, 'dismiss');
      component.cancel();

      expect(spy.calls.first().args[0]).toEqual(['../']);
    }));
  });
});
