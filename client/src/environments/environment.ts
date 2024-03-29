import { Point } from 'src/models/point';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseURL: '/observatory/api',
  geocodeURL: 'https://www.mapquestapi.com/geocoding/v1/address',
  revGeocodeURL: 'https://www.mapquestapi.com/geocoding/v1/reverse',
  geocodeKey: 'TlOzDikpKPLO5jhzFburuxsvWNH1GNPi',
  mapZoomed: 17,
  mapDefaultZoom: 7,
  mapDefaultPosition: new Point(23, 38)
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
