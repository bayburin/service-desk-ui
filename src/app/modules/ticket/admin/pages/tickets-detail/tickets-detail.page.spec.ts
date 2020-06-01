import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketsDetailPageComponent } from './tickets-detail.page';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { ServiceService } from '@shared/services/service/service.service';
import { QuestionService } from '@shared/services/question/question.service';
import { StubQuestionService } from '@shared/services/question/question.service.stub';
import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';
import { Service } from '@modules/ticket/models/service/service.model';
import { TicketFactory } from '@modules/ticket/factories/tickets/ticket.factory';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';
import { StubServiceService } from '@shared/services/service/service.service.stub';
import { ResponsibleUserService } from '@shared/services/responsible_user/responsible-user.service';
import { StubResponsibleUserService } from '@shared/services/responsible_user/responsible-user.service.stub';
import { ResponsibleUserDetailsI } from '@interfaces/responsible_user_details.interface';
import { TicketService, TicketDataI } from '@shared/services/ticket/ticket.service';
import { StubTicketService } from '@shared/services/ticket/ticket.service.stub';
import { Question } from '@modules/ticket/models/question/question.model';

describe('TicketsDetailPageComponent', () => {
  let component: TicketsDetailPageComponent;
  let fixture: ComponentFixture<TicketsDetailPageComponent>;
  let questionService: QuestionService;
  let ticketService: TicketService;
  let serviceService: ServiceService;
  let questions: Question[];
  let service: Service;
  let responsibleUserService: ResponsibleUserService;
  let details: ResponsibleUserDetailsI[];
  let data: TicketDataI;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule, HttpClientTestingModule],
      declarations: [TicketsDetailPageComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ServiceService, useClass: StubServiceService },
        { provide: QuestionService, useClass: StubQuestionService },
        { provide: ResponsibleUserService, useClass: StubResponsibleUserService },
        { provide: TicketService, useClass: StubTicketService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsDetailPageComponent);
    component = fixture.componentInstance;
    questionService = TestBed.get(QuestionService);
    serviceService = TestBed.get(ServiceService);
    ticketService = TestBed.get(TicketService);
    responsibleUserService = TestBed.get(ResponsibleUserService);
    details = [{ tn: 123, full_name: 'ФИО' } as ResponsibleUserDetailsI];
    questions = [
      TicketFactory.create(TicketTypes.QUESTION, { id: 2, ticket: { id: 1, name: 'Вопрос 2' } }),
      TicketFactory.create(TicketTypes.QUESTION, { id: 3, ticket: { id: 2, name: 'Вопрос 3' } })
    ];
    data = { questions, cases: [] };
    service = ServiceFactory.create({
      id: 1,
      categoryId: 2,
      name: 'Тестовая услуга',
      questions: [{ id: 1, ticket: { name: 'Вопрос 1' } }]
    });
    serviceService.service = service;

    spyOn(ticketService, 'loadDraftTickets').and.returnValue(of(data));
    spyOn(serviceService, 'addTickets');
    spyOn(serviceService, 'removeDraftTickets');
    spyOn(questionService, 'addDraftQuestions');
    spyOn(responsibleUserService, 'loadDetails').and.returnValues(of(details));
    questions.forEach(ticket => spyOn(ticket, 'associateResponsibleUserDetails'));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#loadTickets', () => {
    it('should loads tickets with draft state from server', () => {
      expect(ticketService.loadDraftTickets).toHaveBeenCalledWith(component.service);
    });

    it('should call "loadDetails" method of responsibleUserService service', () => {
      expect(responsibleUserService.loadDetails).toHaveBeenCalled();
    });

    it('should call "associateResponsibleUserDetails" method for created question with occured details', () => {
      questions.forEach(question => {
        expect(question.associateResponsibleUserDetails).toHaveBeenCalledWith(details);
      });
    });

    it('should call "removeDraftTickets" method', () => {
      expect(serviceService.removeDraftTickets).toHaveBeenCalled();
    });

    it('should call "addTickets" method with received tickets', () => {
      expect(serviceService.addTickets).toHaveBeenCalledWith(data);
    });

    it('should call "addDraftQuestions" method with received tickets', () => {
      expect(questionService.addDraftQuestions).toHaveBeenCalledWith(data.questions);
    });
  });

  it('should call "removeQuestions" method with draft tickets if user leaves the admin module', () => {
    spyOn(serviceService, 'removeQuestions');
    (component as any).router.navigateByUrl('/');

    expect(serviceService.removeQuestions).toHaveBeenCalledWith(questionService.draftQuestions);
  });
});
