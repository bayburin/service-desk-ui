import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPageComponent } from './pages/dashboard/dashboard.page';
import { CategoriesPageComponent } from './pages/categories/categories.page';
import { CategoriesOverviewPageComponent } from './pages/categories-overwiev/categories-overview.page';
import { ServicesPageComponent } from './pages/services/services.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardPageComponent
  },
  {
    path: 'categories',
    component: CategoriesPageComponent,
    data: {
      breadcrumb: 'Категории'
    },
    children: [
      {
        path: '',
        component: CategoriesOverviewPageComponent
      },
      {
        path: ':id/services',
        component: ServicesPageComponent,
        data: {
          breadcrumb: 'Услуги'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketRoutingModule { }
