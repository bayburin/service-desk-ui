import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { environment } from 'environments/environment';
import { TicketI } from '@interfaces/ticket.interface';
import { ServiceI } from '@interfaces/service.interface';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';
import { ServiceService } from './service.service';
import { SearchSortingPipe } from '@shared/pipes/search-sorting/search-sorting.pipe';
import { CategoryFactory } from '@modules/ticket/factories/category.factory';
import { TicketFactory } from '@modules/ticket/factories/ticket.factory';

describe('ServiceService', () => {
  let httpTestingController: HttpTestingController;
  let serviceService: ServiceService;
  let sortPipe: SearchSortingPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SearchSortingPipe]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    serviceService = TestBed.get(ServiceService);
    sortPipe = TestBed.get(SearchSortingPipe);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(serviceService).toBeTruthy();
  });

  describe('#loadServices', () => {
    const loadServicesUri = `${environment.serverUrl}/api/v1/services`;
    const returnedService = { id: 1 } as ServiceI;
    const expectedServices = [ServiceFactory.create(returnedService)];

    it('should return Observable with array of Service data', () => {
      serviceService.loadServices().subscribe(result => {
        expect(result).toEqual(expectedServices);
      });

      httpTestingController.expectOne({
        method: 'GET',
        url: loadServicesUri
      }).flush([returnedService]);
    });
  });

  describe('#loadService', () => {
    const category = CategoryFactory.create({ id: 1, name: 'My category' });
    const serviceI = { id: 2, category_id: category.id, name: 'My service' } as ServiceI;
    const service = ServiceFactory.create(serviceI);
    const ticketI = { id: 1, service_id: service.id, ticket_type: 'case', answers: [] } as TicketI;
    const ticket = TicketFactory.create(ticketI);
    serviceI.tickets = [ticketI];
    service.tickets = [ticket];
    const loadServiceUri = `${environment.serverUrl}/api/v1/categories/${category.id}/services/${service.id}`;

    it('should return Observable with Service data', () => {
      serviceService.loadService(category.id, service.id).subscribe(data => {
        expect(data).toEqual(service);
      });

      httpTestingController.expectOne({
        method: 'GET',
        url: loadServiceUri
      }).flush(serviceI);
    });

    it('should filter tickets array into Service object', () => {
      const spy = spyOn(sortPipe, 'transform');

      serviceService.loadService(category.id, service.id).subscribe(() => {
        expect(spy).toHaveBeenCalledWith(service.tickets);
      });

      httpTestingController.expectOne({
        method: 'GET',
        url: loadServiceUri
      }).flush(serviceI);
    });

    it('should emit Service data to service subject', () => {
      const spy = spyOn((serviceService as any).service, 'next');

      serviceService.loadService(category.id, service.id).subscribe(data => {
        expect(spy).toHaveBeenCalledWith(data);
      });

      httpTestingController.expectOne({
        method: 'GET',
        url: loadServiceUri
      }).flush(serviceI);
    });
  });

  describe('#getNodeName', () => {
    it('should return Observale with service name when service exists', () => {
      const serviceI = { id: 2, category_id: 1, name: 'My service' } as ServiceI;
      const service = ServiceFactory.create(serviceI);

      serviceService.getNodeName().subscribe(result => {
        expect(result).toEqual(service.name);
      });

      (serviceService as any).service.next(service);
    });

    it('should return Observale with service name when service not exist', () => {
      serviceService.getNodeName().subscribe(result => {
        expect(result).toEqual('');
      });

      (serviceService as any).service.next(null);
    });
  });

  describe('#getParentNodeName', () => {
    const category = CategoryFactory.create({ id: 1, name: 'My category' });
    const service = ServiceFactory.create({ id: 2, category_id: category.id, name: 'My service' });
    service.category = category;

    it('should return Observale with service name when service exists', () => {
      serviceService.getParentNodeName().subscribe(result => {
        expect(result).toEqual(category.name);
      });

      (serviceService as any).service.next(service);
    });

    it('should return Observale with service name when service not exist', () => {
      serviceService.getParentNodeName().subscribe(result => {
        expect(result).toEqual('');
      });

      (serviceService as any).service.next(null);
    });
  });
});
