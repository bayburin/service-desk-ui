import { ServiceTemplateCreator } from './service-template-creator';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { Service } from '@modules/ticket/models/service/service.model';
import { Category } from '@modules/ticket/models/category/category.model';
import { ServiceTemplateI } from '@interfaces/service-template.interface';

describe('ServiceTemplateCreator', () => {
  it('should call TicketFactory', () => {
    const object = {
      id: 1,
      name: 'Тестовый услуга',
      service_id: 1,
      ticket_type: 'question'
    } as ServiceTemplateI;
    const result = ServiceTemplateCreator.createBy(object);

    expect(result instanceof Ticket).toBeTruthy();
  });

  it('should call ServiceFactory', () => {
    const object = {
      id: 1,
      name: 'Тестовый вопрос',
      category_id: 1,
    } as ServiceTemplateI;
    const result = ServiceTemplateCreator.createBy(object);

    expect(result instanceof Service).toBeTruthy();
  });

  it('should call CategoryFactory', () => {
    const object = {
      id: 1,
      name: 'Тестовый вопрос',
    } as ServiceTemplateI;
    const result = ServiceTemplateCreator.createBy(object);

    expect(result instanceof Category).toBeTruthy();
  });
});
