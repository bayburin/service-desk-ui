import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { QuestionComponent } from './question.component';
import { TicketFactory } from '@modules/ticket/factories/tickets/ticket.factory';
import { Ticket, TicketTypes } from '@modules/ticket/models/ticket/ticket.model';
import { ServiceService } from '@shared/services/service/service.service';
import { StubServiceService } from '@shared/services/service/service.service.stub';
import { TicketService } from '@shared/services/ticket/ticket.service';
import { StubTicketService } from '@shared/services/ticket/ticket.service.stub';
import { NotificationService } from '@shared/services/notification/notification.service';
import { StubNotificationService } from '@shared/services/notification/notification.service.stub';
import { TicketI } from '@interfaces/ticket.interface';
import { AuthorizeDirective } from '@shared/directives/authorize/authorize.directive';
import { UserService } from '@shared/services/user/user.service';
import { StubUserService } from '@shared/services/user/user.service.stub';
import { ResponsibleUserService } from '@shared/services/responsible_user/responsible-user.service';
import { StubResponsibleUserService } from '@shared/services/responsible_user/responsible-user.service.stub';
import { ResponsibleUserDetailsI } from '@interfaces/responsible_user_details.interface';

describe('QuestionComponent', () => {
  let component: QuestionComponent;
  let fixture: ComponentFixture<QuestionComponent>;
  let question: Ticket;
  let serviceService: ServiceService;
  let ticketService: TicketService;
  let correction: TicketI;
  let notifyService: NotificationService;
  let responsibleUserService: ResponsibleUserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule],
      declarations: [QuestionComponent, AuthorizeDirective],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ServiceService, useClass: StubServiceService },
        { provide: TicketService, useClass: StubTicketService },
        { provide: NotificationService, useClass: StubNotificationService },
        { provide: UserService, useClass: StubUserService },
        { provide: ResponsibleUserService, useClass: StubResponsibleUserService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionComponent);
    component = fixture.componentInstance;
    serviceService = TestBed.get(ServiceService);
    ticketService = TestBed.get(TicketService);
    notifyService = TestBed.get(NotificationService);
    correction = {
      id: 3,
      service_id: 2,
      name: 'Измененный вопрос',
      original_id: 1,
      ticket_type: 'question',
      state: 'draft',
      open: false
    } as TicketI;
    question = TicketFactory.create(TicketTypes.QUESTION, {
      id: 1,
      service_id: 2,
      correction,
      name: 'Тестовый вопрос',
      ticket_type: 'question',
      state: 'published',
      responsible_users: [
        { tn: 123, details: { full_name: 'ФИО' } }
      ],
      tags: [
        { id: 1, name: 'Тег 1' },
        { id: 2, name: 'Тег 2' }
      ],
      answers: [
        { id: 2, answer: 'Ответ 1' },
        { id: 3, answer: 'Ответ 2' }
      ]
    });
    component.question = question;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should replace question by correction if it is exist', () => {
    expect(component.question).toEqual(question.correction);
  });

  it('should show app-question-flags component', () => {
    expect(fixture.debugElement.query(By.css('app-question-flags'))).toBeTruthy();
  });

  describe('#toggleQuestion', () => {
    it('should change "open" attribute', () => {
      component.toggleQuestion();

      expect(component.question.open).toEqual(true);
    });
  });

  describe('#editQuestion', () => {
    it('should redirect to admin page', inject([Router], (router: Router) => {
      const spy = spyOn(router, 'navigate');
      component.editQuestion();

      expect(spy.calls.first().args[0]).toEqual([component.question.id, 'edit']);
    }));
  });

  describe('#showCorrection', () => {
    it('should replace question by correction', () => {
      component.question = question;
      component.showCorrection();

      expect(component.question).toEqual(question.correction);
    });
  });

  describe('#showOriginal', () => {
    it('should replace correction by original', () => {
      component.showOriginal();

      expect(component.question).toEqual(question);
    });
  });

  describe('#publishQuestion', () => {
    let result: Ticket;
    let details: ResponsibleUserDetailsI[];

    beforeEach(() => {
      responsibleUserService = TestBed.get(ResponsibleUserService);
      details = [{ tn: 123, full_name: 'ФИО' } as ResponsibleUserDetailsI];

      spyOn(window, 'confirm').and.returnValue(true);
      spyOn(serviceService, 'replaceTicket');
      spyOn(ticketService, 'removeDraftTicket');
      spyOn(responsibleUserService, 'loadDetails').and.returnValue(of(details));
    });

    describe('when question has original', () => {
      beforeEach(() => {
        question = question.correction;
        result = TicketFactory.create(TicketTypes.QUESTION, correction);
        result.state = 'published';
        spyOn(ticketService, 'publishTickets').and.returnValue(of([result]));
        spyOn(notifyService, 'setMessage');
        spyOn(result, 'associateResponsibleUserDetails');
        component.publishQuestion();
      });

      it('should call "publishTickets" method', () => {
        expect(ticketService.publishTickets).toHaveBeenCalledWith([question]);
      });

      it('should call "replaceTicket" method', () => {
        expect(serviceService.replaceTicket).toHaveBeenCalledWith(question.original.id, result);
      });

      it('should call "setMessage" method', () => {
        expect(notifyService.setMessage).toHaveBeenCalled();
      });

      it('should call "removeDraftTicket" method for TicketService', () => {
        expect(ticketService.removeDraftTicket).toHaveBeenCalledWith(result);
      });

      it('should call "loadDetails" method of ResponsibleUserService service', () => {
        expect(responsibleUserService.loadDetails).toHaveBeenCalled();
      });

      it('should call "associateResponsibleUserDetails" method for loaded ticket with occured details', () => {
        expect(result.associateResponsibleUserDetails).toHaveBeenCalledWith(details);
      });
    });

    describe('when server returns empty array', () => {
      beforeEach(() => {
        spyOn(ticketService, 'publishTickets').and.returnValue(of([]));
        component.publishQuestion();
      });

      it('should exit from method', () => {
        expect(serviceService.replaceTicket).not.toHaveBeenCalled();
      });
    });
  });

  describe('#destroyPublishedQuestion', () => {
    beforeEach(() => {
      spyOn(window, 'confirm').and.returnValue(true);
      spyOn(ticketService, 'destroyTicket').and.returnValue(of(question));
      spyOn(notifyService, 'setMessage');
      spyOn(serviceService, 'removeTickets');
      component.destroyPublishedQuestion();
    });

    it('should call "destroyTicket" method', () => {
      expect(ticketService.destroyTicket).toHaveBeenCalled();
    });

    it('should call "setMessage" method', () => {
      expect(notifyService.setMessage).toHaveBeenCalled();
    });

    it('should call "removeTickets" method', () => {
      expect(serviceService.removeTickets).toHaveBeenCalled();
    });
  });

  describe('#destroyDraftQuestion', () => {
    beforeEach(() => {
      spyOn(window, 'confirm').and.returnValue(true);
      spyOn(ticketService, 'destroyTicket').and.returnValue(of({}));
      spyOn(notifyService, 'setMessage');
      spyOn(serviceService, 'removeTickets');
    });

    it('should call "destroyTicket" method', () => {
      component.destroyDraftQuestion();

      expect(ticketService.destroyTicket).toHaveBeenCalled();
    });

    it('should call "setMessage" method', () => {
      component.destroyDraftQuestion();

      expect(notifyService.setMessage).toHaveBeenCalled();
    });

    it('should call "removeTickets" method', () => {
      component.question.original = null;
      component.destroyDraftQuestion();

      expect(serviceService.removeTickets).toHaveBeenCalled();
    });

    describe('when question has original', () => {
      beforeEach(() => {
        component.question = question.correction;
        component.question.original = {} as Ticket;
        spyOn(component, 'showOriginal');
        component.destroyDraftQuestion();
      });

      it('should call "showOriginal" method', () => {
        expect(component.showOriginal).toHaveBeenCalled();
      });

      it('should set null to correction', () => {
        expect(component.question.correction).toBeNull();
      });
    });
  });

  describe('Original question', () => {
    beforeEach(() => {
      component.showOriginal();
      fixture.detectChanges();
    });

    it('should show question', () => {
      expect(fixture.debugElement.nativeElement.textContent).toContain(question.name);
    });

    it('should show tags', () => {
      question.tags.forEach(tag => {
        expect(fixture.debugElement.nativeElement.textContent).toContain(tag.name);
      });
    });

    it('should show app-answer-component on each answer', () => {
      question.open = true;
      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelectorAll('app-answer').length).toEqual(question.answers.length);
    });
  });

  it('should show app-responsible-user-details component', () => {
    component.question = question;
    component.toggleQuestion();
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('app-responsible-user-details'))).toBeTruthy();
  });
});
