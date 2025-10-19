import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Booking } from '../model/booking.model';
import { Router } from '@angular/router';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { AlertController, ModalController, ViewDidEnter } from '@ionic/angular';
import { FcmService } from '../services/fcm.service';
import { DataService } from '../services/data.service';
import {
  FileOpener,
  FileOpenerOptions,
} from '@capacitor-community/file-opener';
import {
  LocalNotifications,
  ScheduleOptions,
} from '@capacitor/local-notifications';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { UserFcmService } from '../services/user-fcm.service';
import { getDoc, setDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { format, parseISO } from 'date-fns';
import { User } from '../model/user';
import { InvoiceService } from './shared/service/invoice.service';

(pdfMake as any).vfs = pdfFonts.vfs;

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit, AfterViewInit {
  @Input() public booking: Booking;
  users: User[] = [];
  @Output() public onChatClick: EventEmitter<any> = new EventEmitter();
  public db = getFirestore();
  public userId;
  public stars = [];
  public displayName: any;
  private provider: User;
  public constructor(
    public router: Router,
    private alertController: AlertController,
    private modalCtrl: ModalController,
    private fcm: FcmService,
    private providerFcm: UserFcmService,
    private data: DataService,
    private invoice: InvoiceService
  ) {
    console.log(this.booking);
    this.data.getUserspeople().subscribe((data) => {
      if (data != null) {
        this.users = data;
      } else {
      }
    });
    this.data
      .getUserById(localStorage.getItem('providerUid'))
      .subscribe((data) => {
        this.provider = data;
      });
  }
  async ngAfterViewInit(): Promise<void> {
    this.getStars();
  }

  public ngOnInit(): void {
    this.addListener();
  }

  public onChat(): void {
    this.onChatClick.emit();
  }
  // public getFcmProviderToken() : string {
  //   let fcmToken;
  //   this.data.getProviderById(this.booking.agentId).subscribe(res => {
  //     fcmToken = res.fcm_token;
  //     console.log(fcmToken);
  //   });
  //   return fcmToken == null ? '' : fcmToken;
  // }
  public async markAsComplete(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Mark as Complete',
      message: 'Are you sure you want to mark this booking as complete?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Okay',
          handler: () => {
            const date = new Date();
            const isoDate = date.toISOString();
            const formatedDate = format(parseISO(isoDate), 'yyyy-MM-dd');
            const bookingRef = doc(this.db, 'bookings', this.booking.id);
            const startedTime = new Date();
            const time = startedTime.toLocaleTimeString();
            updateDoc(bookingRef, {
              jobStatus: 'completed',
              completed_at: formatedDate,
              completedTime: time,
              completed: true,
              agentPaymentStatus: 'pending',
            });
            this.sendMessageAndToken(
              'Job Completed',
              'Job ' + this.booking.bookingId + ' has been completed.'
            );
            let token;
            this.data.getCustomerById(this.booking.uid).subscribe((res) => {
              token = res.fcm_token;
            });
            setTimeout(() => {
              this.sendMessageAndTokenToProvider(
                'Job Completed',
                'Job ' + this.booking.bookingId + ' has been completed.',
                token
              );
            }, 3000);
            this.modalCtrl.dismiss();
          },
        },
      ],
    });

    await alert.present();
  }
  public formatTimestamp(time: any): string {
    // Convert seconds to milliseconds and add nanoseconds converted to milliseconds
    const date = new Date(
      time.seconds * 1000 + Math.floor(time.nanoseconds / 1000000)
    );

    // Extract the components of the date
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Format the date and time in the desired format
    return `${year}-${month}-${day} : ${hours}:${minutes}`;
  }
  public chat(agentId, bookingId): void {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.userId = user.uid;
        if (this.userId === agentId) {
          console.log('You are user');
        } else {
          let chatID = agentId + this.userId + bookingId;
          console.log(chatID);
          const docRef = doc(
            this.db,
            'users',
            localStorage.getItem('providerUid'),
            'chatlist',
            chatID
          );
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            console.log(docSnap.data());
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
              bookingId: bookingId,
            };
            setDoc(docRef, updateBadgeData);
          } else {
            //setDoc(docRef, updateData);
          }
          this.modalCtrl.dismiss();
          this.router.navigate([
            '/chatting',
            {
              chatID: chatID,
              userId: agentId,
              bookingId: bookingId,
            },
          ]);
        }
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
  private sendMessageAndToken(title: string, body: string): void {
    this.fcm.sendMessageAndGetToken(title, body).subscribe(
      (response) => {
        console.log('FCM message sent successfully:', response);
      },
      (error) => {
        console.error('Error sending FCM message:', error);
      }
    );
  }
  private sendMessageAndTokenToProvider(
    title: string,
    body: string,
    token: string
  ): void {
    this.providerFcm.sendMessageAndGetToken(title, body, token).subscribe(
      (response) => {
        console.log('FCM message sent successfully:', response);
      },
      (error) => {
        console.error('Error sending FCM message:', error);
      }
    );
  }

  getuser(users) {
    for (let item of this.users) {
      if (item.id === users) {
        this.displayName = item.displayName;
        return item.displayName;
      }
    }
  }

  public async generateInvoice(): Promise<void> {
    try {
      const pdfDoc = pdfMake.createPdf(
        this.invoice.generateInvoice(this.booking, this.provider.name)
      );
      pdfDoc.getBase64(async (data: any) => {
        console.log('data:application/pdf;base64,' + data);
        await Filesystem.writeFile({
          path: this.booking.bookingId + '-providerIvoice.pdf',
          data: 'data:application/pdf;base64,' + data,
          directory: Directory.Documents,
        });
        await this.scheduleNotification();
      });
    } catch (error) {
      console.error('Error generating invoice:', error);
    }
  }

  async scheduleNotification(): Promise<void> {
    const options: ScheduleOptions = {
      notifications: [
        {
          title: 'Invoice Downloaded',
          body: `Your Invoice of Booking is Downloaded Successfully!`,
          largeBody: `Your Invoice is  ${this.booking.bookingId} Downloaded Successfully!`,
          summaryText: 'Downloaded Completed!',
          smallIcon: 'res://drawable/logo',
          largeIcon: 'res://drawable/invoice',
          id: 1,
        },
      ],
    };
    try {
      await LocalNotifications.schedule(options);
      console.log('Notification scheduled successfully!');
    } catch (ex) {
      console.error('Error scheduling notification:', ex);
      alert(JSON.stringify(ex));
    }
  }
  public async addListener() {
    await LocalNotifications.addListener(
      'localNotificationActionPerformed',
      (notification) => {
        console.log('', notification);
        this.open({
          filePath: `file:///storage/emulated/0/Documents/${this.booking.bookingId}-providerIvoice.pdf`,
          contentType: 'application/pdf',
          openWithDefault: true,
        });
      }
    );
  }
  public phoneCall(): void {
    const phone = '+917382791500';
    window.open(`tel:${phone}`, '_system');
  }
  public async open(options: FileOpenerOptions): Promise<void> {
    try {
      const fileOpenerOptions: FileOpenerOptions = {
        filePath: `file:///storage/emulated/0/Documents/${this.booking.bookingId}-providerIvoice.pdf`,
        contentType: 'application/pdf',
        openWithDefault: true,
      };
      await FileOpener.open(fileOpenerOptions);
    } catch (e) {
      console.log('Error opening file', e);
    }
  }
  public getStars(): void {
    this.stars = [];
    for (let i = 0; i < this.booking.rating; i++) {
      this.stars.push(i);
    }
  }
}
