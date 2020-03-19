import { environment } from 'environments/environment';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpParams } from '@angular/common/http';

import { SearchService } from './search.service';
import { SearchSortingPipe } from '@shared/pipes/search-sorting/search-sorting.pipe';
import { CategoryFactory } from '@modules/ticket/factories/category.factory';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';
import { TicketFactory } from '@modules/ticket/factories/tickets/ticket.factory';
import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';

describe('SearchService', () => {
  let searchService: SearchService;
  let httpTestingController: HttpTestingController;
  const serverData = [
    { id: 1, name: 'Тестовая категория' },
    { id: 2, name: 'Тестовая услуга', category_id: 1 },
    { id: 3, name: 'Тестовый вопрос', service_id: 2, ticket_type: TicketTypes.QUESTION }
  ];
  const expectedResult = [
    CategoryFactory.create({ id: 1, name: 'Тестовая категория' }),
    ServiceFactory.create({ id: 2, name: 'Тестовая услуга', category_id: 1 }),
    TicketFactory.create(TicketTypes.QUESTION, { id: 3, name: 'Тестовый вопрос', service_id: 2, ticket_type: TicketTypes.QUESTION })
  ];
  const searchStr = 'search string';
  const params = new HttpParams().set('search', searchStr);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SearchSortingPipe]
    });

    searchService = TestBed.get(SearchService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(SearchService).toBeTruthy();
  });

  describe('#search', () => {
    const searchUri = `${environment.serverUrl}/api/v1/dashboard/search`;

    it('should return Observable with search data', () => {
      searchService.search(searchStr).subscribe(result => {
        expect(result).toEqual(expectedResult);
      });

      httpTestingController.expectOne({
        method: 'GET',
        url: `${searchUri}?${params}`
      }).flush(serverData);
    });
  });

  describe('#deepSearch', () => {
    const searchUri = `${environment.serverUrl}/api/v1/dashboard/deep_search`;

    it('should return Observable with search data', () => {
      searchService.deepSearch(searchStr).subscribe(result => {
        expect(result).toEqual(expectedResult);
      });

      httpTestingController.expectOne({
        method: 'GET',
        url: `${searchUri}?${params}`
      }).flush(serverData);
    });
  });
});
