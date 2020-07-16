import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StateGuard } from '@guards/state/state.guard';
import { AuthorizePageComponent } from './pages/authorize/authorize.page';
import { LogoutPageComponent } from './pages/logout/logout.page';
import { AuthorizeForbiddenPageComponent } from './pages/authorize-forbidden/authorize-forbidden.page';
import { UnauthorizedPageComponent } from './pages/unauthorized/unauthorized.page';

const routes: Routes = [
  {
    path: 'authorize',
    component: AuthorizePageComponent,
    canActivate: [StateGuard]
  },
  {
    path: 'unauthorized',
    component: UnauthorizedPageComponent
  },
  {
    path: 'logout',
    component: LogoutPageComponent
  },
  {
    path: 'authorize_forbidden',
    component: AuthorizeForbiddenPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
