import { of, BehaviorSubject } from 'rxjs';

import { Service } from '@modules/ticket/models/service/service.model';

export class StubServiceService {
  service: Service;
  service$ = new BehaviorSubject<Service>(this.service);

  loadServices() {}
  loadService() {}
  loadTags() { return of([]); }
  addTickets() {}
  replaceQuestion() {}
  removeQuestions() {}
  removeDraftTickets() {}
  getParentNodeName() { return of('Программные комплексы (из сервиса)'); }
  getNodeName() { return of('nanoCad'); }
}
