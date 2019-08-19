import { FilterByClassPipe } from './filter-by-class.pipe';
import { CategoryFactory } from '@modules/ticket/factories/category.factory';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';
import { TicketFactory } from '@modules/ticket/factories/ticket.factory';
import { Category } from '@modules/ticket/models/category/category.model';

describe('FilterByClassPipe', () => {
  let pipe: FilterByClassPipe;

  beforeEach(() => {
    pipe = new FilterByClassPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should filter array by occured class', () => {
    const category = CategoryFactory.create({ name: 'category' });
    const service = ServiceFactory.create({ name: 'service' });
    const ticket = TicketFactory.create({ name: 'ticket', ticket_type: 'case' });
    const arr = [category, service, ticket];

    expect(pipe.transform(arr, Category)).toEqual([category]);
  });
});
