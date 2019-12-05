import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AuthService } from '@auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class StateGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isValidState(state.root.queryParams.state)) {
      return true;
    } else {
      this.router.navigate(['authorize_forbidden']);
      return false;
    }
  }
}
