import { TestBed } from '@angular/core/testing';
import { ShowOnlyMyTicketsPipe } from './show-only-my-tickets.pipe';

import { UserService } from '@shared/services/user/user.service';
import { StubUserService } from '@shared/services/user/user.service.stub';
import { TicketFactory } from '@modules/ticket/factories/tickets/ticket.factory';
import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';
import { Question } from '@modules/ticket/models/question/question.model';

describe('ShowOnlyMyTicketsPipe', () => {
  let pipe: ShowOnlyMyTicketsPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ShowOnlyMyTicketsPipe,
        { provide: UserService, useClass: StubUserService }
      ]
    });

    pipe = TestBed.get(ShowOnlyMyTicketsPipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('#transform', () => {
    let question1: Question;
    let question2: Question;
    let arr: any[];
    let spy: jasmine.Spy;

    beforeEach(() => {
      question1 = TicketFactory.create(TicketTypes.QUESTION, { ticket: { name: 'question 1' } });
      question2 = TicketFactory.create(TicketTypes.QUESTION, { ticket: { name: 'question 2' } });
      arr = [question1, question2];
      spy = spyOn(question1, 'isBelongsTo').and.returnValue(true);
    });

    it('should filter array of questions by current user if received true attribute', () => {
      expect(pipe.transform(arr, true)).toEqual([question1]);
    });

    it('should not filter array of questions if received false attribute', () => {
      expect(pipe.transform(arr, false)).toEqual(arr);
    });

    it('should filter array of questions if question has correction which is current user', () => {
      const correction = TicketFactory.create(TicketTypes.QUESTION, { ticket: { name: 'correction' } });
      question1.correction = correction;
      spy.and.returnValue(false);
      spyOn(correction, 'isBelongsTo').and.returnValue(true);

      expect(pipe.transform(arr, true)).toEqual([question1]);
    });
  });
});
