import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { CaseI } from '@interfaces/case.interface';
import { CaseCardListComponent } from './case-card-list.component';

describe('CaseCardListComponent', () => {
  let component: CaseCardListComponent;
  let fixture: ComponentFixture<CaseCardListComponent>;
  let cases: CaseI[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [CaseCardListComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    cases = [
      { case_id: 1, status_id: 1 },
      { case_id: 2, status_id: 2 },
      { case_id: 3, status_id: 3 },
      { case_id: 4, status_id: 4 },
    ] as CaseI[];
  });

// Unit ====================================================================================================================================

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should transform array of cases into array that contains nested arrays', () => {
    const result = [
      [
        { case_id: 1, status_id: 1 },
        { case_id: 2, status_id: 2 }
      ],
      [
        { case_id: 3, status_id: 3 },
        { case_id: 4, status_id: 4 }
      ]
    ];

    component.cases = cases;
    component.ngOnChanges();

    expect(component.data).toEqual(result);
  });

  describe('#revokeCase', () => {
    it('should emit true to the removeCase subject', () => {
      const spy = spyOn(component.removeCase, 'emit');

      component.revokeCase();
      expect(spy).toHaveBeenCalledWith(true);
    });
  });

// Shallow tests ===========================================================================================================================

  describe('#Shallow tests', () => {
    it('should show all loaded cases', () => {
      component.cases = cases;
      component.ngOnChanges();
      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelectorAll('app-case-card').length).toEqual(cases.length);
    });
  });
});
