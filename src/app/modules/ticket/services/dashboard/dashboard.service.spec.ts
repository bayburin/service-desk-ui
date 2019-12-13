import { environment } from 'environments/environment';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DashboardService } from './dashboard.service';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';
import { CategoryFactory } from '@modules/ticket/factories/category.factory';
import { DashboardI } from '@interfaces/dashboard.interface';
import { UserRecommendationI } from '@interfaces/user-recommendation.interface';

describe('DashboardService', () => {
  let httpTestingController: HttpTestingController;
  let dashboardService: DashboardService;
  const serviceI = { id: 1, category_id: 1, name: 'Тестовая услуга' };
  const categoryI = { id: 1, name: 'Тестовая категория' };
  const recommendation = { id: 1, title: 'Рекоммендация', link: '', order: 1 } as UserRecommendationI;
  const dashboardI = {
    services: [serviceI],
    categories: [categoryI],
    user_recommendations: [recommendation]
  };
  const expectedResult: DashboardI = {
    services: [ServiceFactory.create(serviceI)],
    categories: [CategoryFactory.create(categoryI)],
    user_recommendations: [recommendation]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    dashboardService = TestBed.get(DashboardService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(dashboardService).toBeTruthy();
  });

  describe('#loadAll', () => {
    const getAllUri = `${environment.serverUrl}/api/v1/dashboard`;

    it('should return Observable with dashboard data', () => {
      dashboardService.loadAll().subscribe(result => {
        expect(result).toEqual(expectedResult);
      });

      httpTestingController.expectOne({
        method: 'GET',
        url: getAllUri
      }).flush(dashboardI);
    });
  });
});
