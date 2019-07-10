import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ActionCableService } from 'angular2-actioncable';

import { SharedModule } from '@shared/shared.module';

import { APP_CONFIG, AppConfig } from './config/app.config';
import { AppRoutingModule } from './app-routing.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { CaseModule } from './modules/case/case.module';
import { AuthModule } from './modules/auth/auth.module';

// import { loadDataFactory } from './core/initializer/load-data.factory';
// import { AppLoadService } from './core/initializer/app-load.service';

import { JwtInterceptor } from './core/interceptors/jwt.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
// import { FakeBackendInterceptor } from './core/interceptors/fake-backend.interceptor';

import { AppComponent } from './app.component';
import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';
import { BreadcrumbComponent } from './core/breadcrumb/breadcrumb.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    BreadcrumbComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
    TicketModule,
    CaseModule,
    AuthModule,
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: APP_CONFIG, useValue: AppConfig },
    ActionCableService
    // { provide: HTTP_INTERCEPTORS, useClass: FakeBackendInterceptor, multi: true }
    // AppLoadService
    // { provide: APP_INITIALIZER, useFactory: loadDataFactory, deps: [AppLoadService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
