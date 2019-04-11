import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CasesPageComponent } from './cases.page';

describe('CasesPageComponent', () => {
  let component: CasesPageComponent;
  let fixture: ComponentFixture<CasesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CasesPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
