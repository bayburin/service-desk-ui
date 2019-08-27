import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewTicketComponent } from './components/new-ticket/new-ticket.component';

const routes: Routes = [
  { path: 'new', component: NewTicketComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminTicketRoutingModule { }
