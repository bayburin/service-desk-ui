import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@guards/auth/auth.guard';
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
    component: DashboardPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'categories',
    component: CategoriesPageComponent,
    canActivate: [AuthGuard],
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
    canActivate: [AuthGuard],
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
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Все вопросы' }
  },
  {
    path: 'search',
    component: SearchPageComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Поиск' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketRoutingModule { }
