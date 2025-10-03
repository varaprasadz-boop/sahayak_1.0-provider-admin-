/*
  Authors : Coders Island
  Website : https://codersisland.com
  App Name : Deal - ionic 6 Buy and Sell, Admin, Admob
  Created : 20-August-2022
  This App Template Source code is licensed as per the
  terms found in the Website https://codersisland.com/license
  Copyright © 2022-present Coders Island.
*/

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ViewDidEnter } from '@ionic/angular';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { Item } from '../model/item';
import { Notification } from '../model/notification';
import { DataService } from '../services/data.service';
import { DeliveredNotifications, PushNotificationSchema, PushNotifications } from '@capacitor/push-notifications';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit, ViewDidEnter {
  public id: any;
  public dummyArray = Array(1);
  public items: PushNotificationSchema[] = [];
  public userId: any;
  public db = getFirestore();

  public constructor(
    public routes: ActivatedRoute,
    public router: Router,
    public dataService: DataService,
    public navCtrl: NavController
  ) {
    this.id = this.routes.snapshot.paramMap.get('id');
    // this.dataService.getNote().subscribe((data) => {
    //   if (data != null) {
    //     this.items = data;
    //     this.dummyArray = [];
    //   } else {
    //     this.dummyArray = [];
    //   }
    // });
  }
  public ngOnInit(): void {

  }
  public ionViewDidEnter(): void {
    this.getDeliveredNotifications();
  }
  public async getDeliveredNotifications() : Promise<void> {
    await PushNotifications.getDeliveredNotifications().then((data) => {
      console.log(data);
      this.items = data.notifications;
    })
  }
}
