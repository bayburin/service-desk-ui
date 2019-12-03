import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResponsibleGuard } from '@guards/responsible/responsible.guard';
import { NewTicketComponent } from './components/new-ticket/new-ticket.component';
import { ServicePolicy } from '@shared/policies/service/service.policy';
import { TicketsPageComponent } from './pages/tickets/tickets.page';
import { EditTicketComponent } from './components/edit-ticket/edit-ticket.component';
import { TicketResolver } from './resolvers/resolvers/ticket.resolver';

const routes: Routes = [
  {
    path: 'tickets',
    component: TicketsPageComponent,
    canActivate: [ResponsibleGuard],
    data: {
      policy: ServicePolicy,
      action: 'newTicket'
    },
    children: [
      {
        path: 'new',
        component: NewTicketComponent,
        canActivate: [ResponsibleGuard],
        data: {
          policy: ServicePolicy,
          action: 'newTicket'
        }
      },
      {
        path: ':id/edit',
        component: EditTicketComponent,
        canActivate: [ResponsibleGuard],
        resolve: { ticket: TicketResolver },
        data: {
          policy: ServicePolicy,
          action: 'newTicket',
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [TicketResolver]
})
export class AdminTicketRoutingModule { }