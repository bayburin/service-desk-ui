import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AnswerComponent } from './answer.component';
import { AnswerI } from '@interfaces/answer.interface';

describe('AnswerComponent', () => {
  let component: AnswerComponent;
  let fixture: ComponentFixture<AnswerComponent>;
  let answer: AnswerI;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnswerComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswerComponent);
    component = fixture.componentInstance;
    answer = { id: 1, ticket_id: 2, answer: 'Тестовый ответ' } as AnswerI;
    component.answer = answer;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show answer', () => {
    expect(fixture.debugElement.nativeElement.textContent).toContain(answer.answer);
  });
});
