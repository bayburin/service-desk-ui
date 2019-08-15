import { Service } from '@modules/ticket/models/service/service.model';

export class ServiceFactory {
  static create(params) {
    return new Service(params);
  }
}
