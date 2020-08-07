import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { FormInfoTabComponent } from './form-info-tab.component';

describe('FormInfoTabComponent', () => {
  let component: FormInfoTabComponent;
  let fixture: ComponentFixture<FormInfoTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [FormInfoTabComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    const formBuilder = TestBed.get(FormBuilder);

    fixture = TestBed.createComponent(FormInfoTabComponent);
    component = fixture.componentInstance;
    component.claimFormForm = formBuilder.group({
      id: [],
      description: [],
      destination: [],
      message: [],
      info: [],
      ticket: formBuilder.group({})
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show app-common-ticket-information component', () => {
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('app-common-ticket-information'))).toBeTruthy();
  });
});
