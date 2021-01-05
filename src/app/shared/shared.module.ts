import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbTypeaheadModule,
  NgbTooltipModule,
  NgbRatingModule,
  NgbTabsetModule,
  NgbToastModule,
  NgbModalModule,
  NgbAccordionModule,
  NgbDropdownModule,
  NgbProgressbarModule
} from '@ng-bootstrap/ng-bootstrap';

import { LoadingComponent } from './components/loading/loading.component';
import { ClaimCardListComponent } from './components/claim-card-list/claim-card-list.component';
import { SectionHeaderComponent } from './components/section-header/section-header.component';
import { FilterByClassPipe } from './pipes/filter-by-class/filter-by-class.pipe';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { FiltersComponent } from './components/filters/filters.component';
import { UnauthorizeContentComponent } from './components/unauthorize-content/unauthorize-content.component';
import { LogoComponent } from './components/logo/logo.component';
import { SearchSortingPipe } from './pipes/search-sorting/search-sorting.pipe';
import { ClaimCardComponent } from './components/claim-card/claim-card.component';
import { ClaimsPageContentComponent } from './components/claims-page-content/claims-page-content.component';
import { NotifyComponent } from './components/notify/notify.component';
import { UserDashboardMenuComponent } from './components/user-dashboard-menu/user-dashboard-menu.component';
import { AuthorizeDirective } from './directives/authorize/authorize.directive';
import { QuestionFlagsComponent } from './components/question-flags/question-flags.component';
import { VisibleFlagComponent } from './components/visible-flag/visible-flag.component';
import { ResponsibleUserDetailsComponent } from './components/responsible-user-details/responsible-user-details.component';
import { FileIconChangeDirective } from './directives/file-icon-change/file-icon-change.directive';
import { AutoFocusDirective } from './directives/auto-focus/auto-focus.directive';
import { ShowQuestionLinkDirective } from './directives/show-question-link/show-question-link.directive';
import { GetQuestionLinkDirective } from './directives/get-question-link/get-question-link.directive';
import { ShowOnlyMyTicketsPipe } from './pipes/show-only-my-tickets/show-only-my-tickets.pipe';

@NgModule({
  declarations: [
    LoadingComponent,
    ClaimCardListComponent,
    SectionHeaderComponent,
    FilterByClassPipe,
    PaginatorComponent,
    FiltersComponent,
    UnauthorizeContentComponent,
    LogoComponent,
    SearchSortingPipe,
    ClaimCardComponent,
    ClaimsPageContentComponent,
    NotifyComponent,
    UserDashboardMenuComponent,
    AuthorizeDirective,
    QuestionFlagsComponent,
    VisibleFlagComponent,
    ResponsibleUserDetailsComponent,
    FileIconChangeDirective,
    AutoFocusDirective,
    ShowQuestionLinkDirective,
    GetQuestionLinkDirective,
    ShowOnlyMyTicketsPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTypeaheadModule,
    NgbTooltipModule,
    NgbRatingModule,
    NgbTabsetModule,
    NgbToastModule,
    NgbModalModule,
    NgbAccordionModule,
    NgbDropdownModule,
    NgbProgressbarModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTypeaheadModule,
    NgbTooltipModule,
    NgbRatingModule,
    NgbTabsetModule,
    NgbToastModule,
    NgbModalModule,
    NgbAccordionModule,
    NgbDropdownModule,
    NgbProgressbarModule,
    LoadingComponent,
    ClaimCardListComponent,
    SectionHeaderComponent,
    FilterByClassPipe,
    PaginatorComponent,
    FiltersComponent,
    UnauthorizeContentComponent,
    LogoComponent,
    SearchSortingPipe,
    ClaimsPageContentComponent,
    NotifyComponent,
    UserDashboardMenuComponent,
    AuthorizeDirective,
    QuestionFlagsComponent,
    VisibleFlagComponent,
    ResponsibleUserDetailsComponent,
    FileIconChangeDirective,
    AutoFocusDirective,
    ShowQuestionLinkDirective,
    GetQuestionLinkDirective,
    ShowOnlyMyTicketsPipe
  ],
  providers: [
    FilterByClassPipe,
    SearchSortingPipe
  ]
})
export class
SharedModule { }
