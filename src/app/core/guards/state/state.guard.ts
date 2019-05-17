import { Injectable, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { APP_CONFIG } from '@config/app.config';
import { AppConfigI } from '@interfaces/app-config.interface';
import { AuthService } from '@auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class StateGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(APP_CONFIG) private config: AppConfigI,
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isValidState(state.root.queryParams.state)) {
      return true;
    } else {
      this.router.navigate(['authorize_forbidden']);
      return false;
    }
  }

}
