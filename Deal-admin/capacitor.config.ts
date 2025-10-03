import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.miltana.apps',
  appName: 'Miltana',
  webDir: 'www',
  bundledWebRuntime: false,
  backgroundColor: "#ff6600", // <-- here
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      showSpinner: false,
      splashFullScreen: true,
      androidScaleType: "CENTER_CROP",
      launchAutoHide: false,
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;
