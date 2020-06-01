import { StubQuestionService } from '@shared/services/question/question.service.stub';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { of } from 'rxjs';

import { TicketResolver } from './ticket.resolver';
import { QuestionService } from '@shared/services/question/question.service';
import { TicketFactory } from '@modules/ticket/factories/tickets/ticket.factory';
import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';
import { Question } from '@modules/ticket/models/question/question.model';

describe('TicketResolver', () => {
  let ticketResolver: TicketResolver;
  let questionService: QuestionService;
  let question: Question;
  let stubSnapshot: ActivatedRouteSnapshot;
  let stubSnapshotProxy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: QuestionService, useClass: StubQuestionService },
        TicketResolver
      ]
    });

    ticketResolver = TestBed.get(TicketResolver);
    questionService = TestBed.get(QuestionService);
    question = TicketFactory.create(TicketTypes.QUESTION, { id: 1, ticket: { service_id: 2, name: 'Тестовый вопрос' } });

    stubSnapshot = jasmine.createSpyObj<ActivatedRouteSnapshot>('ActivatedRouteSnapshot', ['parent', 'params']);
    stubSnapshotProxy = new Proxy(stubSnapshot, {
      get(target, prop) {
        if (prop === 'parent') {
          return { parent: { parent: { params: question.serviceId } } };
        } else if (prop === 'params') {
          return { id: question.id };
        }
      }
    });
  });

  it('should return Observable with loaded Ticket', () => {
    spyOn(questionService, 'loadQuestion').and.returnValue(of(question));

    ticketResolver.resolve(stubSnapshotProxy).subscribe(result => {
      expect(result).toEqual(question);
    });
  });
});
