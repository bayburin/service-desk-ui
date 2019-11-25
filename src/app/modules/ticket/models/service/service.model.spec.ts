import { UserFactory } from '@shared/factories/user.factory';
import { ResponsibleUserI } from '@interfaces/responsible-user.interface';
import { Category } from '@modules/ticket/models/category/category.model';
import { CategoryI } from '@interfaces/category.interface';
import { Service } from './service.model';
import { ServiceI } from '@interfaces/service.interface';
import { TicketI } from '@interfaces/ticket.interface';
import { Ticket } from '../ticket/ticket.model';
import { ResponsibleUserDetailsI } from '@interfaces/responsible_user_details.interface';

describe('Service', () => {
  let serviceI: ServiceI;
  let service: Service;
  let ticketI: TicketI;
  let categoryI: CategoryI;
  let responsibleUserI: ResponsibleUserI;

  beforeEach(() => {
    ticketI = {
      id: 2,
      name: 'Тестовый вопорс',
      ticket_type: 'question'
    } as TicketI;
    categoryI = {
      id: 3,
      name: 'Тестовая категория'
    } as CategoryI;
    responsibleUserI = {
      id: 1,
      tn: 123,
      responseable_type: 'Service',
      responseable_id: 1
    } as ResponsibleUserI;
    serviceI = {
      id: 1,
      category_id: categoryI.id,
      name: 'Тестовая услуга',
      short_description: 'Тестовое описание',
      install: '',
      is_hidden: false,
      has_common_case: true,
      popularity: 23,
      tickets: [ticketI],
      category: categoryI,
      responsible_users: [responsibleUserI]
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
      expect(service.isHidden).toEqual(serviceI.is_hidden);
      expect(service.hasCommonCase).toEqual(serviceI.has_common_case);
      expect(service.popularity).toEqual(serviceI.popularity);
      expect(service.responsibleUsers).toEqual([responsibleUserI]);
    });

    it('should create instances of nested tickets', () => {
      service = new Service(serviceI);

      expect(service.tickets[0] instanceof Ticket).toBeTruthy();
    });

    it('should create instances of parent category', () => {
      service = new Service(serviceI);

      expect(service.category instanceof Category).toBeTruthy();
    });

    describe('when tickets is undefined', () => {
      beforeEach(() => {
        serviceI.tickets = undefined;
      });

      it('should create empty array', () => {
        service = new Service(serviceI);

        expect(service.tickets.length).toEqual(0);
      });
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

  describe('#isBelongsTo', () => {
    const tn = 1;
    const user = UserFactory.create({ tn: 1 });

    beforeEach(() => {
      service = new Service(serviceI);
      service.responsibleUsers.forEach(responsible => responsible.tn = tn );
    });

    it('should return true if user tn exists in "responsible_users" array', () => {
      expect(service.isBelongsTo(user)).toBeTruthy();
    });

    it('should return false if user tn not exists in "responsible_users" array', () => {
      user.tn = 17_664;

      expect(service.isBelongsTo(user)).toBeFalsy();
    });
  });

  describe('#isBelongsByTicketTo', () => {
    const tn = 1;
    const user = UserFactory.create({ tn: 1 });

    beforeEach(() => {
      ticketI.responsible_users = [{ tn } as ResponsibleUserI];
      service = new Service(serviceI);
    });

    it('should return true if user tn exists in "responsible_users" array of nested tickets', () => {
      expect(service.isBelongsByTicketTo(user)).toBeTruthy();
    });

    it('should return false if user tn not exists in "responsible_users" array', () => {
      user.tn = 17_664;

      expect(service.isBelongsByTicketTo(user)).toBeFalsy();
    });
  });

  describe('#getResponsibleUsersTn', () => {
    beforeEach(() => {
      service = new Service(serviceI);
      service.tickets[0].responsibleUsers.push({ tn: 12345 } as ResponsibleUserI);
    });

    it('should return array of "tn" attributes', () => {
      expect(service.getResponsibleUsersTn()).toEqual([responsibleUserI.tn, 12345]);
    });
  });

  describe('#associateResponsibleUserDetails', () => {
    const details = [
      { tn: 123, full_name: 'ФИО 1' } as ResponsibleUserDetailsI,
      { tn: 12345, full_name: 'ФИО 2' } as ResponsibleUserDetailsI
    ];
    let ticket: Ticket;

    beforeEach(() => {
      service = new Service(serviceI);
      ticket = service.tickets[0];
      ticket.responsibleUsers.push({ tn: 12345 } as ResponsibleUserI);
    });

    it('should associate "responsibleUsers -> details" attribute with data from occured array', () => {
      service.associateResponsibleUserDetails(details);

      expect(service.responsibleUsers[0].details).toEqual(details[0]);
    });

    it('should call "associateResponsibleUserDetails" for nested tickets', () => {
      spyOn(ticket, 'associateResponsibleUserDetails');
      service.associateResponsibleUserDetails(details);

      expect(ticket.associateResponsibleUserDetails).toHaveBeenCalledWith(details);
    });
  });
});
