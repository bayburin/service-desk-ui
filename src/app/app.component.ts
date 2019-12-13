import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { AuthService } from '@auth/auth.service';
import { routeAnimation } from '@animations/route.animation';
import { NotificationService } from './shared/services/notification/notification.service';
import { CheckVersionService } from './core/services/check-version/check-version.service';
import { environment } from 'environments/environment';

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
    private notifyService: NotificationService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private checkVersion: CheckVersionService
  ) {}

  ngOnInit() {
    this.detectAdblock();
    this.checkVersion.initCheckVersion(environment.versionCheckURL, 1000 * 60 * 10);
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

  private detectAdblock() {
    const iframe = document.createElement('iframe');

    iframe.height = '1px';
    iframe.width = '1px';
    iframe.id = 'ads-text-iframe';
    iframe.src = 'https://lk.iss-reshetnev.ru/ads.html';
    document.body.appendChild(iframe);

    setTimeout(() => {
      const checkFrame = document.getElementById('ads-text-iframe');

      if (checkFrame.style.display === 'none' || checkFrame.style.display === 'hidden' || checkFrame.style.visibility === 'hidden' ||
        checkFrame.offsetHeight == 0) {
        this.notifyService.setMessage('Для корректной работы портала отключите, пожалуйста, Adblock.');
      }
      iframe.remove();
    }, 1000);
  }
}
