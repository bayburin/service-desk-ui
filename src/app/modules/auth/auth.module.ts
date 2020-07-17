import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthorizePageComponent } from './pages/authorize/authorize.page';
import { LogoutPageComponent } from './pages/logout/logout.page';
import { AuthorizeForbiddenPageComponent } from './pages/authorize-forbidden/authorize-forbidden.page';
import { UnauthorizedPageComponent } from './pages/unauthorized/unauthorized.page';

@NgModule({
  declarations: [AuthorizePageComponent, LogoutPageComponent, AuthorizeForbiddenPageComponent, UnauthorizedPageComponent],
  imports: [
    SharedModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
