import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActionCableService } from 'angular2-actioncable';

import { StreamService } from './stream.service';
import { AppConfig, APP_CONFIG } from '@config/app.config';
import { AuthService } from '@auth/auth.service';
import { environment } from 'environments/environment';

describe('StreamService', () => {
  let streamService: StreamService;
  const accessToken = { access_token: 'my access token' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        HttpClientTestingModule
      ],
      providers: [
        ActionCableService,
        AuthService,
        { provide: APP_CONFIG, useValue: AppConfig }
      ]
    });

    spyOn(AuthService.prototype, 'getToken').and.returnValue(accessToken);
    streamService = TestBed.get(StreamService);
  });

  it('should be created', () => {
    expect(streamService).toBeTruthy();
  });

  it('should sets server url into channelServer variable', () => {
    expect(streamService.channelServer.url).toEqual(environment.actionCableUrl);
  });

  it('should sets access token into channelServer variable', () => {
    expect(streamService.channelServer.params).toEqual(accessToken);
  });
});
