import { Component, OnInit } from '@angular/core';

import { AuthService } from '@auth/auth.service';

@Component({
  selector: 'app-unauthorized-page',
  templateUrl: './unauthorized.page.html',
  styleUrls: ['./unauthorized.page.sass']
})
export class UnauthorizedPageComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.clearAuthData();
  }

  /**
   * Заново авторизуется в системе.
   */
  authorize() {
    this.authService.authorize();
  }
}
