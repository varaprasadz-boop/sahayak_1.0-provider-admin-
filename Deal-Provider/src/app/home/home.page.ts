/*
  Authors : Coders Island
  Website : https://codersisland.com
  App Name : Deal - ionic 6 Buy and Sell, Admin, Admob
  Created : 20-August-2022
  This App Template Source code is licensed as per the
  terms found in the Website https://codersisland.com/license
  Copyright © 2022-present Coders Island.
*/

import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, isPlatform, ModalController, Platform, ViewDidEnter } from '@ionic/angular';
import { Category } from '../model/category';
import { DataService } from '../services/data.service';
import { doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { App } from '@capacitor/app';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { parse, formatISO, format } from 'date-fns';

import { environment } from 'src/environments/environment';
import { Item } from '../model/item';
import { Service } from '../model/services';
import { Booking } from '../model/booking.model';
import { StatusBar, Style } from '@capacitor/status-bar';
import { PushNotifications } from '@capacitor/push-notifications';
import { PushNotificationService } from '../services/push-notifications.service';
import { BookingDetailComponent } from '../booking-detail/booking-detail.component';
import { take } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements ViewDidEnter, AfterViewInit {
  @ViewChild(IonContent, { static: true }) content: IonContent;
  public header = '#f2f2f2';
  public citySelected;
  public areaSelected;
  public selectedDate:any;
  public areas = [];
  public location : string = 'Select Area'
  public categories: Category[] = [];
  public items: Service[] = [];
  public dummyArray = Array(1);
  public backToTop: boolean = false;
  public db = getFirestore();
  public userId;
  public cities = [];
  public bookings: Booking[] = [];
  public name: string = '';
  public selectedCity = {
    countryCode: '',
    id: '',
    longitude: '',
    latitude: '',
    name: '',
    stateCode: '',
  };
  public isProviderLoggedIn: any;
  constructor(
    public platform: Platform,
    public dataService: DataService,
    public router: Router,
    private elementRef: ElementRef,
    private modalController: ModalController,
    private pushNotificationService: PushNotificationService 
  ) {
    setInterval(() => {
      this.isProviderLoggedIn = localStorage.getItem('isProviderLoggedIn');
    }, 200);

    this.dataService.getCategories().subscribe((data) => {
      if (data != null) {
        this.categories = data;
        this.categories = this.categories.reverse();
        this.dummyArray = [];
      } else {
        this.dummyArray = [];
      }
    });

    this.dataService.getNewItemList().subscribe((data) => {
      if (data != null) {
        this.items = data;
        this.items = this.items.reverse();
        //this.dummyArray = []
      } else {
        //this.dummyArray = []
      }
    });
    //  this.bannerAds();
    //  this.showInterstitial();
    this.dataService.getAllCities().subscribe((data) => {
      if (data != null) {
        this.cities = data;
      } else {
      }
    });
    App.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        // window.history.back();
      } else {
        App.exitApp();
      }
    });
  }
  public ngAfterViewInit(): void {
    const selectedCity = localStorage.getItem('selectedCity');
    if (selectedCity) {
      this.selectedCity = JSON.parse(selectedCity);
    }
    this.dataService.getNewItemList().subscribe((data) => {
      if (data != null) {
        this.items = data;
        this.items = this.items.reverse();
        //this.dummyArray = []
      } else {
        //this.dummyArray = []
      }
    });
    this.dataService
      .getUserById(localStorage.getItem('providerUid'))
      .subscribe((data) => {
        if (!data) {
          console.log('no data');
        } else {
          this.name = data.name;
        }
      });
  }

  search() {
    this.router.navigate(['/search']);
  }

  scrollBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 500);
  }

  truncatedText(text: string, maxLength: number): string {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }

  getScrollPos(pos: any) {
    if (pos.detail.scrollTop > this.platform.height()) {
      this.backToTop = true;
    } else {
      this.backToTop = false;
    }
  }

  formatName(name: string): string {
    return name.length > 5 ? `${name.slice(0, 5)}...` : name;
  }

  gotToTop() {
    this.content.scrollToTop(2000);
  }

  gotToBottom() {
    this.content.scrollToBottom(2000);
  }

  goSubcat(id, name) {
    this.router.navigate([
      '/tabs/sub-categories',
      {
        id: id,
        name: name,
      },
    ]);
  }

  ionViewWillLeave() {
    this.setStatusBarStyleDarkLeave();
    this.setStatusBarBackgroundLeave();
  }
  private setStatusBarStyleDark = async () => {
    await StatusBar.setStyle({ style: Style.Light });
  };
  private setStatusBarBackground = async () => {
    await StatusBar.setBackgroundColor({ color: '#f2f2f2' });
  };

  private setStatusBarStyleDarkLeave = async () => {
    await StatusBar.setStyle({ style: Style.Dark });
  };
  private setStatusBarBackgroundLeave = async () => {
    await StatusBar.setBackgroundColor({ color: '#111111' });
  };

  public handleRefresh(event:any):void {
    setTimeout(() => {
      this.getBookings(this.selectedDate)
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  }

  async ionViewDidEnter() {
    const selectedCity = localStorage.getItem('selectedCity');
    if (selectedCity) {
      this.selectedCity = JSON.parse(selectedCity);
    }
    this.setStatusBarBackground();
    this.setStatusBarStyleDark();
    const uid = localStorage.getItem('providerUid');
    if (uid) {
      this.dataService.getUserById(uid).pipe(take(1)).subscribe(async (data: any) => {
        console.log(data);
        if (!data) {
          console.log('no data');
        } else {
          this.citySelected = data.city;
          this.areaSelected = data.area;
          this.name = data.displayName ? `Hi ${data.displayName},` : 'Hi,';
          
          this.areas.forEach(area => {
            if (area.id === this.areaSelected) {
              this.location = `${area.name}`;
              localStorage.setItem('selectedArea', JSON.stringify(area.id));
            }
          });
          this.getAreas();
        }
      });
    }
    this.dataService.getNewItemList().subscribe((data: any) => {
      if (data) {
        this.items = data.reverse();
      }
    });
    this.setStatusBarBackground();
    this.setStatusBarStyleDark();
    this.dataService.getNewItemList().subscribe((data) => {
      if (data != null) {
        this.items = data;
        this.items = this.items.reverse();
        //this.dummyArray = []
      } else {
        //this.dummyArray = []
      }
    }); 
    this.pushNotificationService.registerNotifications();
    await PushNotifications.addListener('registration', async token => {
      console.info('Registration token: ', token.value);
      const userRef = doc(this.db, 'provider', uid);
      console.log('User Ref' + userRef);
      await updateDoc(userRef, {
        fcm_token: token.value
      });
      console.log('FCM token updated', token.value);
    });
    // this.bannerAds();
    // this.showInterstitial();
  }
  public getAreas(): void {
    this.dataService.getAllAreas(this.citySelected).subscribe((data) => {
      if (data != null) {
        this.areas = data;
        this.areas.forEach(area => {
          if (area.id == this.areaSelected) {
            this.location =  area.name;
            localStorage.setItem('selectedArea', JSON.stringify(area.id));
          }
        });
      }
    });
  }
  async bannerAds() {
   
  }

  async hideBanner() {
  }

  async showInterstitial() {

  }

  viewDetails(id) {
    this.router.navigate(['/item-details', { id: id }]);
  }

  call(phone) {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        window.open(`tel:${phone}`);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  chat(sellerId, itemId) {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.userId = user.uid;
        if (this.userId === sellerId) {
          console.log('You are seller');
        } else {
          let chatID = this.userId + sellerId + itemId;
          const docRef = doc(
            this.db,
            'users',
            localStorage.getItem('providerUid'),
            'chatlist',
            chatID
          );
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            let chataData = docSnap.data();
            let isInRoom = chataData.inRoom;
            let chatWith = chataData.chatWith;
            let lastChat = chataData.lastChat;
            let type = chataData.type;
            let timestamp = chataData.timestamp;

            let updateBadgeData = {
              inRoom: true,
              badgeCount: 0,
              chatID: chatID,
              chatWith: chatWith,
              type: type,
              lastChat: lastChat,
              timestamp: timestamp,
              itemId: itemId,
            };
            setDoc(docRef, updateBadgeData);
          } else {
            //setDoc(docRef, updateData);
          }
          this.router.navigate([
            '/chatting',
            {
              chatID: chatID,
              userId: sellerId,
              itemId: itemId,
            },
          ]);
        }
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
  public changeCity(event) {
    console.log(event.detail.value);
    this.getAreas();
    localStorage.setItem('selectedCity', JSON.stringify(event.detail.value));
  }
  public compareWith(o1, o2) {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }
  public goToLogin(): void {
    this.isProviderLoggedIn === 'true'
      ? this.router.navigate(['/apply-loan'])
      : this.router.navigate(['login']);
  }
  public getCategoryName(id) {
    for (let item of this.categories) {
      if (item.id === id) {
        return item.name;
      }
    }
  }

  public getBookings($event): void {
    this.selectedDate=$event;
    console.info(this.selectedDate)
    const uid = localStorage.getItem('providerUid') ? localStorage.getItem('providerUid') : null;
    this.dataService
      .getAllBookingsByUid(
        uid,
        this.convertToYYYYMMDD($event)
      )
      .pipe(take(1))  // Only take the first emission and then complete
      .subscribe((data) => {
        if (data != null) {
          this.bookings = data.filter((booking) => booking.agentAcceptedStatus === 'pending' || booking.agentAcceptedStatus === 'accepted' || (booking.agentAcceptedStatus === 'rejected' && booking.agentWhoRejected !== localStorage.getItem('providerUid') as string));
          console.log(this.bookings);
        } else {
          console.log('no data found');
        }
      });
  }
  public convertToYYYYMMDD(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
  public async bookingDetail(booking): Promise<void> {
    const modal = await this.modalController.create({
      component: BookingDetailComponent,
      componentProps: {
        booking: booking
      }
    });
    await modal.present();
  }
  public callSupport(): void {
    window.open(`tel:+917382791500`, '_system');
  }
}
