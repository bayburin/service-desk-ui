import { Component, OnInit, OnDestroy } from '@angular/core';
import { finalize, tap, switchMap } from 'rxjs/operators';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';

import { TicketService } from '@shared/services/ticket/ticket.service';
import { ServiceService } from '@shared/services/service/service.service';
import { Service } from '@modules/ticket/models/service/service.model';
import { contentBlockAnimation } from '@animations/content.animation';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { ResponsibleUserService } from '@shared/services/responsible_user/responsible-user.service';

@Component({
  selector: 'app-tickets-page',
  templateUrl: './tickets.page.html',
  styleUrls: ['./tickets.page.sass'],
  animations: [contentBlockAnimation]
})
export class TicketsPageComponent implements OnInit, OnDestroy {
  loading = false;
  service: Service;
  private routeSub: Subscription;

  constructor(
    private serviceService: ServiceService,
    private ticketService: TicketService,
    private router: Router,
    private responsibleUserService: ResponsibleUserService
  ) { }

  ngOnInit() {
    this.service = this.serviceService.service;
    this.loadAllTickets();

    this.routeSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart && !event.url.includes('/admin')) {
        this.serviceService.removeTickets(this.ticketService.draftTickets);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  private loadAllTickets() {
    this.loading = true;
    this.ticketService.loadDraftTicketsFor(this.service)
      .pipe(
        finalize(() => this.loading = false),
        tap((tickets: Ticket[]) => this.serviceService.addTickets(tickets)),
        switchMap(tickets => {
          const tns = tickets.flatMap(ticket => ticket.getResponsibleUsersTn());
          
          return this.responsibleUserService.loadDetails(tns)
            .pipe(tap(details => tickets.forEach(ticket => ticket.associateResponsibleUserDetails(details))))
        })
      )
      .subscribe();
  }
}
