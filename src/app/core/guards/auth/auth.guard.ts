import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '@auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
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
