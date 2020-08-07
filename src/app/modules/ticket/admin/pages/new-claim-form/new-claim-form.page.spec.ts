import { of } from 'rxjs';
import { TicketTypes, Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { TicketI } from '@interfaces/ticket.interface';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';
import { StubResponsibleUserService } from '@shared/services/responsible_user/responsible-user.service.stub';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { Router } from '@angular/router';

import { NewClaimFormPageComponent } from './new-claim-form.page';
import { StubClaimFormService } from '@shared/services/claim-form/claim-form.service.stub';
import { ClaimFormService } from '@shared/services/claim-form/claim-form.service';
import { StubServiceService } from '@shared/services/service/service.service.stub';
import { ServiceService } from '@shared/services/service/service.service';
import { NotificationService } from '@shared/services/notification/notification.service';
import { ResponsibleUserService } from '@shared/services/responsible_user/responsible-user.service';
import { StubNotificationService } from '@shared/services/notification/notification.service.stub';
import { ServiceI } from '@interfaces/service.interface';
import { Service } from '@modules/ticket/models/service/service.model';
import { TicketFactory } from '@modules/ticket/factories/tickets/ticket.factory';

describe('NewClaimFormPageComponent', () => {
  let component: NewClaimFormPageComponent;
  let fixture: ComponentFixture<NewClaimFormPageComponent>;
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
      declarations: [NewClaimFormPageComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ServiceService, useClass: StubServiceService },
        { provide: ClaimFormService, useClass: StubClaimFormService },
        { provide: NotificationService, useClass: StubNotificationService },
        { provide: ResponsibleUserService, useClass: StubResponsibleUserService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewClaimFormPageComponent);
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
    let claimFormService: ClaimFormService;

    beforeEach(() => {
      claimFormService = TestBed.get(ClaimFormService);
    });

    describe('when form is invalid', () => {
      it('should not save ticket', () => {
        spyOn(claimFormService, 'create');
        fixture.detectChanges();
        component.save();

        expect(claimFormService.create).not.toHaveBeenCalled();
      });
    });

    describe('when form valid', () => {
      let ticketI: TicketI;
      let ticket: Ticket;

      beforeEach(() => {
        ticketI = { id: 1, name: 'Тестовя форма' } as TicketI;
        ticket = TicketFactory.create(TicketTypes.CLAIM_FORM, ticketI);
        fixture.detectChanges();
        (component.claimFormForm.controls.ticket as FormGroup).controls.name.setValue('Тестовый вопрос');
        spyOn(claimFormService, 'create').and.returnValue(of(ticket));
      });

      it('should call "createTicket" method from QuestionService with ticket params', () => {
        component.save();

        expect(claimFormService.create).toHaveBeenCalledWith(component.claimFormForm.getRawValue());
      });

      it('should redirect to parent page', inject([Router], (router: Router) => {
        const spy = spyOn(router, 'navigate');
        component.save();

        expect(spy.calls.first().args[0]).toEqual(['../../']);
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

      expect(spy.calls.first().args[0]).toEqual(['../../']);
    }));
  });
});
