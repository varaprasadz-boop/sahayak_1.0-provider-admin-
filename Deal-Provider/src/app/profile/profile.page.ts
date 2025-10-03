/*
  Authors : Coders Island
  Website : https://codersisland.com
  App Name : Deal - ionic 6 Buy and Sell, Admin, Admob
  Created : 20-August-2022
  This App Template Source code is licensed as per the
  terms found in the Website https://codersisland.com/license
  Copyright © 2022-present Coders Island.
*/

import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController, isPlatform, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';
import { onAuthStateChanged, getAuth } from 'firebase/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  @ViewChildren('templateList', { read: ElementRef })
  templateListRef: QueryList<ElementRef>;
  public userSubscription: Subscription;
  public photoURL: any;
  public displayName: any;
  public email;
  public about;
  public bookmark = [];
  subscription = new Subscription();
  public account;
  userId
  public accountList = [
    {
      "name": "Account",
      "url": "edit-profile",
      "color": "#111111",
      "icon": "person"
    },
    {
      "name": "Chat",
      "url": "chat",
      "color": "#111111",
      "icon": "chatbox-ellipses"
    },
    // {
    //   "name": "Address",
    //   "url": "address",
    //   "color": "#ff5757",
    //   "icon": "home"
    // },
    // {
    //   "name": "Language",
    //   "url": "language",
    //   "color": "#660066",
    //   "icon": "language"
    // },
    {
      "name": "Settings",
      "url": "settings",
      "color": "#111111",
      "icon": "settings"
    },
    // {
    //   "name": "Subscription",
    //   "url": "subscription",
    //   "color": "#111111",
    //   "icon": "ribbon"
    // },
    // {
    //   "name": "Notifications",
    //   "url": "notifications",
    //   "color": "#0099",
    //   "icon": "notifications"
    // },
    // {
    //   "name": "Compaints",
    //   "url": "complaints",
    //   "color": "#0099cc",
    //   "icon": "chatbubbles"
    // },
    // {
    //   "name": "FAQ",
    //   "url": "faq",
    //   "color": "#111111",
    //   "icon": "help-circle"
    // },
    {
      "name": "Terms & Conditions",
      "url": "terms-and-conditions",
      "color": "#111111",
      "icon": "document-text"
    },
    {
      "name": "Privacy Policy",
      "url": "privacy-policy",
      "color": "#111111",
      "icon": "shield-checkmark"
    },
    {
      "name": "About",
      "url": "about",
      "color": "#111111",
      "icon": "information-circle"
    },
    {
      "name": "Logout",
      "url": "logout",
      "color": "#111111",
      "icon": "log-out"
    },
  ]

  constructor(
    public dataService: DataService, 
    public auth: AuthService,
    private animationCtrl: AnimationController,
    private platform: Platform,
    public router: Router) {}

  ngOnInit() {
    setInterval(()=> {
      this.getUserDetails()
   }, 2000)
  }

  getUserDetails(){ 
    const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if(user) {
         this.userId = user.uid;
         this.dataService.getUserById(this.userId)
         .subscribe(data => {
          // if the user doesn't exists, show this
          if (!data) {
            console.log('no data')
         } else {
          this.displayName  = data.displayName;
          this.account = data.account;
          this.email = data.email;
          this.photoURL = data.photoURL;
        }
       });
      }
    })
  }

  goFollowers(){
    this.router.navigate(['/followers', {
      userId: localStorage.getItem('providerUid')
    }])
  }

  goFollowing(){
    this.router.navigate(['/following', {
      userId: localStorage.getItem('providerUid')
    }])
  }

  goMyPost(){
    this.router.navigate(['/my-posts'])
  }

  goEditProfile(){
    this.router.navigate(['/edit-profile'])
  }

  goMyInterest(){
    this.router.navigate(['/interest'])
  }

  goMyBook(){
    this.router.navigate(['/bookmark'])
  }

  goSettings(){
    this.router.navigate(['/settings'])
  }
 

  ionViewDidEnter() {
      this.subscription = this.platform.backButton.subscribeWithPriority(9999, () => {})
    }
    
    ionViewWillLeave() {
      this.subscription.unsubscribe();
    }

    viewURL(url){
      if (url === 'logout'){
      this.logOut();
      } 
      else if (url === 'subscription') {
        this.router.navigate(['/subscription']);
      }
      else if (url === 'privacy-policy') {
        this.router.navigate(['/privacy-policy']);
      }
       else if (url === 'terms-and-conditions') {
        this.router.navigate(['/term-and-condition']);
      }
      else {
        this.router.navigate([url]);
      }
    }

   public logOut(){
      // this.auth.logout();
      
      localStorage.removeItem('isProviderLoggedIn');
      localStorage.removeItem('uid');
      localStorage.removeItem('selectedArea');
      localStorage.clear();
      window.location.reload();
      this.router.navigate(['/login']);
    }
 
    // , { skipLocationChange: true, replaceUrl: true }
}
