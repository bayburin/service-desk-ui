import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminTicketRoutingModule } from './admin-ticket-routing.module';
import { NewTicketComponent } from './components/new-ticket/new-ticket.component';


@NgModule({
  declarations: [NewTicketComponent],
  imports: [
    CommonModule,
    AdminTicketRoutingModule
  ]
})
export class AdminTicketModule { }
