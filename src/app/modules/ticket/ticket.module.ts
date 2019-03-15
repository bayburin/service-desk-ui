import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketRoutingModule } from './ticket-routing.module';

import { DashboardPageComponent } from './pages/dashboard/dashboard.page';

@NgModule({
  declarations: [DashboardPageComponent],
  imports: [
    CommonModule,
    TicketRoutingModule
  ]
})
export class TicketModule { }
