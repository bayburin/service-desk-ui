import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';

import { AdminTicketRoutingModule } from './admin-ticket-routing.module';
import { NewTicketComponent } from './components/new-ticket/new-ticket.component';
import { TicketsPageComponent } from './pages/tickets/tickets.page';

@NgModule({
  declarations: [NewTicketComponent, TicketsPageComponent],
  imports: [
    CommonModule,
    AdminTicketRoutingModule,
    SharedModule,
    NgSelectModule
  ]
})
export class AdminTicketModule { }
