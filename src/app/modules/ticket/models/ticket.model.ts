import { Service } from '@modules/ticket/models/service.model';
import { CommonServiceI } from '@interfaces/common-service.interface';

export class Ticket implements CommonServiceI {
  id: number;
  serviceId: number;
  name: string;
  shortDescription: string;
  popularity: number;
  service: Service;
  open: boolean;

  constructor(ticket: any = {}) {
    this.id = ticket.serviceId || null;
    this.serviceId = ticket.service_id || null;
    this.name = ticket.name || '';
    this.shortDescription = ticket.short_description || '';
    this.popularity = ticket.popularity || 0;
    this.service = ticket.service || null;
  }

  getShowLink(): string {
    return '';
  }
}
