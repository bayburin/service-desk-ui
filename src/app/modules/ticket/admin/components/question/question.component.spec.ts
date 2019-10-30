import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

import { QuestionComponent } from './question.component';
import { TicketFactory } from '@modules/ticket/factories/ticket.factory';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';

describe('QuestionComponent', () => {
  let component: QuestionComponent;
  let fixture: ComponentFixture<QuestionComponent>;
  let question: Ticket;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule],
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
      correction: {
        id: 3,
        service_id: 2,
        name: 'Измененный вопрос',
        original_id: 1,
        ticket_type: 'question',
        open: false
      },
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
});
