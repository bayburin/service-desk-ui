import { Injectable, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { APP_CONFIG } from '@config/app.config';
import { AppConfigI } from '@interfaces/app-config.interface';
import { AuthService } from '@auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(APP_CONFIG) private config: AppConfigI,
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.isUserSignedIn
      .pipe(map((isLoggedIn: boolean) => {
        if (isLoggedIn) {
          return true;
        }

        this.authService.setReturnUrl(state.url);
        this.authService.authorize();
        return false;
      }));
  }
}
