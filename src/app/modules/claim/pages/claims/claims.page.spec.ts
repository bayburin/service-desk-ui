import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ClaimsPageComponent } from './claims.page';

describe('ClaimsPageComponent', () => {
  let component: ClaimsPageComponent;
  let fixture: ComponentFixture<ClaimsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimsPageComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render app-claims-page-content component', () => {
    expect(fixture.debugElement.nativeElement.querySelector('app-claims-page-content')).toBeTruthy();
  });
});
