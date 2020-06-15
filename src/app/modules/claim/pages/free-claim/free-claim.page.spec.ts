import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { FreeClaimPageComponent } from './free-claim.page';
import { By } from '@angular/platform-browser';

describe('FreeClaimPageComponent', () => {
  let component: FreeClaimPageComponent;
  let fixture: ComponentFixture<FreeClaimPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [FreeClaimPageComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeClaimPageComponent);
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

  it('should show app-free-claim-form component', () => {
    expect(fixture.debugElement.nativeElement.querySelector('app-free-claim-form')).toBeTruthy();
  });

  it('should set "new" value to the formType property', () => {
    expect(fixture.debugElement.query(By.css('app-free-claim-form')).nativeElement.getAttribute('formType')).toEqual('new');
  });

  it('should redirect to cases page', inject([Router], (router: Router) => {
    const spy = spyOn(router, 'navigateByUrl');
    component.onSave();

    expect(`${spy.calls.first().args[0]}`).toEqual('/cases');
  }));
});
