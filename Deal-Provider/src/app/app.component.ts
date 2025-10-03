import { Component, OnInit } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
import { AdMob } from '@capacitor-community/admob';
import { StatusBar, Style } from '@capacitor/status-bar';
import { FcmService } from './services/fcm.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent  {

  constructor(
    private platform: Platform,
    public menuCtrl: MenuController
  ) {
    
    this.initializeApp();
    this.setStatusBarBackground();
    this.setStatusBarStyleDark();


  }
   private setStatusBarStyleDark = async () => {
    await StatusBar.setStyle({ style: Style.Dark });
  };
  private setStatusBarBackground = async () => {
    await StatusBar.setBackgroundColor({ color: '#f2f2f2' });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      setTimeout(() => {
       SplashScreen.hide();
       this.setStatusBarBackground();
       this.setStatusBarStyleDark();
       }, 3000);
    })
  }
}

