import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { CaseModule } from './modules/case/case.module';

// import { loadDataFactory } from './core/initializer/load-data.factory';
// import { AppLoadService } from './core/initializer/app-load.service';

import { AppComponent } from './app.component';
import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TicketModule,
    CaseModule,
    AppRoutingModule
  ],
  providers: [
    // AppLoadService
    // { provide: APP_INITIALIZER, useFactory: loadDataFactory, deps: [AppLoadService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
