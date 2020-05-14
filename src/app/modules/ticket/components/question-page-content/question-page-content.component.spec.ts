import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

import { QuestionPageContentComponent } from './question-page-content.component';
import { QuestionTicketService } from '@shared/services/question-ticket/question-ticket.service';
import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';
import { TicketFactory } from '@modules/ticket/factories/tickets/ticket.factory';
import { AnswerAttachmentI } from '@interfaces/answer-attachment.interface';
import { AnswerI } from '@interfaces/answer.interface';
import { StubQuestionTicketService } from '@shared/services/question-ticket/question-ticket.service.stub';
import { AttachmentService } from '@shared/services/attachment/attachment.service';
import { StubAttachmentService } from '@shared/services/attachment/attachment.service.stub';
import { QuestionTicketPolicy } from '@shared/policies/question-ticket/question-ticket.policy';
import { StubQuestionTicketPolicy } from '@shared/policies/question-ticket/question-ticket.policy.stub';
import { ResponsibleUserDetailsI } from '@interfaces/responsible_user_details.interface';
import { ResponsibleUserI } from '@interfaces/responsible-user.interface';
import { QuestionTicket } from '@modules/ticket/models/question-ticket/question-ticket.model';

describe('QuestionPageContentComponent', () => {
  let component: QuestionPageContentComponent;
  let fixture: ComponentFixture<QuestionPageContentComponent>;
  let question: QuestionTicket;
  let questionTicketService: QuestionTicketService;
  let attachmentService: AttachmentService;
  const attachment = {
    id: 1,
    filename: 'Тестовый файл'
  } as AnswerAttachmentI;
  const answers: AnswerI[] = [
    { id: 1, ticket_id: 1, answer: 'Тестовый ответ 1', link: 'http://test_link', attachments: [attachment] } as AnswerI,
    { id: 2, ticket_id: 1, answer: 'Тестовый ответ 2' } as AnswerI
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [QuestionPageContentComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: QuestionTicketService, useClass: StubQuestionTicketService },
        { provide: AttachmentService, useClass: StubAttachmentService },
        { provide: QuestionTicketPolicy, useClass: StubQuestionTicketPolicy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionPageContentComponent);
    component = fixture.componentInstance;
    question = TicketFactory.create(TicketTypes.QUESTION, { id: 1, ticket: { id: 2, name: 'Тестовый вопрос' }, answers });
    component.data = question;
    questionTicketService = TestBed.get(QuestionTicketService);
    attachmentService = TestBed.get(AttachmentService);
    fixture.detectChanges();
  });

// Unit ====================================================================================================================================

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call "raiseRating" method for QuestionTicketService if "ratingStream" emitted', () => {
    spyOn(questionTicketService, 'raiseRating').and.callThrough();
    component.ratingStream.subscribe(() => {
      expect(questionTicketService.raiseRating).toHaveBeenCalledWith(question);
    });

    component.ratingStream.next(question);
  });

  describe('#toggleTicket', () => {
    it('should change "open" attribute', () => {
      component.toggleTicket();

      expect(question.open).toEqual(true);
    });

    it('should emit to "ratingStream" subject', () => {
      spyOn(component.ratingStream, 'next');
      component.toggleTicket();

      expect(component.ratingStream.next).toHaveBeenCalled();
    });

    it('should not do anything if standaloneLink is setted', () => {
      component.standaloneLink = true;
      spyOn(component.ratingStream, 'next');
      component.toggleTicket();

      expect(component.ratingStream.next).not.toHaveBeenCalled();
      expect(question.open).not.toEqual(true);
    });
  });

  describe('#downloadAttachment', () => {
    const attachment = {
      id: 1,
      answer_id: 1,
      filename: 'test file'
    } as AnswerAttachmentI;

    it('should call "downloadAttachmentFromAnswer" method for QuestionTicketService', () => {
      spyOn(attachmentService, 'downloadAttachment').and.returnValue(of(new Blob()));
      component.downloadAttachment(attachment);

      expect(attachmentService.downloadAttachment).toHaveBeenCalledWith(attachment);
    });
  });

// Shallow tests ===========================================================================================================================

  describe('Shallow tests', () => {
    const selectedAnswer = answers[0];

    it('should show question', () => {
      expect(fixture.debugElement.nativeElement.textContent).toContain(question.name);
    });

    it('should show markdown answers', () => {
      question.answers.forEach(answer => {
        expect(fixture.debugElement.nativeElement.textContent).not.toContain(answer.answer);
      });

      fixture.debugElement.nativeElement.querySelector('.sd-list-question > .sd-list-question-group').click();
      fixture.detectChanges();

      expect(fixture.debugElement.queryAll(By.css('markdown')).length).toEqual(question.answers.length);
      // ticket.answers.forEach(answer => {
      //   expect(fixture.debugElement.nativeElement.textContent).toContain(answer.answer);
      // });
    });

    it('should show attachments', () => {
      fixture.debugElement.nativeElement.querySelector('.sd-list-question > .sd-list-question-group').click();
      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('#attachmentFile')).toBeTruthy();
    });

    it('should show links', () => {
      fixture.debugElement.nativeElement.querySelector('.sd-list-question > .sd-list-question-group').click();
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('#attachmentLink')).toBeTruthy();
      expect(fixture.debugElement.nativeElement.querySelector('#attachmentLink').getAttribute('href')).toEqual(selectedAnswer.link);
    });

    it('should show app-visible-flag component if showFlags is equal true', () => {
      expect(fixture.debugElement.query(By.css('app-visible-flag'))).toBeFalsy();
      component.showFlags = true;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('app-visible-flag'))).toBeTruthy();
    });

    it('should show app-responsible-user-details component', () => {
      question.responsibleUsers = [{ tn: 17664, details: { full_name: 'ФИО' } as ResponsibleUserDetailsI } as ResponsibleUserI];
      fixture.debugElement.nativeElement.querySelector('.sd-list-question > .sd-list-question-group').click();
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('app-responsible-user-details'))).toBeTruthy();
    });
  });
});
