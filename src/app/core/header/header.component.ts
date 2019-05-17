import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { UserService } from '@shared/services/user/user.service';
import { UserI } from '@interfaces/user.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  collapsed = true;
  user: Observable<UserI>;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.user = this.userService.user;
  }

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }
}
