import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { ClaimRoutingModule } from './claim-routing.module';
import { FreeClaimPageComponent } from './pages/free-claim/free-claim.page';
import { FreeClaimFormComponent } from './components/free-claim-form/free-claim-form.component';
import { ClaimsPageComponent } from './pages/claims/claims.page';

@NgModule({
  declarations: [
    FreeClaimPageComponent,
    ClaimsPageComponent,
    FreeClaimFormComponent
  ],
  imports: [
    SharedModule,
    ClaimRoutingModule
  ]
})
export class ClaimModule {}
