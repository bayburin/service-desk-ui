import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionPageContentComponent } from './question-page-content.component';

describe('QuestionPageContentComponent', () => {
  let component: QuestionPageContentComponent;
  let fixture: ComponentFixture<QuestionPageContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionPageContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionPageContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
