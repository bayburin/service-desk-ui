import { SearchSortingPipe } from './search-sorting.pipe';
import { CategoryFactory } from '@modules/ticket/factories/category.factory';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';
import { TicketFactory } from '@modules/ticket/factories/tickets/ticket.factory';
import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';

describe('SearchSortingPipe', () => {
  let pipe: SearchSortingPipe;

  beforeEach(() => {
    pipe = new SearchSortingPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should sort array in order: Category -> Service -> Case -> Question', () => {
    const category = CategoryFactory.create({ name: 'category' });
    const service = ServiceFactory.create({ name: 'service' });
    const kase = TicketFactory.create(TicketTypes.CASE, { name: 'case', ticket_type: 'case' });
    const question = TicketFactory.create(TicketTypes.QUESTION, { name: 'question', ticket_type: 'question' });
    const arr = [service, category, question, kase];

    expect(pipe.transform(arr)).toEqual([category, service, kase, question]);
  });
});
