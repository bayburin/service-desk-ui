import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { MarkdownModule } from 'ngx-markdown';
import { FormlyModule } from '@ngx-formly/core';

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
import { NewClaimFormPageComponent } from './pages/new-claim-form/new-claim-form.page';
import { FormInfoSectionComponent } from './components/form-info-section/form-info-section.component';
import { CommonTicketInformationComponent } from './components/common-ticket-information/common-ticket-information.component';
import { FormGroupSectionComponent } from './components/form-group-section/form-group-section.component';
import { ClaimFormFormComponent } from './components/claim-form-form/claim-form-form.component';

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
    NewClaimFormPageComponent,
    FormInfoSectionComponent,
    CommonTicketInformationComponent,
    FormGroupSectionComponent,
    ClaimFormFormComponent
  ],
  imports: [
    CommonModule,
    AdminTicketRoutingModule,
    SharedModule,
    NgSelectModule,
    MarkdownModule.forChild(),
    FormlyModule.forChild()
  ]
})
export class AdminTicketModule { }
