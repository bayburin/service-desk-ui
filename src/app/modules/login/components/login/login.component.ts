import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize, switchMap } from 'rxjs/operators';

import { AuthService } from '@auth/auth.service';
import { UserService } from '@shared/services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  private returnUrl: string;
  private error: { error: string, error_description: string };

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.returnUrl = this.activeRoute.snapshot.queryParams.returnUrl || '';
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  onSubmit() {
    this.loading = true;
    this.authService.login(this.loginForm.controls.username.value, this.loginForm.controls.password.value)
      .pipe(
        switchMap(() => this.userService.loadUserInfo()),
        finalize(() => this.loading = false)
      )
      .subscribe(
        () => this.router.navigate([this.returnUrl]),
        (error) => {
          this.loginForm.controls.password.setErrors({ invalid_grant: true });
          this.error = error.error;
        }
      );
  }

  authorizationError() {
    return this.error.error_description;
  }

  isDisabledLogin(): boolean {
    return this.loginForm.controls.username.value === '' || this.loginForm.controls.password.value === '' || this.loading;
  }
}
