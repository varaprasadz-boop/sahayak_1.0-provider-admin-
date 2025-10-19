import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Category, Subcategory } from '../model/category';
import {
  format,
  parse,
  differenceInMilliseconds,
  isAfter,
  isEqual,
  addHours,
} from 'date-fns';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { AlertController } from '@ionic/angular';
import { Auth } from '@angular/fire/auth';
import { FcmService } from '../services/fcm.service';
import { UserFcmService } from '../services/user-fcm.service';
import { Booking } from '../model/booking.model';

@Component({
  selector: 'app-booking-view',
  templateUrl: './booking-details.page.html',
  styleUrls: ['./booking-details.page.scss'],
})
export class BookingDetailsPage implements OnInit {
  public bookingView: any;
  public uid: string = '';
  public categories: Category[] = [];
  public subCategories: Subcategory[] = [];
  public bookingStatus: BookingStatus = {
    canStartBooking: false,
    remainingTime: '',
  };
  private db = getFirestore();

  constructor(
    private data: DataService,
    private alertController: AlertController,
    private auth: Auth,
    private fcm: FcmService,
    private userFcm: UserFcmService
  ) {}

  async ngOnInit() {
    const bookingView = history.state.data;
    this.bookingView = bookingView;
    this.uid = localStorage.getItem('uid') as string || '';
    await this.data.getBookinDetailById(bookingView.id).subscribe((data) => {
      this.bookingView = data || bookingView;
    });

    this.bookingStatus = this.getBookingStatus(
      this.bookingView.schedule.date,
      this.bookingView.schedule.time
    );

    this.data.getCategories().subscribe((data) => {
      this.categories = data || [];
    });

    this.data.getSubCategoriesList().subscribe((data) => {
      this.subCategories = data || [];
    });
  }

  getCategory(categoryId: string): string {
    const category = this.categories.find(item => item.id === categoryId);
    return category ? category.name : 'Unknown Category';
  }

  getSubCategory(subcategoryId: string): string {
    const subcategory = this.subCategories.find(item => item.id === subcategoryId);
    return subcategory ? subcategory.name : 'Unknown Subcategory';
  }

  convertTo12HourFormat(time: string): string {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const adjustedHour = hourNum % 12 || 12;
    return `${adjustedHour}:${minute.padStart(2, '0')} ${ampm}`;
  }

  openMap(address: { latitude: number; longitude: number }): void {
    window.open(`https://maps.google.com/?q=${address.latitude},${address.longitude}`);
  }

  getBookingStatus(apiDate: string, apiTime: string): BookingStatus {
    const apiDateTimeString = `${apiDate}T${apiTime}:00`;
    const apiDateTime = parse(apiDateTimeString, "yyyy-MM-dd'T'HH:mm:ss", new Date());
    const currentDateTime = new Date();

    const validTimes = [
      '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
      '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
    ];

    if (!validTimes.includes(apiTime)) {
      return { canStartBooking: false, remainingTime: 'Invalid time' };
    }

    if (isAfter(currentDateTime, apiDateTime) || isEqual(currentDateTime, apiDateTime)) {
      return { canStartBooking: true };
    } else {
      const remainingTimeMs = differenceInMilliseconds(apiDateTime, currentDateTime);
      const hours = Math.floor((remainingTimeMs / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((remainingTimeMs / (1000 * 60)) % 60);
      const seconds = Math.floor((remainingTimeMs / 1000) % 60);
      const remainingTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      return { canStartBooking: false, remainingTime };
    }
  }

  private async getFcmProviderToken(): Promise<string> {
    const user = await this.data.getUsersById(this.bookingView.uid).toPromise();
    return user.fcm_token || '';
  }

  public async startJob(bookingId: string): Promise<void> {
    const user = this.auth.currentUser;
    const bookingRef = doc(this.db, "bookings", bookingId);
    const startedTime = new Date();
    const time = startedTime.toLocaleTimeString();
    await updateDoc(bookingRef, {
      jobStatus: 'in-progress',
      startedTime: time
    });

    const message = `${this.bookingView.bookingId} Booking Has been started`;
    const body = `${this.bookingView.agentName} has started the Job on booking ${this.bookingView.bookingId}`;
    await this.sendMessageAndToken(message, body);

    const token = await this.getFcmProviderToken();
    setTimeout(async () => {
      await this.sendMessageAndTokenToUser(message, body, token);
    }, 3000);
  }

  public async isStartBooking(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure you want to start booking?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Okay',
          handler: () => {
            this.startJob(this.bookingView.id);
          }
        }
      ]
    });

    await alert.present();
  }

  private sendMessageAndToken(title: string, body: string): void {
    this.fcm.sendMessageAndGetToken(title, body).subscribe(
      response => console.log('FCM message sent successfully:', response),
      error => console.error('Error sending FCM message:', error)
    );
  }

  private sendMessageAndTokenToUser(title: string, body: string, token: string): void {
    this.userFcm.sendMessageAndGetToken(title, body, token).subscribe(
      response => console.log('FCM message sent successfully:', response),
      error => console.error('Error sending FCM message:', error)
    );
  }

  public async acceptBooking(booking: Booking, value: boolean): Promise<void> {
    if (value) {
      const bookingRef = doc(this.db, 'bookings', booking.id);
      await updateDoc(bookingRef, {
        hasAgentAccepted: true,
        agentAcceptedStatus: 'accepted',
      });
    } else {
      this.presentAlertConfirm(booking);
    }
  }

  private async presentAlertConfirm(booking: Booking): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Confirm Cancel',
      message: 'Are you sure you want to cancel this booking?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Reject',
          handler: async () => {
            const bookingRef = doc(this.db, 'bookings', booking.id);
            await updateDoc(bookingRef, {
              hasAgentAccepted: false,
              agentAcceptedStatus: 'rejected',
              agentWhoRejected: booking.agentId,
              agentId: '',
              agentName: '',
              agentStatus: '',
            });

            await this.reassignBooking(booking);
          }
        }
      ]
    });

    await alert.present();
  }

  private async reassignBooking(booking: Booking): Promise<void> {
    let providers: any[] = [];
    await this.data.getAllProviders().subscribe((res) => {
      providers = res;
    });

    const bookingDateTime = new Date(`${booking.schedule.date}T${booking.schedule.time}`);

    for (const provider of providers) {
      const providerBookings: any[] = await this.data.getAllBookings().toPromise();

      const canAssign = providerBookings.every((existingBooking) => {
        const existingBookingDateTime = new Date(`${existingBooking.schedule.date}T${existingBooking.schedule.time}`);
        return isAfter(existingBookingDateTime, addHours(bookingDateTime, 2)) || isEqual(existingBookingDateTime, addHours(bookingDateTime, 2));
      });

      if (canAssign) {
        await updateDoc(doc(this.db, 'bookings', booking.id), {
          agentId: provider.id,
          agentName: provider.name,
          agentStatus: 'assigned',
        });
        return;
      }
    }

    await updateDoc(doc(this.db, 'bookings', booking.id), {
      bookingStatus: 'confirm',
      agentId: '',
      agentName: '',
      agentStatus: 'pending',
    });
  }
}

export interface BookingStatus {
  canStartBooking: boolean;
  remainingTime?: string;
}
