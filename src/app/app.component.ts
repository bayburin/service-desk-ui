import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { AuthService } from '@auth/auth.service';
import { routeAnimation } from '@animations/route.animation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeAnimation]
})
export class AppComponent implements OnInit, AfterViewChecked {
  location: string;
  isUserSignedIn: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdRef: ChangeDetectorRef
    ) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => this.location = event.urlAfterRedirects.split('?')[0]);

    this.isUserSignedIn = this.authService.isUserSignedIn;
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  hideBreadcrumb() {
    return ['/', undefined].some(el => el === this.location);
  }
}
