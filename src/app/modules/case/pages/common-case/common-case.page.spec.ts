import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { CommonCasePageComponent } from './common-case.page';
import { By } from '@angular/platform-browser';

describe('CommonCasePageComponent', () => {
  let component: CommonCasePageComponent;
  let fixture: ComponentFixture<CommonCasePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [CommonCasePageComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonCasePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show header', () => {
    expect(fixture.debugElement.nativeElement.querySelector('app-section-header')).toBeTruthy();
    expect(fixture.debugElement.query(By.css('app-section-header')).nativeElement.getAttribute('header')).toEqual('Запрос в техподдержку');
  });

  it('should show app-common-form component', () => {
    expect(fixture.debugElement.nativeElement.querySelector('app-common-form')).toBeTruthy();
  });

  it('should set "new" value to the formType property', () => {
    expect(fixture.debugElement.query(By.css('app-common-form')).nativeElement.getAttribute('formType')).toEqual('new');
  });

  it('should redirect to cases page', inject([Router], (router: Router) => {
    const spy = spyOn(router, 'navigateByUrl');
    component.onSave();

    expect(`${spy.calls.first().args[0]}`).toEqual('/cases');
  }));
});
