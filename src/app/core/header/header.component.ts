import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { UserService } from '@shared/services/user/user.service';
import { AuthService } from '@auth/auth.service';
import { UserI } from '@interfaces/user.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  collapsed = true;
  user: Observable<UserI>;
  isUserSignedIn: Observable<boolean>;
  loading = false;

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit() {
    this.user = this.userService.user;
    this.isUserSignedIn = this.authService.isUserSignedIn;
  }

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }

  logout() {
    this.loading = true;
    this.authService.logout()
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        null,
        (error) => console.log('Обработать ошибку: ', error)
      );
  }
}
