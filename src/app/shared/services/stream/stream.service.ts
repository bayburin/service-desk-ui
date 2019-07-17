import { Injectable } from '@angular/core';
import { ActionCableService, Cable } from 'angular2-actioncable';

import { environment } from 'environments/environment';
import { AuthService } from '@auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class StreamService {
  channelServer: Cable;

  constructor(
    private cableService: ActionCableService,
    private authService: AuthService
  ) {
    const access_token = this.authService.getToken().access_token;
    this.channelServer = this.cableService.cable(environment.actionCableUrl, { access_token: access_token });
  }
}
