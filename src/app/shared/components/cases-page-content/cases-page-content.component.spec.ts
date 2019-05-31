import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CasesPageContentComponent } from './cases-page-content.component';

describe('CasesPageContentComponent', () => {
  let component: CasesPageContentComponent;
  let fixture: ComponentFixture<CasesPageContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CasesPageContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasesPageContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
