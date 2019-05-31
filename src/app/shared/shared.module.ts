import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTypeaheadModule, NgbTooltipModule, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

import { LoadingComponent } from './components/loading/loading.component';
import { CaseCardListComponent } from './components/case-card-list/case-card-list.component';
import { SectionHeaderComponent } from './components/section-header/section-header.component';
import { SearchResultFilterPipe } from './pipes/search-result-filter/search-result-filter.pipe';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { FiltersComponent } from './components/filters/filters.component';
import { UnauthorizeContentComponent } from './components/unauthorize-content/unauthorize-content.component';
import { LogoComponent } from './components/logo/logo.component';
import { SearchSortingPipe } from './pipes/search-sorting/search-sorting.pipe';
import { CaseCardComponent } from './components/case-card/case-card.component';
import { CasesPageContentComponent } from './components/cases-page-content/cases-page-content.component';

@NgModule({
  declarations: [
    LoadingComponent,
    CaseCardListComponent,
    SectionHeaderComponent,
    SearchResultFilterPipe,
    PaginatorComponent,
    FiltersComponent,
    UnauthorizeContentComponent,
    LogoComponent,
    SearchSortingPipe,
    CaseCardComponent,
    CasesPageContentComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTypeaheadModule,
    NgbTooltipModule,
    NgbRatingModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTypeaheadModule,
    NgbTooltipModule,
    NgbRatingModule,
    LoadingComponent,
    CaseCardListComponent,
    SectionHeaderComponent,
    SearchResultFilterPipe,
    PaginatorComponent,
    FiltersComponent,
    UnauthorizeContentComponent,
    LogoComponent,
    SearchSortingPipe,
    CasesPageContentComponent
  ],
  providers: [
    SearchResultFilterPipe,
    SearchSortingPipe
  ]
})
export class SharedModule { }
