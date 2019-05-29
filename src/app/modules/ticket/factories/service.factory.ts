import { Service } from '@modules/ticket/models/service.model';

export class ServiceFactory {
  static create(params) {
    return new Service(params);
  }
}
