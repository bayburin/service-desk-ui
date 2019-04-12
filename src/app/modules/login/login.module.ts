import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { LoginRoutingModule } from './login-routing.module';

import { LoginPageComponent } from './pages/login/login.page';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  declarations: [LoginPageComponent, LoginComponent],
  imports: [
    SharedModule,
    LoginRoutingModule
  ]
})
export class LoginModule { }
