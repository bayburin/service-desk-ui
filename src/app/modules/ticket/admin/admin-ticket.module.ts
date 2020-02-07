import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { MarkdownModule } from 'ngx-markdown';

import { AdminTicketRoutingModule } from './admin-ticket-routing.module';
import { NewTicketPageComponent } from './pages/new-ticket/new-ticket.page';
import { TicketsPageComponent } from './pages/tickets/tickets.page';
import { QuestionComponent } from './components/question/question.component';
import { ServiceDetailComponent } from './components/service-detail/service-detail.component';
import { AnswerComponent } from './components/answer/answer.component';
import { AttachmentComponent } from './components/attachment/attachment.component';
import { EditTicketComponent } from './components/edit-ticket/edit-ticket.component';
import { TicketFormComponent } from './components/ticket-form/ticket-form.component';
import { TicketsDetailPageComponent } from './pages/tickets-detail/tickets-detail.page';
import { MarkdownHelpComponent } from './components/markdown-help/markdown-help.component';

@NgModule({
  declarations: [
    NewTicketPageComponent,
    TicketsPageComponent,
    QuestionComponent,
    ServiceDetailComponent,
    AnswerComponent,
    AttachmentComponent,
    EditTicketComponent,
    TicketFormComponent,
    TicketsDetailPageComponent,
    MarkdownHelpComponent
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
