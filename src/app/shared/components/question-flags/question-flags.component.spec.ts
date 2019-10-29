import { By } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionFlagsComponent } from './question-flags.component';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { TicketFactory } from '@modules/ticket/factories/ticket.factory';

describe('QuestionFlagsComponent', () => {
  let component: QuestionFlagsComponent;
  let fixture: ComponentFixture<QuestionFlagsComponent>;
  let question: Ticket;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionFlagsComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionFlagsComponent);
    component = fixture.componentInstance;
    question = TicketFactory.create({ id: 1, name: 'Тестовый вопрос', ticket_type: 'question' });
    component.question = question;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should "mdi-file-check-outline" icon if question has published state', () => {
    question.state = 'published';
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.mdi-file-check-outline'))).toBeTruthy();
  });

  it('should "mdi-file-settings-variant-outline" icon if question has draft state', () => {
    question.state = 'draft';
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.mdi-file-settings-variant-outline'))).toBeTruthy();
  });

  it('should "mdi-eye-outline" icon if "hidden" attribute is equal false', () => {
    question.isHidden = false;
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.mdi-eye-outline'))).toBeTruthy();
  });

  it('should "mdi-eye-off-outline" icon if "hidden" attribute is euqal true', () => {
    question.isHidden = true;
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.mdi-eye-off-outline'))).toBeTruthy();
  });

  it('should "mdi-pencil-plus-outline" icon if question has correction', () => {
    question.correction = TicketFactory.create({ id: 2, original_id: 3, name: 'Редакция 1', ticket_type: 'question' });
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.mdi-pencil-plus-outline'))).toBeTruthy();
  });
});
