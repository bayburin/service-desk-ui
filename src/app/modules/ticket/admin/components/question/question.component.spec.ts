import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { QuestionComponent } from './question.component';
import { TicketFactory } from '@modules/ticket/factories/ticket.factory';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';

describe('QuestionComponent', () => {
  let component: QuestionComponent;
  let fixture: ComponentFixture<QuestionComponent>;
  let question: Ticket;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [QuestionComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionComponent);
    component = fixture.componentInstance;
    question = TicketFactory.create({
      id: 1,
      service_id: 2,
      name: 'Тестовый вопрос',
      ticket_type: 'question',
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

  describe('#toggleQuestion', () => {
    it('should change "open" attribute', () => {
      component.toggleQuestion();

      expect(question.open).toEqual(true);
    });
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
