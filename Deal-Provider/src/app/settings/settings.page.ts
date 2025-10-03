import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PushNotifications } from '@capacitor/push-notifications';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  public checked:boolean = false;
  constructor(public router: Router) {
    this.checkPushNotificationListener();
   }

  ngOnInit() {
  }
  private async checkPushNotificationListener() :Promise<void> {
    await PushNotifications.checkPermissions().then((result) => {
      if (result.receive === 'granted') {
        this.checked = true;
      } else {
        this.checked = false;
      }
    });
  }
  language(){
    this.router.navigate(['/language'])
  }
  protected async onNotifcationToggle(event:any) :Promise<void> {
    if (event.detail.checked) {
      await PushNotifications.register();
      await PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log(notification);
        this.onNotifcationToggle(event);
      });
    } else {
      await PushNotifications.removeAllListeners();
      await PushNotifications.unregister();
    }
  }

}
