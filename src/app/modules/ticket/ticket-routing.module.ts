import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPageComponent } from './pages/dashboard/dashboard.page';
import { DashboardResolverService } from './services/dashboard-resolver/dashboard-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: DashboardPageComponent,
    resolve: { data: DashboardResolverService }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [DashboardResolverService]
})
export class TicketRoutingModule { }
