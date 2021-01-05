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

  it('should sort array in order: Category -> Service -> Claim -> Question', () => {
    const category = CategoryFactory.create({ name: 'category' });
    const service = ServiceFactory.create({ name: 'service' });
    const claim = TicketFactory.create(TicketTypes.CLAIM_FORM, { ticket: { name: 'claim' } });
    const question = TicketFactory.create(TicketTypes.QUESTION, { ticket: { name: 'question' } });
    const arr = [service, category, question, claim];

    expect(pipe.transform(arr)).toEqual([category, service, claim, question]);
  });

  describe('when gives claim_forms', () => {
    it('should sort array by popularity', () => {
      const claimForm1 = TicketFactory.create(TicketTypes.CLAIM_FORM, { ticket: { name: 'claim 1', popularity: 10 } });
      const claimForm2 = TicketFactory.create(TicketTypes.CLAIM_FORM, { ticket: { name: 'claim 2', popularity: 20 } });

      expect(pipe.transform([claimForm1, claimForm2])).toEqual([claimForm2, claimForm1]);
    });
  });

  describe('when gives questions', () => {
    it('should sort array by popularity', () => {
      const question1 = TicketFactory.create(TicketTypes.QUESTION, { ticket: { name: 'question 1', popularity: 10 } });
      const question2 = TicketFactory.create(TicketTypes.QUESTION, { ticket: { name: 'question 2', popularity: 20 } });

      expect(pipe.transform([question1, question2])).toEqual([question2, question1]);
    });
  });
});
