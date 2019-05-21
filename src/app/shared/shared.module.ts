import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTypeaheadModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { LoadingComponent } from './components/loading/loading.component';
import { CasesTableComponent } from './components/cases-table/cases-table.component';
import { SectionHeaderComponent } from './components/section-header/section-header.component';
import { SearchResultPipe } from './pipes/search-result/search-result.pipe';
import { CasesPageComponent } from './pages/cases/cases.page';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { FiltersComponent } from './components/filters/filters.component';
import { UnauthorizeContentComponent } from './components/unauthorize-content/unauthorize-content.component';
import { LogoComponent } from './components/logo/logo.component';
import { SearchSortingPipe } from './pipes/search-sorting/search-sorting.pipe';
@NgModule({
  declarations: [
    LoadingComponent,
    CasesTableComponent,
    SectionHeaderComponent,
    SearchResultPipe,
    CasesPageComponent,
    PaginatorComponent,
    FiltersComponent,
    UnauthorizeContentComponent,
    LogoComponent,
    SearchSortingPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTypeaheadModule,
    NgbTooltipModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTypeaheadModule,
    NgbTooltipModule,
    LoadingComponent,
    CasesTableComponent,
    SectionHeaderComponent,
    SearchResultPipe,
    CasesPageComponent,
    PaginatorComponent,
    FiltersComponent,
    UnauthorizeContentComponent,
    LogoComponent,
    SearchSortingPipe
  ],
  providers: [
    SearchResultPipe,
    SearchSortingPipe
  ]
})
export class SharedModule { }
