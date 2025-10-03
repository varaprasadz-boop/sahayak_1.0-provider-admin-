import { Component, OnInit, ViewChild } from '@angular/core';
import { IonAccordionGroup, MenuController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { CommonService } from './services/common.service';
import { SplashScreen } from '@capacitor/splash-screen';
import { PushNotifications } from '@capacitor/push-notifications';
import { FCM } from '@capacitor-community/fcm';
import { environment } from "../environments/environment";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

import {
  getDoc,
  setDoc,
  doc,
  getFirestore,
  enableIndexedDbPersistence,
} from 'firebase/firestore';
import { Sidemenu } from './home/models/sidemenu.model';
import { SubAdmin } from './models/subadmins.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('accordionGroup', { static: true })
  accordionGroup: IonAccordionGroup;
  private message: any = null;
  public appPages: Sidemenu[] = [
    // {
    //   title: 'Home',
    //   route: '/home',
    //   icon: 'home',
    //   permission: { name: 'home', permissions: ['view_home'] },
    // },

    {
      title: 'Services Management',
      icon: 'grid',
      permission: { name: 'categories', permissions: ['view_categories'] },
      subItems: [
        {
          title: 'Categories',
          route: '/categories',
          icon: 'grid',
          permission: { name: 'categories', permissions: ['view_categories'] },
        },
        {
          title: 'Subcategories',
          route: '/sub-categories',
          icon: 'list',
          permission: {
            name: 'subcategories',
            permissions: ['view_subcategories'],
          },
        },
        {
          title: 'Services List',
          route: '/items',
          icon: 'list',
          permission: { name: 'items', permissions: ['view_items'] },
        },
      ],
    },
    {
      title: 'Location Management',
      route: '/citys',
      icon: 'location',
      permission: { name: 'cities', permissions: ['view_cities'] },
      subItems: [
        {
          title: 'Cities',
          route: '/cities',
          icon: 'location',
          permission: { name: 'cities', permissions: ['view_cities'] },
        },
        {
          title: 'Areas',
          route: '/area',
          icon: 'map',
          permission: { name: 'areas', permissions: ['view_areas'] },
        },
      ],
    },
    {
      title: 'Bookings Management',
      icon: 'cog',
      permission: { name: 'categories', permissions: ['view_categories'] },
      subItems: [
        {
          title: 'Calendar',
          route: '/calendar',
          icon: 'calendar',
          permission: { name: 'calander', permissions: ['view_calander'] },
        },
        {
          title: 'Service Bookings',
          route: '/service-bookings',
          icon: 'cog',
          permission: {
            name: 'service_bookings',
            permissions: ['view_service_bookings'],
          },
        },
      ],
    },
    {
      title: 'User Management',
      route: '/userss',
      icon: 'people',
      permission: { name: 'users', permissions: ['view_users'] },
      subItems: [
        {
          title: 'Sub Admins',
          route: '/subadmins',
          icon: 'people',
          permission: { name: 'subadmins', permissions: ['view_subadmins'] },
        },
        {
          title: 'Service Providers',
          route: '/service-providers',
          icon: 'diamond',
          permission: {
            name: 'service_providers',
            permissions: ['view_service_providers'],
          },
        },
        {
          title: 'Users',
          route: '/users',
          icon: 'people',
          permission: { name: 'users', permissions: ['view_users'] },
        },
        // {
        //   title: 'Subscriber Packages',
        //   route: '/package',
        //   icon: 'cash',
        //   permission: { name: 'packages', permissions: ['view_packages'] },
        // },
      ],
    },
    {
      title: 'Reports',
      route: '/jhjh',
      icon: 'print',
      permission: { name: '', permissions: [''] },
      subItems: [
        {
          title: 'Complaints',
          route: '/complaint',
          icon: 'alert-circle',
          permission: { name: 'packages', permissions: ['view_packages'] },
        },
        {
          title: 'Reports',
          route: '/report',
          icon: 'print',
          permission: { name: 'packages', permissions: ['view_packages'] },
        },
      ],
    },
    {
      title: 'Settings',
      route: '/settings',
      icon: 'settings',
      permission: { name: 'packages', permissions: ['view_packages'] },
      subItems: [
        // {
        //   title: 'Notifications',
        //   route: '/notifications',
        //   icon: 'notifications',
        //   permission: {
        //     name: 'notifications',
        //     permissions: ['view_notifications'],
        //   },
        // },
        {
          title: 'Content Management',
          route: '/content-management',
          icon: 'newspaper',
          permission: {
            name: 'content',
            permissions: ['view_content'],
          },
        },
        {
          title: 'Subscriber Packages',
          route: '/package',
          icon: 'cash',
          permission: { name: 'packages', permissions: ['view_packages'] },
        },
      ],
    },
  ];

  public remoteToken: string = '';
  db = getFirestore();

  constructor(
    private platform: Platform,
    private menuCtrl: MenuController,
    private router: Router,
    private common: CommonService,
    private toastr: ToastrService
  ) {
    const nativeEl = this.accordionGroup;
    console.log(nativeEl);
    // this.initializeApp();
  }

  // async initializeApp() {
  //   if (localStorage.getItem('isLoggedInAdmins') === 'true') {
  //     this.router.navigateByUrl('/home', { skipLocationChange: true, replaceUrl: true });
  //     this.menuCtrl.enable(true);
  //   } else {
  //     this.logout()
  //     this.router.navigateByUrl('/login', { skipLocationChange: true, replaceUrl: true });
  //     this.menuCtrl.enable(false)
  //   }
  //    PushNotifications.requestPermissions().then((permission) => {
  //     if(permission.receive){
  //       PushNotifications.register();
  //     } else {
  //       console.log('No Permission')
  //     }
  //   })
  //   PushNotifications.addListener("registration", (token)=> {
  //     console.log(token.value)
  //   });
  //   this.getToken()
  //   PushNotifications.addListener("pushNotificationReceived", (notification)=> {
  //    console.log(JSON.stringify(notification))
  //    const data = notification.data;
  //    //const title = notification.title;
  //    //const body = notification.body;
  //   })
  //   PushNotifications.register();
  //   this.platform.ready().then(() => {
  //     setTimeout(() => {
  //      SplashScreen.hide();
  //      }, 3000);
  //   })
  // }

  logout() {
    // this.menuCtrl.enable(false)
    // this.common.logout();
    localStorage.removeItem('isLoggedInAdmins');
    localStorage.removeItem('uid');
    localStorage.removeItem('permissions');
    this.router.navigate(['/login']);
    // location.reload();
    // , { skipLocationChange: true, replaceUrl: true }
  }
  ngOnInit() {
    this.requestPermission();
    this.listen();
  }

  getToken() {
    FCM.getToken()
      .then((result) => {
        this.remoteToken = result.token;
        localStorage.setItem('fcm', this.remoteToken);
      })
      .catch((err) => console.log(err));
  }
  public hasPermission(requiredPermissions: string[]): boolean {
    const storedPermissions = localStorage.getItem('permissions');
    if (!storedPermissions) {
      return false;
    }

    const userPermissions = JSON.parse(storedPermissions).reduce(
      (acc: string[], entry: { permissions: string[] }) => {
        return acc.concat(entry.permissions);
      },
      []
    );

    return requiredPermissions.every((perm: string) =>
      userPermissions.includes(perm)
    );
  }
  requestPermission() {

    const messaging = getMessaging();

    getToken(messaging, { vapidKey: environment.firebase.vapidKey }).then((currentToken) => {
      if (currentToken) {
        console.log("Token")
        console.log(currentToken);
      } else {
        console.log('No registration token available. Request permission to generate one.');
      }
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
    });

  }
  listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      this.toastr.success(payload.notification.body, payload.notification.title);
    });
  }
}
