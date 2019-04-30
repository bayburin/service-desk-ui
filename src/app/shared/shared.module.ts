import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

import { LoadingComponent } from './components/loading/loading.component';
import { CasesTableComponent } from './components/cases-table/cases-table.component';
import { SectionHeaderComponent } from './components/section-header/section-header.component';
import { SearchResultPipe } from './pipes/search-result/search-result.pipe';

@NgModule({
  declarations: [
    LoadingComponent,
    CasesTableComponent,
    SectionHeaderComponent,
    SearchResultPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTypeaheadModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTypeaheadModule,
    LoadingComponent,
    CasesTableComponent,
    SectionHeaderComponent,
    SearchResultPipe
  ]
})
export class SharedModule { }
