import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseCardListComponent } from './case-card-list.component';

describe('CaseCardListComponent', () => {
  let component: CaseCardListComponent;
  let fixture: ComponentFixture<CaseCardListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseCardListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
