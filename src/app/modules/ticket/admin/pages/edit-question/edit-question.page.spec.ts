import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { EditQuestionPageComponent } from './edit-question.page';
import { ServiceService } from '@shared/services/service/service.service';
import { StubQuestionService } from '@shared/services/question/question.service.stub';
import { QuestionService } from '@shared/services/question/question.service';
import { StubServiceService } from '@shared/services/service/service.service.stub';
import { Service } from '@modules/ticket/models/service/service.model';
import { ServiceI } from '@interfaces/service.interface';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';
import { NotificationService } from '@shared/services/notification/notification.service';
import { StubNotificationService } from '@shared/services/notification/notification.service.stub';
import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';
import { TicketI } from '@interfaces/ticket.interface';
import { TicketFactory } from '@modules/ticket/factories/tickets/ticket.factory';
import { ResponsibleUserService } from '@shared/services/responsible_user/responsible-user.service';
import { StubResponsibleUserService } from '@shared/services/responsible_user/responsible-user.service.stub';
import { ResponsibleUserDetailsI } from '@interfaces/responsible_user_details.interface';
import { Question } from '@modules/ticket/models/question/question.model';
import { QuestionI } from '@interfaces/question.interface';

describe('EditQuestionPageComponent', () => {
  let component: EditQuestionPageComponent;
  let fixture: ComponentFixture<EditQuestionPageComponent>;
  let ticketI: TicketI;
  let questionI: QuestionI;
  let question: Question;
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
    state: 'draft',
    ticketable_id: 2,
    ticketable_type: TicketTypes.QUESTION,
    is_hidden: false,
    responsible_users: [{ tn: 123 }]
  } as TicketI;
  questionI = {
    id: 2,
    original_id: null,
    ticket: ticketI
  };
  question = TicketFactory.create(TicketTypes.QUESTION, questionI);
  const stubRoute = jasmine.createSpyObj<ActivatedRoute>('ActivatedRoute', ['snapshot', 'data']);
  const stubRouteProxy = new Proxy(stubRoute, {
    get(target, prop) {
      if (prop === 'data') {
        return of({ question });
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
      declarations: [EditQuestionPageComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ServiceService, useClass: StubServiceService },
        { provide: QuestionService, useClass: StubQuestionService },
        { provide: NotificationService, useClass: StubNotificationService },
        { provide: ActivatedRoute, useValue: stubRouteProxy },
        { provide: ResponsibleUserService, useClass: StubResponsibleUserService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditQuestionPageComponent);
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
    service.questions = [question];

    serviceService.service = service;
    spyOn(responsibleUserService, 'loadDetails').and.returnValue(of(details));
    spyOn(question, 'associateResponsibleUserDetails');
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

      expect(question.associateResponsibleUserDetails).toHaveBeenCalledWith(details);
    });
  });

  describe('#save', () => {
    let questionService: QuestionService;

    beforeEach(() => {
      questionService = TestBed.get(QuestionService);
    });

    describe('when form is invalid', () => {
      it('should not save ticket', () => {
        spyOn(questionService, 'updateQuestion');
        fixture.detectChanges();
        (component.questionForm.controls.ticket as FormGroup).controls.name.setValue('');
        component.save();

        expect(questionService.updateQuestion).not.toHaveBeenCalled();
      });
    });

    describe('when form valid', () => {
      let newQuestion: Question;

      beforeEach(() => {
        const newTicketI = {
          id: question.ticketId,
          service_id: 2,
          name: 'Тестовый вопрос. Новая редакция',
          state: 'draft',
          is_hidden: false
        } as TicketI;
        const newQuestionI = {
          id: 2,
          original_id: null,
          ticket: newTicketI
        };
        newQuestion = TicketFactory.create(TicketTypes.QUESTION, newQuestionI);
        fixture.detectChanges();
        (component.questionForm.controls.ticket as FormGroup).controls.name.setValue('Тестовый вопрос');
        spyOn(questionService, 'updateQuestion').and.returnValue(of(newQuestion));
        spyOn(newQuestion, 'associateResponsibleUserDetails');
      });

      it('should call "updateTicket" method from QuestionService with ticket params', () => {
        component.save();

        expect(questionService.updateQuestion).toHaveBeenCalledWith(component.question, component.questionForm.getRawValue());
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

      it('should call "loadDetails" method of responsibleUserService service', () => {
        component.save();

        expect(responsibleUserService.loadDetails).toHaveBeenCalled();
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
