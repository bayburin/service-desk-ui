import { InjectionToken } from '@angular/core';
import { AppConfigI } from '@interfaces/app-config.interface';

export let APP_CONFIG = new InjectionToken<AppConfigI>('config of app');

export const AppConfig: AppConfigI = {
  currentUserStorage: 'currentUser',
  currentTokenStorage: 'currentToken',
  minLengthSearch: 3
};



