import { Component, Input, OnInit } from '@angular/core';
import {
  AlertController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { addDoc, collection, getDocs, getFirestore } from 'firebase/firestore';
import { DataService } from '../services/data.service';
import { Address } from '../model/address.model';
import { Schedule } from '../model/schedule.model';
import { Service } from '../model/services';
import { Booking } from '../model/booking.model';
import { PaymentPage } from '../payment/payment.page';
import { Router } from '@angular/router';
import { AddAddressPage } from '../add-address/add-address.page';

@Component({
  selector: 'app-choose-address',
  templateUrl: './choose-address.page.html',
  styleUrls: ['./choose-address.page.scss'],
})
export class ChooseAddressPage implements OnInit {
  @Input() public service: Service;
  @Input() public schedule: Schedule = { date: '', time: '' };
  public bookings: Booking[] = [];
  private db = getFirestore();
  public addresses: Address[] = [];
  public selectedAddress: Address;
  private booking: Booking = {
    uid: '',
    address: {
      id: '',
      uid: '',
      city: '',
      area: '',
      locality: '',
      landmark:'',
      latitude: 0,
      longitude: 0,
      address: '',
      pincode: '',
      name: '',
      phone: '',
      areaName: '',
      cityName: '',
      location: '',
    },
    schedule: {
      date: '',
      time: '',
    },
    service: {
      id: '',
      category: '',
      subCategory: '',
      name: '',
      description: '',
      image: '',
      price: '',
      status: '',
      created_at: '',
    },
    agentId: '',
    agentName: '',
    paymentStatus: '',
    paymentType: '',
    total: 0,
    date: '',
    bookingStatus: '',
    agentStatus: '',
    jobStatus: '',
  };
  public constructor(
    public modalController: ModalController,
    private data: DataService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router,
  ) {}

  public ngOnInit(): void {
    this.getAddresses();

    this.getAllBookings();
    this.selectedAddress = this.addresses.find((address) => address.checked);
  }
  public chooseDate(): void {
    const selectedDate = new Date();

    // Get the year, month, and day
    const year = selectedDate.getFullYear();
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0'); // getMonth() returns 0-based month, so add 1
    const day = selectedDate.getDate().toString().padStart(2, '0');

    // Construct the date string in yyyy-mm-dd format
    const formattedDate = `${year}-${month}-${day}`;

    this.booking.date = formattedDate;
  }
  public async getAddresses(): Promise<void> {
    // get addresses by uid from firebase
    this.data.getaddresses(localStorage.getItem('providerUid')).subscribe((data) => {
      if (data) {
        this.addresses = [];
        data.forEach((item) => {
          this.addresses.push(item as unknown as Address);
        });
      }
    });
  }
  public getAllBookings(): any {
    this.data.getAllBookings().subscribe((res: any) => {
      this.bookings = res;
    });
  }
  public chooseAddress(item: Address): void {
    this.addresses.forEach((address) => (address.checked = false)); // Uncheck all addresses
    item.checked = true; // Check the selected address
    this.selectedAddress = item;
  }

  public confirmSelection(): void {
    this.modalController.dismiss(this.selectedAddress);
  }
  public async payemnetSheet(): Promise<void> {
    const modal = await this.modalController.create({
      component: PaymentPage,
      initialBreakpoint: 0.8,
      cssClass: 'payment-sheet',
      handle: true,
    });

    await modal.present();
    this.booking.paymentStatus = 'pending';
    const { data } = await modal.onWillDismiss();
    if (data === undefined) {
      console.log('No data');
    } else {
      // this.booking.paymentStatus = data;
      this.confirmAlert();
    }
  }
  public async confirmAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Confirm Booking!',
      message: 'Are you sure?',
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
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Please wait...',
              spinner: 'bubbles',
              duration: 5000,
            });
            await loading.present();
            this.booking.uid = localStorage.getItem('providerUid');
            const bookingId = +this.bookings.length + 1;
            this.booking.bookingId = 'SHK00' + bookingId;
            this.booking.address = this.selectedAddress;
            this.booking.schedule = this.schedule;
            this.booking.service = this.service;
            this.booking.total = +this.service.price;
            this.booking.paymentType = 'cod';
            this.booking.agentId = '';
            this.booking.agentName = '';
            this.booking.paymentStatus = 'pending';
            this.booking.date = new Date().toISOString();
            this.booking.bookingStatus = 'pending';
            this.booking.agentStatus = 'pending';
            this.booking.jobStatus = 'pending';
            try {
              const docRef = await addDoc(
                collection(this.db, 'bookings'),
                this.booking
              );
              console.log('Document written with ID: ', docRef.id);
              loading.dismiss();
              this.modalController.dismiss('success','success');
              this.router.navigate(['/tabs/book-now']);
            } catch (e) {
              console.error('Error adding document: ', e);
              loading.dismiss();
              this.modalController.dismiss();
              const errorAlert = await this.alertController.create({
                header: 'Error',
                message: 'Something went wrong',
                buttons: ['OK'],
              });
              await errorAlert.present();
            }
          },
        },
      ],
    });

    await alert.present();
  }
  async openModal() {
    const modal = await this.modalController.create({
      component: AddAddressPage,
      componentProps: {
        type: 'add'
      }
    });
    modal.present();
  }
}
