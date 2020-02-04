import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { MarkdownModule } from 'ngx-markdown';

import { AdminTicketRoutingModule } from './admin-ticket-routing.module';
import { NewTicketComponent } from './components/new-ticket/new-ticket.component';
import { TicketsPageComponent } from './pages/tickets/tickets.page';
import { QuestionComponent } from './components/question/question.component';
import { ServiceDetailComponent } from './components/service-detail/service-detail.component';
import { AnswerComponent } from './components/answer/answer.component';
import { AttachmentComponent } from './components/attachment/attachment.component';
import { EditTicketComponent } from './components/edit-ticket/edit-ticket.component';
import { TicketFormComponent } from './components/ticket-form/ticket-form.component';

@NgModule({
  declarations: [
    NewTicketComponent,
    TicketsPageComponent,
    QuestionComponent,
    ServiceDetailComponent,
    AnswerComponent,
    AttachmentComponent,
    EditTicketComponent,
    TicketFormComponent
  ],
  imports: [
    CommonModule,
    AdminTicketRoutingModule,
    SharedModule,
    NgSelectModule,
    MarkdownModule.forChild()
  ]
})
export class AdminTicketModule { }
