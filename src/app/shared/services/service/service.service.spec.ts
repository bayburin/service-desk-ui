import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { environment } from 'environments/environment';
import { ServiceI } from '@interfaces/service.interface';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';
import { ServiceService } from './service.service';
import { SearchSortingPipe } from '@shared/pipes/search-sorting/search-sorting.pipe';
import { CategoryFactory } from '@modules/ticket/factories/category.factory';
import { TicketFactory } from '@modules/ticket/factories/tickets/ticket.factory';
import { Service } from '@modules/ticket/models/service/service.model';
import { Category } from '@modules/ticket/models/category/category.model';
import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';
import { Question } from '@modules/ticket/models/question/question.model';
import { TicketDataI } from '../ticket/ticket.service';

describe('ServiceService', () => {
  let httpTestingController: HttpTestingController;
  let serviceService: ServiceService;
  let sortPipe: SearchSortingPipe;
  let category: Category;
  let serviceI: ServiceI;
  let service: Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SearchSortingPipe]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    serviceService = TestBed.get(ServiceService);
    sortPipe = TestBed.get(SearchSortingPipe);

    category = CategoryFactory.create({ id: 1, name: 'My category' });
    serviceI = { id: 2, category_id: category.id, name: 'My service' } as ServiceI;
    service = ServiceFactory.create(serviceI);
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
    let loadServiceUri: string;
    // let ticketI: TicketI;
    // let ticket: Ticket;

    beforeEach(() => {
      loadServiceUri = `${environment.serverUrl}/api/v1/categories/${category.id}/services/${service.id}`;
      // ticketI = { id: 1, service_id: service.id } as TicketI;
      // ticket = TicketFactory.create(TicketTypes.CASE, ticketI);
      // serviceI.tickets = [ticketI];
      // service.tickets = [ticket];
    });

    it('should return Observable with Service data', () => {
      serviceService.loadService(category.id, service.id).subscribe(data => {
        expect(data).toEqual(service);
      });

      httpTestingController.expectOne({
        method: 'GET',
        url: loadServiceUri
      }).flush(serviceI);
    });

    // it('should filter tickets array into Service object', () => {
    //   const spy = spyOn(sortPipe, 'transform');

    //   serviceService.loadService(category.id, service.id).subscribe(() => {
    //     expect(spy).toHaveBeenCalledWith(service.tickets);
    //   });

    //   httpTestingController.expectOne({
    //     method: 'GET',
    //     url: loadServiceUri
    //   }).flush(serviceI);
    // });

    it('should emit Service data to service subject', () => {
      const spy = spyOn((serviceService as any).service$, 'next');

      serviceService.loadService(category.id, service.id).subscribe(data => {
        expect(spy).toHaveBeenCalledWith(data);
      });

      httpTestingController.expectOne({
        method: 'GET',
        url: loadServiceUri
      }).flush(serviceI);
    });

    it('should set service data in "service" attribute', () => {
      serviceService.loadService(category.id, service.id).subscribe(data => {
        expect(serviceService.service).toEqual(service);
      });

      httpTestingController.expectOne({
        method: 'GET',
        url: loadServiceUri
      }).flush(serviceI);
    });

    describe('with "caching" flag', () => {
      it('should set into "returnCached" attribute true value', () => {
        serviceService.loadService(category.id, service.id, true).subscribe(data => {
          expect(data).toEqual(service);
          expect((serviceService as any).returnCached).toBeTruthy();
        });

        httpTestingController.expectOne({
          method: 'GET',
          url: loadServiceUri
        }).flush(serviceI);
      });
    });

    describe('with "returnCache" attribute', () => {
      beforeEach(() => {
        serviceService.loadService(category.id, service.id, true).subscribe();
        httpTestingController.expectOne({
          method: 'GET',
          url: loadServiceUri
        }).flush(serviceI);
      });

      it('should return cached service', () => {
        serviceService.loadService(category.id, service.id).subscribe(data => {
          expect(data).toEqual(service);
        });

        httpTestingController.expectNone({
          method: 'GET',
          url: loadServiceUri
        });
      });

      it('should set into "returnCached" attribute false value', () => {
        serviceService.loadService(category.id, service.id).subscribe(() => {
          expect((serviceService as any).returnCached).toBeFalsy();
        });
      });

      it('should emit Service data to service subject', () => {
        const spy = spyOn((serviceService as any).service$, 'next');

        serviceService.loadService(category.id, service.id).subscribe(data => {
          expect(spy).toHaveBeenCalledWith(data);
        });
      });
    });
  });

  describe('Operations with tickets', () => {
    let question: Question;
    const newTickets: TicketDataI = {} as TicketDataI;

    beforeEach(() => {
      question = TicketFactory.create(TicketTypes.QUESTION, { id: 10, name: 'Новый вопрос' })
      newTickets.questions = [question];
      serviceService.service = service;
      serviceService.addTickets(newTickets);
    });

    describe('#addTickets', () => {
      it('should add tickets to "questions" array', () => {
        expect(serviceService.service.questions).toContain(question);
      });
    });

    describe('#replaceQuestions', () => {
      let ticket: Question;
      let correction: Question;

      beforeEach(() => {
        ticket = TicketFactory.create(TicketTypes.QUESTION, { id: 1, ticket: { name: 'Тестовый вопрос' } });
        question = TicketFactory.create(TicketTypes.QUESTION, { id: ticket.id, ticket: { name: 'Тестовый вопрос. Новая редакция' } });
        correction = TicketFactory.create(TicketTypes.QUESTION, { id: 2, ticket: { name: 'Тестовый вопрос. Старая редакция.' } });
        service.questions = [ticket];
      });

      it('should replace ticket', () => {
        serviceService.replaceQuestion(ticket.id, question);

        expect(service.questions[0]).toEqual(question);
      });

      it('should not replace ticket if its not found', () => {
        serviceService.replaceQuestion(ticket.id + 1, question);

        expect(service.questions[0]).not.toEqual(question);
      });

      it('should set "original" attribute if correction exists', () => {
        ticket.correction = correction;
        serviceService.replaceQuestion(ticket.correction.id, question);

        expect((service.questions[0] as Question).correction).toEqual(question);
        expect((service.questions[0] as Question).correction.original).toEqual(ticket);
      });
    });

    describe('#removeQuestions', () => {
      it('should remove tickets from "tickets" array', () => {
        serviceService.removeQuestions([question]);

        expect(serviceService.service.questions).not.toContain(question);
      });
    });

    describe('#removeDraftTickets', () => {
      let draftTicket: Question;

      beforeEach(() => {
        draftTicket = TicketFactory.create(TicketTypes.QUESTION, { id: 3, ticket: { state: 'draft', name: 'Тестовый вопрос 3' } });
        service.questions.push(draftTicket);
      });

      it('should remove tickets from "tickets" array which have draft state', () => {
        serviceService.removeDraftTickets();

        expect(serviceService.service.questions).toContain(question);
        expect(serviceService.service.questions).not.toContain(draftTicket);
      });
    });
  });

  describe('#getNodeName', () => {
    it('should return Observale with service name when service exists', () => {
      (serviceService as any).service$.next(service);
      serviceService.getNodeName().subscribe(result => {
        expect(result).toEqual(service.name);
      });
      (serviceService as any).service$.next(service);
    });

    it('should return Observale with service name when service not exist', () => {
      serviceService.getNodeName().subscribe(result => {
        expect(result).toEqual('');
      });

      (serviceService as any).service$.next(null);
    });
  });

  describe('#getParentNodeName', () => {
    beforeEach(() => {
      service.category = category;
    });

    it('should return Observale with service name when service exists', () => {
      (serviceService as any).service$.next(service);
      serviceService.getParentNodeName().subscribe(result => {
        expect(result).toEqual(category.name);
      });
      (serviceService as any).service$.next(service);
    });

    it('should return Observale with service name when service not exist', () => {
      serviceService.getParentNodeName().subscribe(result => {
        expect(result).toEqual('');
      });

      (serviceService as any).service$.next(null);
    });
  });
});
