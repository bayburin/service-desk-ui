import { Component, OnInit } from '@angular/core';

import { AuthService } from '@auth/auth.service';

@Component({
  selector: 'app-logout-page',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss']
})
export class LogoutPageComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.unauthorize().subscribe();
  }
}
