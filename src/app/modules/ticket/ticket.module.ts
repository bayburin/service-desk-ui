import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { TicketRoutingModule } from './ticket-routing.module';

import { DashboardPageComponent } from './pages/dashboard/dashboard.page';
import { GlobalSearchComponent } from './components/global-search/global-search.component';
import { CategoriesPageComponent } from './pages/categories/categories.page';

@NgModule({
  declarations: [
    DashboardPageComponent,
    GlobalSearchComponent,
    CategoriesPageComponent
  ],
  imports: [
    CommonModule,
    TicketRoutingModule,
    ReactiveFormsModule,
    NgbModule
  ]
})
export class TicketModule { }
