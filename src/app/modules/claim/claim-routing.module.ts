import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FreeClaimPageComponent } from './pages/free-claim/free-claim.page';
import { AuthGuard } from '@guards/auth/auth.guard';
import { ClaimsPageComponent } from './pages/claims/claims.page';

const routes: Routes = [
  {
    path: 'claims/new',
    component: FreeClaimPageComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Поддержка' }
  },
  {
    path: 'claims',
    component: ClaimsPageComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Заявки' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClaimRoutingModule { }
