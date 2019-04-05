import { Component, OnInit } from '@angular/core';

import { UserService } from '@shared/services/user/user.service';
import { AuthService } from '@auth/auth.service';
import { UserI } from '@models/user.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public collapsed = true;
  public user: UserI;
  public isUserSignedIn: Observable<boolean>;

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit() {
    this.user = this.userService.getUser();
    this.isUserSignedIn = this.authService.isUserSignedIn;
  }

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }
}
