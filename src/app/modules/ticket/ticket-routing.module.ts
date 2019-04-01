import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPageComponent } from './pages/dashboard/dashboard.page';
import { CategoriesPageComponent } from './pages/categories/categories.page';
import { CategoriesOverviewPageComponent } from './pages/categories-overwiev/categories-overview.page';
import { ServicesPageComponent } from './pages/services/services.page';
import { TicketsPageComponent } from './pages/tickets/tickets.page';
import { TicketService } from '@shared/services/ticket/ticket.service';
import { AnswersPageComponent } from './pages/answers/answers.page';
import { AnswerService } from '@shared/services/answer/answer.service';
import { ServiceProxyComponent } from './components/service-proxy/service-proxy.component';
import { SearchPageComponent } from './pages/search/search.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardPageComponent
  },
  {
    path: 'categories',
    component: CategoriesPageComponent,
    data: { breadcrumb: 'Категории услуг' },
    children: [
      {
        path: '',
        component: CategoriesOverviewPageComponent
      },
      {
        path: ':id/services',
        component: ServicesPageComponent,
        children: [
          {
            path: ':id',
            component: TicketsPageComponent,
            data: { breadcrumb: TicketService }
          }
        ]
      }
    ]
  },
  {
    path: 'services/:id',
    component: ServicesPageComponent,
    data: { breadcrumb: [TicketService, AnswerService] },
    children: [
      {
        path: '',
        component: ServiceProxyComponent
      },
      {
        path: 'tickets/:id',
        component: AnswersPageComponent,
        data: { breadcrumb: AnswerService }
      }
    ]
  },
  {
    path: 'search',
    component: SearchPageComponent,
    data: { breadcrumb: 'Поиск' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketRoutingModule { }
