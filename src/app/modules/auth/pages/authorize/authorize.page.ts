import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
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
export class AuthorizePageComponent implements OnInit, OnDestroy {
  progressValue = 0;
  errors = false;
  success = false;
  private interval;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    @Inject(APP_CONFIG) private config: AppConfigI,
  ) { }

  ngOnInit() {
    this.runProgressBar();

    this.authService.getAccessToken()
      .pipe(switchMap(() => {
        if (this.progressValue < 50) {
          this.progressValue = 50;
        }

        return this.userService.loadUserInfo();
      }))
      .subscribe(
        () => {
          this.progressValue = 100;
          this.success = true;

          setTimeout(() => {
            this.authService.isLoggedInSub.next(true);
            this.router.navigateByUrl(this.authService.getReturnUrl());
          }, 1000);
        },
        () => {
          this.authService.unauthorize();
          clearInterval(this.interval);
          this.errors = true;
        }
      );
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  private runProgressBar() {
    this.interval = setInterval(() => {
      this.progressValue += 4;
      if (this.progressValue >= 100) {
        clearInterval(this.interval);
      }
    }, 150);
  }
}
