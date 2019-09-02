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
  NgbModalModule
} from '@ng-bootstrap/ng-bootstrap';

import { LoadingComponent } from './components/loading/loading.component';
import { CaseCardListComponent } from './components/case-card-list/case-card-list.component';
import { SectionHeaderComponent } from './components/section-header/section-header.component';
import { FilterByClassPipe } from './pipes/filter-by-class/filter-by-class.pipe';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { FiltersComponent } from './components/filters/filters.component';
import { UnauthorizeContentComponent } from './components/unauthorize-content/unauthorize-content.component';
import { LogoComponent } from './components/logo/logo.component';
import { SearchSortingPipe } from './pipes/search-sorting/search-sorting.pipe';
import { CaseCardComponent } from './components/case-card/case-card.component';
import { CasesPageContentComponent } from './components/cases-page-content/cases-page-content.component';
import { NotifyComponent } from './components/notify/notify.component';
import { UserDashboardMenuComponent } from './components/user-dashboard-menu/user-dashboard-menu.component';
import { AuthorizeDirective } from './directives/authorize/authorize.directive';

@NgModule({
  declarations: [
    LoadingComponent,
    CaseCardListComponent,
    SectionHeaderComponent,
    FilterByClassPipe,
    PaginatorComponent,
    FiltersComponent,
    UnauthorizeContentComponent,
    LogoComponent,
    SearchSortingPipe,
    CaseCardComponent,
    CasesPageContentComponent,
    NotifyComponent,
    UserDashboardMenuComponent,
    AuthorizeDirective
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
    NgbModalModule
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
    LoadingComponent,
    CaseCardListComponent,
    SectionHeaderComponent,
    FilterByClassPipe,
    PaginatorComponent,
    FiltersComponent,
    UnauthorizeContentComponent,
    LogoComponent,
    SearchSortingPipe,
    CasesPageContentComponent,
    NotifyComponent,
    UserDashboardMenuComponent,
    AuthorizeDirective
  ],
  providers: [
    FilterByClassPipe,
    SearchSortingPipe
  ]
})
export class
SharedModule { }
