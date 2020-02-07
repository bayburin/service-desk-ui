import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { NewTicketPageComponent } from './new-ticket.page';
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
import { ResponsibleUserDetailsI } from '@interfaces/responsible_user_details.interface';
import { By } from '@angular/platform-browser';

describe('NewTicketPageComponent', () => {
  let component: NewTicketPageComponent;
  let fixture: ComponentFixture<NewTicketPageComponent>;
  let serviceI: ServiceI;
  let service: Service;
  let serviceService: ServiceService;
  let notifyService: NotificationService;
  let responsibleUserService: ResponsibleUserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        RouterTestingModule,
        NgbModule,
        ReactiveFormsModule,
      ],
      declarations: [NewTicketPageComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ServiceService, useClass: StubServiceService },
        { provide: TicketService, useClass: StubTicketService },
        { provide: NotificationService, useClass: StubNotificationService },
        { provide: ResponsibleUserService, useClass: StubResponsibleUserService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTicketPageComponent);
    component = fixture.componentInstance;
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

  describe('#save', () => {
    let ticketService: TicketService;
    let details: ResponsibleUserDetailsI[];

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
        details = [{ tn: 123, full_name: 'ФИО' } as ResponsibleUserDetailsI];
        ticket = TicketFactory.create(ticketI);
        fixture.detectChanges();
        component.ticketForm.controls.name.setValue('Тестовый вопрос');
        spyOn(ticketService, 'createTicket').and.returnValue(of(ticket));
        spyOn(responsibleUserService, 'loadDetails').and.returnValue(of(details));
        spyOn(ticket, 'associateResponsibleUserDetails');
      });

      it('should call "createTicket" method from TicketService with ticket params', () => {
        component.save();

        expect(ticketService.createTicket).toHaveBeenCalledWith(component.ticketForm.getRawValue());
      });

      it('should redirect to parent page', inject([Router], (router: Router) => {
        const spy = spyOn(router, 'navigate');
        component.save();

        expect(spy.calls.first().args[0]).toEqual(['../']);
      }));

      it('should notify user', () => {
        spyOn(notifyService, 'setMessage');
        component.save();

        expect(notifyService.setMessage).toHaveBeenCalled();
      });
    });
  });

  describe('#cancel', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should redirect to parent component', inject([Router], (router: Router) => {
      const spy = spyOn(router, 'navigate');
      component.cancel();

      expect(spy.calls.first().args[0]).toEqual(['../']);
    }));
  });

  it('should render markdown helper', () => {
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('app-markdown-help'))).toBeTruthy();
  });
});
