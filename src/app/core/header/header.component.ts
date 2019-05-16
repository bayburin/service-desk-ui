import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

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

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit() {
    this.user = this.userService.user;
    this.isUserSignedIn = this.authService.isUserSignedIn;
  }

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }
}
