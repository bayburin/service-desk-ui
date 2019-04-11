import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommonCasePageComponent } from './pages/common-case/common-case.page';
import { AuthGuard } from '@guards/auth.guard';
import { CasesPageComponent } from './pages/cases/cases.page';

const routes: Routes = [
  {
    path: 'cases/new',
    component: CommonCasePageComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Поддержка' }
  },
  {
    path: 'cases',
    component: CasesPageComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Заявки' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CaseRoutingModule { }
