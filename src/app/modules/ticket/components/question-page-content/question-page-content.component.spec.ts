import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { QuestionPageContentComponent } from './question-page-content.component';
import { TicketService } from '@shared/services/ticket/ticket.service';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { TicketFactory } from '@modules/ticket/factories/ticket.factory';
import { AnswerAttachmentI } from '@interfaces/answer-attachment.interface';
import { AnswerI } from '@interfaces/answer.interface';
import { StubTicketService } from '@shared/services/ticket/ticket.service.stub';

describe('QuestionPageContentComponent', () => {
  let component: QuestionPageContentComponent;
  let fixture: ComponentFixture<QuestionPageContentComponent>;
  let ticket: Ticket;
  let ticketService: TicketService;
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
      providers: [{ provide: TicketService, useClass: StubTicketService }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionPageContentComponent);
    component = fixture.componentInstance;
    ticket = TicketFactory.create({ id: 1, name: 'Тестовый вопрос', ticket_type: 'question', answers: answers });
    component.data = ticket;
    ticketService = TestBed.get(TicketService);
    fixture.detectChanges();
  });

// Unit ====================================================================================================================================

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call "raiseRating" method for TicketService if "ratingStream" emitted', () => {
    spyOn(ticketService, 'raiseRating').and.callThrough();
    component.ratingStream.subscribe(() => {
      expect(ticketService.raiseRating).toHaveBeenCalledWith(ticket);
    });

    component.ratingStream.next(ticket);
  });

  describe('#toggleTicket', () => {
    it('should change "open" attribute', () => {
      component.toggleTicket();

      expect(ticket.open).toEqual(true);
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
      expect(ticket.open).not.toEqual(true);
    });
  });

  describe('#downloadAttachment', () => {
    const attachment = {
      id: 1,
      answer_id: 1,
      filename: 'test file'
    } as AnswerAttachmentI;

    it('should call "downloadAttachmentFromAnswer" method for TicketService', () => {
      spyOn(ticketService, 'downloadAttachmentFromAnswer').and.returnValue(of(new Blob()));
      component.downloadAttachment(attachment);

      expect(ticketService.downloadAttachmentFromAnswer).toHaveBeenCalledWith(attachment);
    });
  });

// Shallow tests ===========================================================================================================================

  describe('Shallow tests', () => {
    const selectedAnswer = answers[0];

    it('should show question', () => {
      expect(fixture.debugElement.nativeElement.textContent).toContain(ticket.name);
    });

    it('should show answers', () => {
      ticket.answers.forEach(answer => {
        expect(fixture.debugElement.nativeElement.textContent).not.toContain(answer.answer);
      });

      fixture.debugElement.nativeElement.querySelector('.sd-list-question > .sd-link').click();
      fixture.detectChanges();

      ticket.answers.forEach(answer => {
        expect(fixture.debugElement.nativeElement.textContent).toContain(answer.answer);
      });
    });

    it('should show attachments', () => {
      fixture.debugElement.nativeElement.querySelector('.sd-list-question > .sd-link').click();
      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('#attachmentFile')).toBeTruthy();
    });

    it('should show links', () => {
      fixture.debugElement.nativeElement.querySelector('.sd-list-question > .sd-link').click();
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('#attachmentLink')).toBeTruthy();
      expect(fixture.debugElement.nativeElement.querySelector('#attachmentLink').getAttribute('href')).toEqual(selectedAnswer.link);
    });
  });
});
