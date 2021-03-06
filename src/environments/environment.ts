// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  serverUrl: 'https://inv-dev.iss-reshetnev.ru',
  authorizeUri: 'https://inv-dev.iss-reshetnev.ru:4200/authorize',
  clientId: 42,
  actionCableUrl: 'wss://inv-dev.iss-reshetnev.ru/cable',
  versionCheckURL: 'https://inv-dev.iss-reshetnev.ru:4200/version.json'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
