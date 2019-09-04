import { of } from 'rxjs';

import { Service } from '@modules/ticket/models/service/service.model';

export class StubServiceService {
  service: Service;

  loadServices() {}
  loadService() {}
  loadTags() { return of([]); }
  getParentNodeName() { return of('Программные комплексы (из сервиса)'); }
  getNodeName() { return of('nanoCad'); }
}
