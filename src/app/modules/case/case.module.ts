import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { CaseRoutingModule } from './case-routing.module';
import { CommonCasePageComponent } from './pages/common-case/common-case.page';
import { CommonFormComponent } from './components/common-form/common-form.component';

@NgModule({
  declarations: [
    CommonCasePageComponent,
    CommonFormComponent
  ],
  imports: [
    SharedModule,
    CaseRoutingModule
  ]
})
export class CaseModule {}
