// src/app/services/push-notification.service.ts

import { Injectable } from '@angular/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  private token: string | null = null;

  constructor(private http: HttpClient) {
    this.init();
  }

  public async init() {
    await this.addListeners();
    await this.registerNotifications();
  }

  private async addListeners() {
    await PushNotifications.addListener('registration', async token => {
      console.info('Registration token: ', token.value);
      this.token = token.value;
    });

    await PushNotifications.addListener('registrationError', err => {
      console.error('Registration error: ', err.error);
    });

    await PushNotifications.addListener('pushNotificationReceived', notification => {
      console.log('Push notification received: ', notification);
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
      console.log('Push notification action performed', notification.actionId, notification.inputValue);
    });
  }

  public async registerNotifications() {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }

    await PushNotifications.register();
  }
  public async unRegisterNotifications() {
    await PushNotifications.unregister();
  }
  public async getDeliveredNotifications() {
    const notificationList = await PushNotifications.getDeliveredNotifications();
    console.log('delivered notifications', notificationList);
  }

  public storeToken() : string {
    // Replace the URL with your backend API endpoint to store the token
    return this.token || '';
  }
}
