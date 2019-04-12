import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { TicketService } from '@shared/services/ticket/ticket.service';
import { TicketI } from '@models/ticket.interface';

@Component({
  selector: 'app-tickets-page',
  templateUrl: './tickets.page.html',
  styleUrls: ['./tickets.page.scss']
})
export class TicketsPageComponent implements OnInit {
  public loading = false;
  public tickets: Observable<TicketI[]>;

  constructor(private ticketService: TicketService, private route: ActivatedRoute) { }

  ngOnInit() {
    const serviceId = this.route.snapshot.params.id;

    this.loading = true;
    this.tickets = this.ticketService.loadTickets(serviceId).pipe(finalize(() => this.loading = false));
  }

  isNoAnswers(ticket): boolean {
    return ticket.answers.length === 0;
  }
}
