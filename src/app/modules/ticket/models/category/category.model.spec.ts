import { TicketI } from '@interfaces/ticket.interface';
import { Category } from './category.model';
import { CategoryI } from '@interfaces/category.interface';
import { ServiceI } from '@interfaces/service.interface';
import { Service } from '@modules/ticket/models/service/service.model';
import { Ticket, TicketTypes } from '@modules/ticket/models/ticket/ticket.model';

describe('Category', () => {
  let categoryI: CategoryI;
  let category: Category;

  beforeEach(() => {
    categoryI = {
      id: 1,
      name: 'Тестовая категория',
      short_description: 'Описание',
      popularity: 23,
      icon_name: 'test-icon-name'
    };
  });

  describe('Constructor', () => {
    it('should create instance of Category', () => {
      expect(new Category(categoryI)).toBeTruthy();
    });

    it('should accept values', () => {
      category = new Category(categoryI);

      expect(category.id).toEqual(categoryI.id);
      expect(category.name).toEqual(categoryI.name);
      expect(category.shortDescription).toEqual(categoryI.short_description);
      expect(category.popularity).toEqual(categoryI.popularity);
      expect(category.iconName).toEqual(categoryI.icon_name);
    });

    it('should create instances of nested services', () => {
      const services = [{ id: 1, name: 'Тестовая услуга' } as ServiceI];
      categoryI.services = services;
      category = new Category(categoryI);

      expect(category.services[0] instanceof Service).toBeTruthy();
    });

    it('should create instances of nested tickets', () => {
      const tickets = [{ id: 1, name: 'Тестовый вопрос', ticket_type: TicketTypes.QUESTION } as TicketI];
      categoryI.faq = tickets;
      category = new Category(categoryI);

      expect(category.tickets[0] instanceof Ticket).toBeTruthy();
    });

    describe('when services is undefined', () => {
      beforeEach(() => {
        categoryI.services = undefined;
      });

      it('should create empty array', () => {
        category = new Category(categoryI);

        expect(category.services.length).toEqual(0);
      });
    });

    describe('when tickets is undefined', () => {
      beforeEach(() => {
        categoryI.faq = undefined;
      });

      it('should create empty array', () => {
        category = new Category(categoryI);

        expect(category.tickets.length).toEqual(0);
      });
    });
  });

  describe('For existing category', () => {
    beforeEach(() => {
      category = new Category(categoryI);
    });

    describe('#getShowLink', () => {
      it('should return link to view category details', () => {
        expect(category.getShowLink()).toEqual(`/categories/${category.id}`);
      });
    });

    describe('#pageComponent', () => {
      it('should return name of component', () => {
        expect(category.pageComponent()).toEqual('app-category-page-content');
      });
    });
  });
});
