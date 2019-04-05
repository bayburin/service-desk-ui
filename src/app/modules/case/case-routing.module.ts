import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommonCasePageComponent } from './pages/common-case/common-case.page';
import { AuthGuard } from '@guards/auth.guard';

const routes: Routes = [
  {
    path: 'cases/new',
    component: CommonCasePageComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Поддержка' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CaseRoutingModule { }
