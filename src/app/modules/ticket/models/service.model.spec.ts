import { Category } from '@modules/ticket/models/category.model';
import { CategoryI } from '@interfaces/category.interface';
import { Service } from './service.model';
import { ServiceI } from '@interfaces/service.interface';
import { TicketI } from '@interfaces/ticket.interface';
import { Ticket } from './ticket/ticket.model';

describe('Service', () => {
  let serviceI: ServiceI;
  let service: Service;
  const ticketI = {
    id: 2,
    name: 'Тестовый вопорс',
    ticket_type: 'question'
  } as TicketI;
  const categoryI = {
    id: 3,
    name: 'Тестовая категория'
  } as CategoryI;

  beforeEach(() => {
    serviceI = {
      id: 1,
      category_id: categoryI.id,
      name: 'Тестовая услуга',
      short_description: 'Тестовое описание',
      install: '',
      is_sla: true,
      popularity: 23,
      tickets: [ticketI],
      category: categoryI
    } as ServiceI;
  });

  describe('Constructor', () => {
    it('should create instance of Service', () => {
      expect(new Service(serviceI)).toBeTruthy();
    });

    it('should accept values', () => {
      service = new Service(serviceI);

      expect(service.id).toEqual(serviceI.id);
      expect(service.categoryId).toEqual(serviceI.category_id);
      expect(service.name).toEqual(serviceI.name);
      expect(service.shortDescription).toEqual(serviceI.short_description);
      expect(service.install).toEqual(serviceI.install);
      expect(service.isSla).toEqual(serviceI.is_sla);
      expect(service.popularity).toEqual(serviceI.popularity);
    });

    it('should create instances of nested tickets', () => {
      service = new Service(serviceI);

      expect(service.tickets[0] instanceof Ticket).toBeTruthy();
    });

    it('should create instances of parent category', () => {
      service = new Service(serviceI);

      expect(service.category instanceof Category).toBeTruthy();
    });
  });

  describe('For existing service', () => {
    beforeEach(() => {
      service = new Service(serviceI);
    });

    describe('#getShowLink', () => {
      it('should return link to view category details', () => {
        expect(service.getShowLink()).toEqual(`/categories/${service.categoryId}/services/${service.id}`);
      });
    });

    describe('#pageComponent', () => {
      it('should return name of component', () => {
        expect(service.pageComponent()).toEqual('app-service-page-content');
      });
    });
  });
});
