import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { TicketRoutingModule } from './ticket-routing.module';

import { DashboardPageComponent } from './pages/dashboard/dashboard.page';
import { GlobalSearchComponent } from './components/global-search/global-search.component';
import { CategoriesPageComponent } from './pages/categories/categories.page';
import { ServicesPageComponent } from './pages/services/services.page';
import { CategoriesOverviewPageComponent } from './pages/categories-overwiev/categories-overview.page';
import { TicketsPageComponent } from './pages/tickets/tickets.page';
import { AnswersPageComponent } from './pages/answers/answers.page';
import { ServiceProxyComponent } from './components/service-proxy/service-proxy.component';
import { SearchPageComponent } from './pages/search/search.page';
import { SearchResultComponent } from './components/search-result/search-result.component';
import { CategoriesDetailPageComponent } from './pages/categories-detail/categories-detail.page';

@NgModule({
  declarations: [
    DashboardPageComponent,
    GlobalSearchComponent,
    CategoriesPageComponent,
    ServicesPageComponent,
    CategoriesOverviewPageComponent,
    TicketsPageComponent,
    AnswersPageComponent,
    ServiceProxyComponent,
    SearchPageComponent,
    SearchResultComponent,
    CategoriesDetailPageComponent
  ],
  imports: [
    TicketRoutingModule,
    SharedModule
  ]
})
export class TicketModule { }
