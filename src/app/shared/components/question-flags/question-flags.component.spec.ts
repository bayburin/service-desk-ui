import { NO_ERRORS_SCHEMA } from '@angular//core';
import { By } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionFlagsComponent } from './question-flags.component';
import { TicketTypes, TicketStates } from '@modules/ticket/models/ticket/ticket.model';
import { TicketFactory } from '@modules/ticket/factories/tickets/ticket.factory';
import { QuestionTicket } from '@modules/ticket/models/question-ticket/question-ticket.model';

describe('QuestionFlagsComponent', () => {
  let component: QuestionFlagsComponent;
  let fixture: ComponentFixture<QuestionFlagsComponent>;
  let question: QuestionTicket;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionFlagsComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionFlagsComponent);
    component = fixture.componentInstance;
    question = TicketFactory.create(TicketTypes.QUESTION, { id: 1, name: 'Тестовый вопрос' });
    component.question = question;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  // it('should "mdi-file-check-outline" icon if question has published state', () => {
  //   question.state = 'published';
  //   fixture.detectChanges();

  //   expect(fixture.debugElement.query(By.css('.mdi-file-check-outline'))).toBeTruthy();
  // });

  // it('should "mdi-file-settings-variant-outline" icon if question has draft state', () => {
  //   question.state = 'draft';
  //   fixture.detectChanges();

  //   expect(fixture.debugElement.query(By.css('.mdi-file-settings-variant-outline'))).toBeTruthy();
  // });

  it('should show app-visible-flag component if question has draft state', () => {
    question.state = TicketStates.DRAFT;
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.additional-text'))).toBeTruthy();
    expect(fixture.debugElement.nativeElement.textContent).toContain('[черновик]');
  });

  it('should "mdi-pencil-plus-outline" icon if question has correction', () => {
    question.correction = TicketFactory.create(TicketTypes.QUESTION, { id: 2, original_id: 3, name: 'Редакция 1' });
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.mdi-pencil-plus-outline'))).toBeTruthy();
  });
});
