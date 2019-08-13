import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpParams } from '@angular/common/http';

import { environment } from 'environments/environment';
import { CaseService } from './case.service';
import { CaseI } from '@interfaces/case.interface';

describe('CaseService', () => {
  let caseService: CaseService;
  let httpTestingController: HttpTestingController;
  const casesUri = `${environment.serverUrl}/api/v1/cases`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    caseService = TestBed.get(CaseService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(caseService).toBeTruthy();
  });

  describe('#getAllCases', () => {
    const filters = { status_id: 1 };
    const data = { cases: [], statuses: [] };

    it('should return Observable with cases and statuses', () => {
      const params = new HttpParams().set('filters', JSON.stringify(filters));

      caseService.getAllCases(filters).subscribe(result => {
        expect(result).toEqual(data);
      });

      httpTestingController.expectOne({
        method: 'GET',
        url: `${casesUri}?${params.toString()}`,
      }).flush(data);
    });

    it('should set empty filter if filter does not exist', () => {
      const params = new HttpParams().set('filters', JSON.stringify({}));

      caseService.getAllCases().subscribe();

      httpTestingController.expectOne({
        method: 'GET',
        url: `${casesUri}?${params.toString()}`,
      }).flush(data);
    });
  });

  describe('#createCase', () => {
    const kase = {
      service_id: 1,
      desc: 'Тестовое описание',
      item_id: 1
    } as CaseI;

    it('should return Observable with created case', () => {
      caseService.createCase(kase).subscribe();

      httpTestingController.expectOne({
        method: 'POST',
        url: `${casesUri}`,
      });
    });
  });

  describe('#revokeCase', () => {
    const kase = { case_id: 12 } as CaseI;

    it('should return Observable with any data', () => {
      caseService.revokeCase(kase.case_id).subscribe();

      httpTestingController.expectOne({
        method: 'DELETE',
        url: `${casesUri}/${kase.case_id}`,
      });
    });
  });

  describe('#getRawValues', () => {
    let kase;

    beforeEach(() => {
      kase = {
        case_id: 12,
        service: { id: 1 },
        desc: 'Тестовое описание',
        item: {
          item_id: 3,
          invent_num: 761111
        },
        without_service: false,
        without_item: false
      };
    });

    it('should return object with raw case data', () => {
      const result = caseService.getRawValues(kase);

      expect(result).toEqual(jasmine.objectContaining({ service_id: 1 }));
    });

    it('should remove service and item from object', () => {
      const result = caseService.getRawValues(kase);

      expect(result.service).toEqual(undefined);
      expect(result['item']).toEqual(undefined);
    });

    describe('when flags "without_service" and "without_item" are set', () => {
      it('should return object without "service_id", "item_id" and "invent_num"', () => {
        kase.without_service = true;
        kase.without_item = true;
        const result = caseService.getRawValues(kase);

        expect(result.service_id).toEqual(undefined);
        expect(result.item_id).toEqual(undefined);
        expect(result.invent_num).toEqual(undefined);
      });
    });
  });

  describe('#voteCase', () => {
    const kase  = { case_id: 1 } as CaseI;

    it('should return Observable with any data', () => {
      caseService.voteCase(kase).subscribe();

      httpTestingController.expectOne({
        method: 'PUT',
        url: `${casesUri}/${kase.case_id}`,
      });
    });
  });

  describe('#isClosed', () => {
    it('should return true if status_id = 3', () => {
      const kase = { status_id: 3 } as CaseI;

      expect(caseService.isClosed(kase)).toBeTruthy();
    });

    it('should return true if status_id = 4', () => {
      const kase = { status_id: 4 } as CaseI;

      expect(caseService.isClosed(kase)).toBeTruthy();
    });
  });
});
