import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResponsibleGuard } from '@guards/responsible/responsible.guard';
import { NewTicketPageComponent } from './pages/new-ticket/new-ticket.page';
import { ServicePolicy } from '@shared/policies/service/service.policy';
import { TicketsPageComponent } from './pages/tickets/tickets.page';
import { EditTicketPageComponent } from './pages/edit-ticket/edit-ticket.page';
import { TicketResolver } from './resolvers/resolvers/ticket.resolver';
import { TicketsDetailPageComponent } from './pages/tickets-detail/tickets-detail.page';

const routes: Routes = [
  {
    path: 'tickets',
    component: TicketsPageComponent,
    canActivate: [ResponsibleGuard],
    data: {
      policy: ServicePolicy,
      action: 'newTicket',
      breadcrumb: 'Администрирование'
    },
    children: [
      {
        path: '',
        component: TicketsDetailPageComponent,
        canActivate: [ResponsibleGuard],
        data: {
          policy: ServicePolicy,
          action: 'newTicket'
        },
      },
      {
        path: 'new',
        component: NewTicketPageComponent,
        canActivate: [ResponsibleGuard],
        data: {
          policy: ServicePolicy,
          action: 'newTicket'
        }
      },
      {
        path: ':id/edit',
        component: EditTicketPageComponent,
        canActivate: [ResponsibleGuard],
        resolve: { ticket: TicketResolver },
        data: {
          policy: ServicePolicy,
          action: 'newTicket'
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
