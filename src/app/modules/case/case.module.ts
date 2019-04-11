import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CaseRoutingModule } from './case-routing.module';
import { CommonCasePageComponent } from './pages/common-case/common-case.page';
import { CommonFormComponent } from './components/common-form/common-form.component';
import { CasesPageComponent } from './pages/cases/cases.page';

@NgModule({
  declarations: [
    CommonCasePageComponent,
    CommonFormComponent,
    CasesPageComponent
  ],
  imports: [
    CommonModule,
    CaseRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ]
})
export class CaseModule {}
