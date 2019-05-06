import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPageComponent } from './pages/dashboard/dashboard.page';
import { CategoriesPageComponent } from './pages/categories/categories.page';
import { CategoriesOverviewPageComponent } from './pages/categories-overwiev/categories-overview.page';
import { SearchPageComponent } from './pages/search/search.page';
import { CategoriesDetailPageComponent } from './pages/categories-detail/categories-detail.page';
import { CategoryService } from '@shared/services/category/category.service';
import { ServicesDetailPageComponent } from './pages/services-detail/services-detail.page';
import { ServiceService } from '@shared/services/service/service.service';
import { ServicesOverwievPageComponent } from './pages/services-overwiev/services-overwiev.page';

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
      }
    ]
  },
  {
    path: 'categories/:id',
    component: CategoriesPageComponent,
    data: { breadcrumb: [CategoryService, ServiceService] },
    children: [
      {
        path: 'services/:id',
        component: ServicesDetailPageComponent,
        data: { breadcrumb: ServiceService }
      }
    ]
  },
  {
    path: 'services',
    component: ServicesOverwievPageComponent,
    data: { breadcrumb: 'Все вопросы' }
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
