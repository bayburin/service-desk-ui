import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPageComponent } from './pages/dashboard/dashboard.page';
import { CategoriesPageComponent } from './pages/categories/categories.page';
import { CategoriesOverviewPageComponent } from './pages/categories-overwiev/categories-overview.page';
import { ServicesPageComponent } from './pages/services/services.page';
// import { ServiceProxyComponent } from './components/service-proxy/service-proxy.component';
import { SearchPageComponent } from './pages/search/search.page';
import { CategoriesDetailPageComponent } from './pages/categories-detail/categories-detail.page';
import { CategoryService } from '@shared/services/category/category.service';
import { ServicesDetailPageComponent } from './pages/services-detail/services-detail.page';
import { ServiceService } from '@shared/services/service/service.service';

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
        path: ':id',
        component: CategoriesDetailPageComponent,
        data: { breadcrumb: CategoryService }
      },
      {
        path: ':id/services',
        component: ServicesPageComponent,
        children: [
          {
            path: ':id',
            component: ServicesDetailPageComponent,
            data: { breadcrumb: ServiceService }
          }
        ]
      }
    ]
  },
  // {
  //   path: 'services/:id',
  //   component: ServicesPageComponent,
  //   data: { breadcrumb: [TicketService, AnswerService] },
  //   children: [
  //     {
  //       path: '',
  //       component: ServiceProxyComponent
  //     },
  //     {
  //       path: 'tickets/:id',
  //       component: AnswersPageComponent,
  //       data: { breadcrumb: AnswerService }
  //     }
  //   ]
  // },
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
