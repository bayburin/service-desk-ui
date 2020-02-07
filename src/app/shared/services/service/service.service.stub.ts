import { of } from 'rxjs';

import { Service } from '@modules/ticket/models/service/service.model';

export class StubServiceService {
  service: Service;

  loadServices() {}
  loadService() {}
  loadTags() { return of([]); }
  addTickets() {}
  replaceTicket() {}
  removeTickets() {}
  removeDraftTickets() {}
  getParentNodeName() { return of('Программные комплексы (из сервиса)'); }
  getNodeName() { return of('nanoCad'); }
}
