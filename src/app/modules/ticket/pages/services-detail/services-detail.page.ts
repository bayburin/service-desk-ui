import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { ServiceService } from '@shared/services/service/service.service';
import { ServiceI } from '@models/service.interface';
import { TicketI } from '@models/ticket.interface';

@Component({
  selector: 'app-services-detail-page',
  templateUrl: './services-detail.page.html',
  styleUrls: ['./services-detail.page.scss']
})
export class ServicesDetailPageComponent implements OnInit {
  public loading = false;
  public service: ServiceI;

  constructor(private serviceService: ServiceService, private route: ActivatedRoute) { }

  ngOnInit() {
    const categoryId = this.route.parent.snapshot.params.id;
    const serviceId = this.route.snapshot.params.id;
    const ticketId = this.route.snapshot.queryParams.ticket;

    this.loading = true;
    this.serviceService.loadService(categoryId, serviceId)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        (service: ServiceI) => {
          this.service = service;

          setTimeout(() => {
            if (ticketId) {
              this.toggleTicket(service.tickets.find(ticket => ticket.id == ticketId));
              this.scrollToTicket(ticketId);
            }

          }, 200);
        }
      );
  }

  /**
   * "Раскрывает" вопрос.
   */
  toggleTicket(ticket: TicketI): void {
    ticket.open = !ticket.open;
  }

  /**
   * Перемещает экран к указанному Id.
   *
   * @param ticketId - id элемента
   */
  private scrollToTicket(ticketId): void {
    const el = document.getElementById(ticketId);
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
