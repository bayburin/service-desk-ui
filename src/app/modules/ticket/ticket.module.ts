import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { TicketRoutingModule } from './ticket-routing.module';

import { DashboardPageComponent } from './pages/dashboard/dashboard.page';
import { GlobalSearchComponent } from './components/global-search/global-search.component';
import { CategoriesPageComponent } from './pages/categories/categories.page';
import { ServicesPageComponent } from './pages/services/services.page';
import { CategoriesOverviewPageComponent } from './pages/categories-overwiev/categories-overview.page';
import { TicketsPageComponent } from './pages/tickets/tickets.page';

@NgModule({
  declarations: [
    DashboardPageComponent,
    GlobalSearchComponent,
    CategoriesPageComponent,
    ServicesPageComponent,
    CategoriesOverviewPageComponent,
    TicketsPageComponent
  ],
  imports: [
    CommonModule,
    TicketRoutingModule,
    ReactiveFormsModule,
    NgbModule
  ]
})
export class TicketModule { }
