import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { CasesPageContentComponent } from './cases-page-content.component';
import { CaseService } from '@modules/case/services/case/case.service';
import { of } from 'rxjs';
import { CaseI } from '@interfaces/case.interface';
import { FilterI } from '@interfaces/filter.interface';
import { Router } from '@angular/router';

class StubCaseService {
  getAllCases() {
    return of([]);
  }
}

describe('CasesPageContentComponent', () => {
  let component: CasesPageContentComponent;
  let fixture: ComponentFixture<CasesPageContentComponent>;
  let caseService: CaseService;
  let serverData: { statuses: FilterI[], cases: CaseI[]};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [CasesPageContentComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: CaseService, useClass: StubCaseService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasesPageContentComponent);
    component = fixture.componentInstance;

    caseService = TestBed.get(CaseService);
    serverData = {
      statuses: [{ id: 1, name: 'Все', count: 1 }] as FilterI[],
      cases: [{ case_id: 1, status_id: 1 }, { case_id: 2, status_id: 1 }] as CaseI[]
    };
  });

// Unit ====================================================================================================================================

  describe('Unit tests', () => {
    beforeEach(() => {
      spyOn(caseService, 'getAllCases').and.returnValue(of(serverData));
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should load cases', () => {
      expect(component.cases).toEqual(serverData.cases);
    });

    it('should load statuses', () => {
      expect(component.statuses).toEqual(serverData.statuses);
    });


    describe('#filterChanged', () => {
      it('should set "selectedStatusId" attribute', () => {
        component.filterChanged(123);

        expect(component.selectedStatusId).toEqual(123);
      });

      it('should load cases', () => {
        const spy = spyOn(component as any, 'loadCases');
        component.filterChanged(123);

        expect(spy).toHaveBeenCalled();
      });
    });

    describe('#caseRevoked', () => {
      it('should load cases', () => {
        const spy = spyOn(component as any, 'loadCases');
        component.caseRevoked();

        expect(spy).toHaveBeenCalled();
      });
    });

    describe('#isAnyCasesExists', () => {
      it('should return true if status.counnt is not equal zero', () => {
        expect(component.isAnyCasesExists()).toBeTruthy();
      });
    });
  });

// Shallow tests ===========================================================================================================================

  describe('Shallow tests', () => {
    describe('when data was not loaded', () => {
      it('should not show "Создать заявку в свободной форме" button', () => {
        expect(fixture.debugElement.nativeElement.textContent).not.toContain('Создать заявку в свободной форме');
      });

      it('should show FilterComponent', () => {
        expect(fixture.debugElement.nativeElement.querySelector('app-filters')).not.toBeTruthy();
      });

      it('should show CaseCardListComponent', () => {
        expect(fixture.debugElement.nativeElement.querySelector('app-case-card-list')).not.toBeTruthy();
      });
    });

    describe('when data loaded', () => {
      beforeEach(() => {
        spyOn(caseService, 'getAllCases').and.returnValue(of(serverData));
        fixture.detectChanges();
      });

      it('should show "Создать заявку в свободной форме" button', () => {
        expect(fixture.debugElement.nativeElement.textContent).toContain('Создать заявку в свободной форме');
      });

      it('should show FilterComponent', () => {
        expect(fixture.debugElement.nativeElement.querySelector('app-filters')).toBeTruthy();
      });

      it('should show CaseCardListComponent', () => {
        expect(fixture.debugElement.nativeElement.querySelector('app-case-card-list')).toBeTruthy();
      });

      it('should trigger navigation to "/cases/new"', () => {
        const router = TestBed.get(Router);
        const spy = spyOn(router, 'navigateByUrl');

        fixture.debugElement.nativeElement.querySelector('#newCase').click();
        expect(`${spy.calls.first().args[0]}`).toBe('/cases/new');
      });
    });
  });
});
