import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = { 
  appId: 'com.sahayak.provider',
  appName: 'Sahayak Provider',
  webDir: 'www',

  plugins: { 
    SplashScreen: {
      launchAutoHide: false,
      showSpinner: false,
      androidScaleType: "CENTER_CROP",
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    LocalNotifications: { 
      iconColor: "#111111",
      sound: "beep.wav",
    },
      EdgeToEdge: {
      backgroundColor: "#f2f2f2",
    },
  },
};
//
export default config;

