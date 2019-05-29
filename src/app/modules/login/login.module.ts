import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { LoginRoutingModule } from './login-routing.module';
import { AuthorizePageComponent } from './pages/authorize/authorize.page';
import { LogoutPageComponent } from './pages/logout/logout.page';
import { AuthorizeForbiddenPageComponent } from './pages/authorize-forbidden/authorize-forbidden.page';

@NgModule({
  declarations: [AuthorizePageComponent, LogoutPageComponent, AuthorizeForbiddenPageComponent],
  imports: [
    SharedModule,
    LoginRoutingModule
  ]
})
export class LoginModule { }
