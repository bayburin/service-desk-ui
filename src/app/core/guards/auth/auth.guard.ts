import { UserService } from '@shared/services/user/user.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap, filter } from 'rxjs/operators';

import { AuthService } from '@auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private userService: UserService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.userService.user.pipe(
      map(user => {
        if (user.isValid()) {
          return true;
        }

        this.authService.setReturnUrl(state.url);
        this.authService.authorize();

        return false;
      }),
      filter(Boolean),
      switchMap(() => {
        return this.authService.isUserSignedIn.pipe(
          map((isLoggedIn: boolean) => {
            if (isLoggedIn) {
              return true;
            }

            this.authService.setReturnUrl(state.url);
            this.authService.authorize();

            return false;
          })
        );
      })
    );
  }
}
