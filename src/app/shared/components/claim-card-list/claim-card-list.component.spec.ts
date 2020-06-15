import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ClaimI } from '@interfaces/claim.interface';
import { ClaimCardListComponent } from './claim-card-list.component';

describe('ClaimCardListComponent', () => {
  let component: ClaimCardListComponent;
  let fixture: ComponentFixture<ClaimCardListComponent>;
  let cases: ClaimI[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [ClaimCardListComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    cases = [
      { case_id: 1, status_id: 1 },
      { case_id: 2, status_id: 2 },
      { case_id: 3, status_id: 3 },
      { case_id: 4, status_id: 4 },
    ] as ClaimI[];
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

      expect(fixture.debugElement.nativeElement.querySelectorAll('app-claim-card').length).toEqual(cases.length);
    });
  });
});
