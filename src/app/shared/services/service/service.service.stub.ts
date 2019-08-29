import { of } from 'rxjs';

export class StubServiceService {
  loadServices() {}
  loadService() {}
  getParentNodeName() { return of('Программные комплексы (из сервиса)'); }
  getNodeName() { return of('nanoCad');}
}
