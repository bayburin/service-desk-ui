import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

import { LoadingComponent } from './components/loading/loading.component';
import { CasesTableComponent } from './components/cases-table/cases-table.component';
import { SectionHeaderComponent } from './components/section-header/section-header.component';
import { SearchResultPipe } from './pipes/search-result/search-result.pipe';
import { CasesPageComponent } from './components/cases/cases.page';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { FiltersComponent } from './components/filters/filters.component';
@NgModule({
  declarations: [
    LoadingComponent,
    CasesTableComponent,
    SectionHeaderComponent,
    SearchResultPipe,
    CasesPageComponent,
    PaginatorComponent,
    FiltersComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTypeaheadModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTypeaheadModule,
    LoadingComponent,
    CasesTableComponent,
    SectionHeaderComponent,
    SearchResultPipe,
    CasesPageComponent,
    PaginatorComponent,
    FiltersComponent
  ],
  providers: [
    SearchResultPipe
  ]
})
export class SharedModule { }
