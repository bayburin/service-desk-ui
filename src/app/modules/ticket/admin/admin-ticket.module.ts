import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { MarkdownModule } from 'ngx-markdown';

import { AdminTicketRoutingModule } from './admin-ticket-routing.module';
import { NewQuestionPageComponent } from './pages/new-question/new-question.page';
import { TicketsPageComponent } from './pages/tickets/tickets.page';
import { QuestionComponent } from './components/question/question.component';
import { ServiceDetailComponent } from './components/service-detail/service-detail.component';
import { AnswerComponent } from './components/answer/answer.component';
import { AttachmentComponent } from './components/attachment/attachment.component';
import { EditQuestionPageComponent } from './pages/edit-question/edit-question.page';
import { QuestionFormComponent } from './components/question-form/question-form.component';
import { TicketsDetailPageComponent } from './pages/tickets-detail/tickets-detail.page';
import { MarkdownHelpComponent } from './components/markdown-help/markdown-help.component';
import { AnswerAccessorComponent } from './components/answer-accessor/answer-accessor.component';
import { NewClaimPageComponent } from './pages/new-claim/new-claim.page';
import { FormInfoTabComponent } from './components/form-info-tab/form-info-tab.component';
import { CommonTicketInformationComponent } from './components/common-ticket-information/common-ticket-information.component';

@NgModule({
  declarations: [
    NewQuestionPageComponent,
    TicketsPageComponent,
    QuestionComponent,
    ServiceDetailComponent,
    AnswerComponent,
    AttachmentComponent,
    EditQuestionPageComponent,
    QuestionFormComponent,
    TicketsDetailPageComponent,
    MarkdownHelpComponent,
    AnswerAccessorComponent,
    NewClaimPageComponent,
    FormInfoTabComponent,
    CommonTicketInformationComponent
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
