import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResponsibleGuard } from '@guards/responsible/responsible.guard';
import { NewQuestionPageComponent } from './pages/new-question/new-question.page';
import { ServicePolicy } from '@shared/policies/service/service.policy';
import { TicketsPageComponent } from './pages/tickets/tickets.page';
import { EditQuestionPageComponent } from './pages/edit-question/edit-question.page';
import { TicketResolver } from './resolvers/resolvers/ticket.resolver';
import { TicketsDetailPageComponent } from './pages/tickets-detail/tickets-detail.page';
import { NewCasePageComponent } from './pages/new-case/new-case.page';

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
        component: NewQuestionPageComponent,
        canActivate: [ResponsibleGuard],
        data: {
          policy: ServicePolicy,
          action: 'newTicket'
        }
      },
      {
        path: ':id/edit',
        component: EditQuestionPageComponent,
        canActivate: [ResponsibleGuard],
        resolve: { question: TicketResolver },
        data: {
          policy: ServicePolicy,
          action: 'newTicket'
        }
      },
      {
        path: 'case_form/new',
        component: NewCasePageComponent,
        canActivate: [ResponsibleGuard],
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
