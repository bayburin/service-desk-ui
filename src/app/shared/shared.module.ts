import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

import { LoadingComponent } from './components/loading/loading.component';
import { CasesTableComponent } from './components/cases-table/cases-table.component';

@NgModule({
  declarations: [
    LoadingComponent,
    CasesTableComponent
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
    CasesTableComponent
  ]
})
export class SharedModule { }
