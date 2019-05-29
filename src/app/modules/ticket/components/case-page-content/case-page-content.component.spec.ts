import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CasePageContentComponent } from './case-page-content.component';

describe('CasePageContentComponent', () => {
  let component: CasePageContentComponent;
  let fixture: ComponentFixture<CasePageContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CasePageContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasePageContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
