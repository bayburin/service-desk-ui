import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { TicketService } from '@shared/services/ticket/ticket.service';
import { ServiceService } from '@shared/services/service/service.service';
import { Service } from '@modules/ticket/models/service/service.model';
import { contentBlockAnimation } from '@animations/content.animation';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';

@Component({
  selector: 'app-tickets-page',
  templateUrl: './tickets.page.html',
  styleUrls: ['./tickets.page.sass'],
  animations: [contentBlockAnimation]
})
export class TicketsPageComponent implements OnInit {
  loading = false;
  service: Service;
  draftTickets: Ticket[];

  constructor(
    private serviceService: ServiceService,
    private ticketService: TicketService
  ) { }

  ngOnInit() {
    this.service = this.serviceService.service;
    this.loadAllTickets();
  }

  private loadAllTickets() {
    this.loading = true;
    this.ticketService.loadDraftTicketsFor(this.service)
      .pipe(finalize(() => this.loading = false))
      .subscribe((tickets: Ticket[]) => {
        this.draftTickets = tickets;
        this.service.tickets = this.draftTickets.concat(this.service.tickets);
      });
  }
}
