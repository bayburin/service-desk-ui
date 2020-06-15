import { StubClaimService } from '@modules/claim/services/claim/claim.service.stub';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ClaimsPageContentComponent } from './claims-page-content.component';
import { ClaimService } from '@modules/claim/services/claim/claim.service';
import { of } from 'rxjs';
import { ClaimI } from '@interfaces/claim.interface';
import { FilterI } from '@interfaces/filter.interface';
import { Router } from '@angular/router';

describe('ClaimsPageContentComponent', () => {
  let component: ClaimsPageContentComponent;
  let fixture: ComponentFixture<ClaimsPageContentComponent>;
  let claimService: ClaimService;
  let serverData: { statuses: FilterI[], cases: ClaimI[]};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ClaimsPageContentComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: ClaimService, useClass: StubClaimService }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimsPageContentComponent);
    component = fixture.componentInstance;

    claimService = TestBed.get(ClaimService);
    serverData = {
      statuses: [{ id: 1, name: 'Все', count: 1 }] as FilterI[],
      cases: [{ case_id: 1, status_id: 1 }, { case_id: 2, status_id: 1 }] as ClaimI[]
    };
  });

// Unit ====================================================================================================================================

  describe('Unit tests', () => {
    beforeEach(() => {
      spyOn(claimService, 'getAllCases').and.returnValue(of(serverData));
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
        expect(fixture.debugElement.nativeElement.querySelector('app-claim-card-list')).not.toBeTruthy();
      });
    });

    describe('when data loaded', () => {
      beforeEach(() => {
        spyOn(claimService, 'getAllCases').and.returnValue(of(serverData));
        fixture.detectChanges();
      });

      it('should show "Создать заявку в свободной форме" button', () => {
        expect(fixture.debugElement.nativeElement.textContent).toContain('Создать заявку в свободной форме');
      });

      it('should show FilterComponent', () => {
        expect(fixture.debugElement.nativeElement.querySelector('app-filters')).toBeTruthy();
      });

      it('should show CaseCardListComponent', () => {
        expect(fixture.debugElement.nativeElement.querySelector('app-claim-card-list')).toBeTruthy();
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
