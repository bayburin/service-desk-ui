import { Component, OnInit } from '@angular/core';

import { UserService } from '@shared/services/user/user.service';
import { UserI } from '@models/user.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public collapsed = true;
  public user: UserI;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.user = this.userService.getUser();
  }

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }
}
