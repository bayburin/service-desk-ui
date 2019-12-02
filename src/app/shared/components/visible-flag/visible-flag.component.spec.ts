import { By } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisibleFlagComponent } from './visible-flag.component';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { TicketFactory } from '@modules/ticket/factories/ticket.factory';

describe('VisibleFlagComponent', () => {
  let component: VisibleFlagComponent;
  let fixture: ComponentFixture<VisibleFlagComponent>;
  let question: Ticket;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VisibleFlagComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisibleFlagComponent);
    component = fixture.componentInstance;
    question = TicketFactory.create({ id: 1, name: 'Тестовый вопрос', ticket_type: 'question' });
    component.data = question;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
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

});
