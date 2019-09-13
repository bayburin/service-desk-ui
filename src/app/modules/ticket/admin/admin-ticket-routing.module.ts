import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResponsibleGuard } from '@guards/responsible/responsible.guard';
import { NewTicketComponent } from './components/new-ticket/new-ticket.component';
import { ServicePolicy } from '@shared/policies/service/service.policy';
import { TicketsPageComponent } from './pages/tickets/tickets.page';

const routes: Routes = [
  {
    path: 'tickets',
    component: TicketsPageComponent,
    canActivate: [ResponsibleGuard],
    data: {
      policy: ServicePolicy,
      action: 'newTicket'
    }
  }
  // {
  //   path: 'services/new_ticket',
  //   component: NewTicketComponent,
  //   canActivate: [ResponsibleGuard],
  //   data: {
  //     policy: ServicePolicy,
  //     action: 'newTicket'
  //   }
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminTicketRoutingModule { }
