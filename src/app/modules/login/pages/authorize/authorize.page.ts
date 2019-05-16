import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { AppConfigI } from '@interfaces/app-config.interface';
import { APP_CONFIG } from '@config/app.config';
import { AuthService } from '@auth/auth.service';
import { UserService } from '@shared/services/user/user.service';

@Component({
  selector: 'app-authorize-page',
  templateUrl: './authorize.page.html',
  styleUrls: ['./authorize.page.scss']
})
export class AuthorizePageComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    @Inject(APP_CONFIG) private config: AppConfigI,
  ) { }

  ngOnInit() {
    this.authService.getAccessToken()
      .pipe(switchMap(() => this.userService.loadUserInfo()))
      .subscribe(
        () => this.router.navigate([this.authService.getReturnUrl()]),
        error => {
          console.log('Ошибка авторизации: ', error);
          this.router.navigate(['/logout']);
        }
      );
  }
}
