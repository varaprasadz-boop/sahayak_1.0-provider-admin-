// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyAzoEw6vw--C9KanqD3IpBwdA_qkZ0_tHo',
    authDomain: 'sahayak-online.firebaseapp.com',
    projectId: 'sahayak-online',
    storageBucket: 'sahayak-online.appspot.com',
    messagingSenderId: '453604346037',
    appId: '1:453604346037:web:b38e04dd80032784dd56fc',
    measurementId: 'G-F219DF5RSR',
  },
  google_maps_api_key: '', 
  stripe: {
    sk: ''
  },
  bannerAdId: '', 
  interstitialAdId: '',
  bannerAdIdiOS: '', 
  interstitialAdIdiOS: '',
  rewardedAdId: '',
  langArr: [
    { name: 'English', code: 'en' },
    // { name: 'French', code: 'fr' },
    { name: 'Hindi', code: 'hi' }
  ], 

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
