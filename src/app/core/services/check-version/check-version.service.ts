import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { first } from 'rxjs/operators';

import { NotificationService } from '@shared/services/notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class CheckVersionService {
  private currentHash = '{{POST_BUILD_ENTERS_HASH_HERE}}';

  constructor(private http: HttpClient, private notifyService: NotificationService) {}

  /**
   * Инициализация таймера проверки версии клиента.
   *
   * @param url - адрес сервера
   * @param frequency - интервал проверки в миллисекундах (по умолчанию раз в 30 минут)
   */
  initCheckVersion(url: string, frequency = 1000 * 60 * 30): void {
    setInterval(() => {
      this.checkVersion(url);
    }, frequency);
  }

  private checkVersion(url: string): void {
    const headers = new HttpHeaders({
      'Cache-Control':  'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      Pragma: 'no-cache',
      Expires: '0'
    });

    this.http.get(url, { headers }).pipe(first()).subscribe(
      (result: any) => {
        const hash = result.hash;

        if (this.isHashChanged(hash)) {
          this.notifyService.setMessage('Внимание! Вы используете устаревшую версию портала Техподдержки. Для корректной работы портала, пожалуйста, обновите страницу');
        }

        this.currentHash = hash;
      },
      error => console.log('Не удалось получить версию клиента')
    );
  }

  private isHashChanged(newHash: string): boolean {
    console.log('currentVersion: ', this.currentHash);
    console.log('newVersion: ', newHash);

    if (!this.currentHash || this.currentHash === '{{POST_BUILD_ENTERS_HASH_HERE}}') {
      return false;
    }

    return this.currentHash !== newHash;
  }
}
