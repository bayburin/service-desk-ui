import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { LoginRoutingModule } from './login-routing.module';
import { AuthorizePageComponent } from './pages/authorize/authorize.page';
import { LogoutPageComponent } from './pages/logout/logout.page';

@NgModule({
  declarations: [AuthorizePageComponent, LogoutPageComponent],
  imports: [
    SharedModule,
    LoginRoutingModule
  ]
})
export class LoginModule { }
