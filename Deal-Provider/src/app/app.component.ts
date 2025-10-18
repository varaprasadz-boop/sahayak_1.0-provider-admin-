import { Component, OnInit } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { FcmService } from './services/fcm.service';
import { EdgeToEdge } from '@capawesome/capacitor-android-edge-to-edge-support';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private platform: Platform, public menuCtrl: MenuController) {
    this.initializeApp();
    this.setStatusBarBackground();
    this.setStatusBarStyleDark();
  }
  private setStatusBarStyleDark = async () => {
    await StatusBar.setStyle({ style: Style.Dark });
  };
  private setStatusBarBackground = async () => {
    await EdgeToEdge.enable();
    await EdgeToEdge.setBackgroundColor({ color: '#f2f2f2' });

    await StatusBar.setBackgroundColor({ color: '#f2f2f2' });
  };

  initializeApp() {
    this.platform.ready().then(() => {
      setTimeout(() => {
        SplashScreen.hide();
        this.setStatusBarBackground();
        this.setStatusBarStyleDark();
      }, 1000);
    });
  }
}
