import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpParams } from '@angular/common/http';

import { environment } from 'environments/environment';
import { ResponsibleUserService } from './responsible-user.service';
import { ResponsibleUserDetailsI } from '@interfaces/responsible_user_details.interface';
import { TicketFactory } from '@modules/ticket/factories/tickets/ticket.factory';

describe('ResponsibleUserService', () => {
  let httpTestingController: HttpTestingController;
  let service: ResponsibleUserService;
  let loadedData: ResponsibleUserDetailsI[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(ResponsibleUserService);
    loadedData = [
      { tn: 17664, full_name: 'Тест 1' } as ResponsibleUserDetailsI,
      { tn: 12345, full_name: 'Тест 2' } as ResponsibleUserDetailsI
    ];
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#loadDetails', () => {
    let tns: number[];
    let params: HttpParams;
    const loadDetailsUri = `${environment.serverUrl}/api/v1/responsible_users`;

    beforeEach(() => {
      tns = [17664, 12345];
      params = new HttpParams().append('tns', JSON.stringify(tns));
    });

    it('should return Observable with ResponsibleUserDetailsI data', () => {
      service.loadDetails(tns).subscribe(result => {
        expect(result).toEqual(loadedData);
      });

      httpTestingController.expectOne({
        method: 'GET',
        url: `${loadDetailsUri}?${params}`
      }).flush(loadedData);
    });

    it('should save loaded data in "details" attribute', () => {
      service.loadDetails(tns).subscribe(() => {
        expect(service.details).toEqual(loadedData);
      });

      httpTestingController.expectOne({
        method: 'GET',
        url: `${loadDetailsUri}?${params}`
      }).flush(loadedData);
    });
  });

  describe('#searchUsers', () => {
    let params: HttpParams;
    const term = 'test';
    const field = 'customField'
    const loadUsersUri = `${environment.serverUrl}/api/v1/responsible_users/search`;

    beforeEach(() => {
      params = new HttpParams().append('field', field).append('term', term);
    });

    it('should return Observable with ResponsibleUserDetailsI data', () => {
      service.searchUsers(field, term).subscribe(result => {
        expect(result).toEqual(loadedData);
      });

      httpTestingController.expectOne({
        method: 'GET',
        url: `${loadUsersUri}?${params}`
      }).flush(loadedData);
    });
  });
});
