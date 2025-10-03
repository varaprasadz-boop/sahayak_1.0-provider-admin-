import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { RandomDataService } from './random-data.service';
import { DataService } from '../services/data.service';
import { Booking } from '../models/booking.model';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { Category, Subcategory } from '../models/category';
import { User } from '../models/user';
import { NearByCityModalComponent } from '../components/near-by-city-modal/near-by-city-modal.component';
import {
  AlertController,
  IonModal,
  IonSplitPane,
  MenuController,
  ModalController,
} from '@ionic/angular';
import { format, parseISO, toDate } from 'date-fns';
import { UserProviderFcmService } from '../services/fcm/user-provider-fcm.service';
import { InvoiceComponentComponent } from '../components/invoice-component/invoice-component.component';
import domtoimage from 'dom-to-image';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { InoviceService } from './shared/service/invoice.service';
import { take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { DropdownmodalComponent } from './component/dropdownmodal/dropdownmodal.component';

@Component({
  selector: 'app-service-bookings',
  templateUrl: './service-bookings.page.html',
  styleUrls: ['./service-bookings.page.scss'],
})
export class ServiceBookingsPage implements OnInit, AfterViewInit {
  @ViewChild('modal') public modal: IonModal;
  public search = ''; 
  isModalOpen = false;
  displayedColumns = [
    'id',
    'customer',
    'googlePin',
    'address',
    'category',
    'subCategory',
    'serviceName',
    'price',
    'startedTime',
    'completedTime',
    'createdAt',
    'bookingTime',
    'bookingDate',
    'bookingStatus',
    'paymentStatus',
    'agentStatus',
    'jobStatus',
    'rating',
  ];
  // public dataSource = [] = filteredItems[];
  public img: boolean = true;
  public segment: string = 'all';
  public refund: any = {
    id: '',
    payableAmount: '',
    transferID: '',
    transferMode: '',
  };
  public totalPayableAmount: number = 0;
  public transferID: any;
  public stars = [];
  public transferMode: string='UPI';
  public selectedProvider: any;
  public selectedServiceProviderPrice: any;
  public selectedService: any;
  public serviceProviders: any[] = [];
  public filteredItems: any[] = [];
  public providers: any[] = [];
  public randomData: any[] = [];
  public filteredData: Booking[] = [];
  public bookings: Booking[] = [];
  public ProvidersByCityArea: any[] = [];
  users: User[] = [];
  categories: Category[] = [];
  subCategories: Subcategory[] = [];
  db = getFirestore();
  cities: any[] = [];
  areas: any[] = [];
  private isMenuOpen: boolean = false;
  public constructor(
    private randomDataService: RandomDataService,
    private dataService: DataService,
    private alertController: AlertController,
    private fcm: UserProviderFcmService,
    private modalCtrl: ModalController,
    private invoiceService: InoviceService,
    private router: Router,
    public route: ActivatedRoute,
    private menuController: MenuController
  ) {
    this.route.queryParams.subscribe((params: any) => {
      this.segment = params['filter'] ? params['filter'] : 'all';
      console.log(this.segment);
    });

    this.dataService.getCategories().subscribe((data) => {
      if (data != null) {
        this.categories = data;
      } else {
      }
    });
    this.dataService.getSubCategories().subscribe((data) => {
      if (data != null) {
        this.subCategories = data;
      } else {
      }
    });
    this.dataService.getUsers().subscribe((data) => {
      if (data != null) {
        this.users = data;
        console.log(this.users);
      } else {
      }
    });
    this.dataService.getUsersProviders().subscribe((user) => {
      this.serviceProviders = user;
      console.log(this.serviceProviders);
    });
  }

  public ngOnInit(): void {
    // this.randomData = this.randomDataService.generateRandomData(10);
    // this.filteredData = this.randomData;
    this.getAllBookings();
    this.dataService.getAllCities().subscribe((data) => {
      this.cities = data;
      console.log(this.cities);
    });
    this.dataService.getAllCityAreas().subscribe((data) => {
      this.areas = data;
    });
  }
  async ngAfterViewInit(): Promise<void> {
    this.menuController.enable(this.isMenuOpen);
  }

  public openSplitPane(): void {
    this.isMenuOpen = !this.isMenuOpen;
    this.menuController.enable(this.isMenuOpen);
  }

  public openMap(address): void {
    window.open(
      `https://maps.google.com/?q=${address.latitude},${address.longitude}`
    );
  }

  getCategory(category) {
    for (let item of this.categories) {
      if (item.id === category) {
        return item.name;
      }
    }
  }

  getSubCategory(subcategory) {
    for (let item of this.subCategories) {
      if (item.id === subcategory) {
        return item.name;
      }
    }
  }
  getCities(citi) {
    for (let item of this.cities) {
      if (item.id === citi) {
        return item.name;
      }
    }
  }
  getArea(citi) {
    for (let item of this.areas) {
      if (item.id === citi) {
        return item.name;
      }
    }
  }

  getuser(users) {
    for (let item of this.users) {
      if (item.id === users) {
        return item.displayName;
      }
    }
  }
  getprovider(user): any {
    this.dataService.getUsersProviders().subscribe((users: any) => {
      for (let item of users) {
        // console.log(item);
        if (item.uid === user) {
          console.log(item);
          return item;
        }
      }
    });
  }
  getUserFcm(users) {
    for (let item of this.users) {
      if (item.id === users) {
        return item.fcm_token;
      }
    }
  }
  public getAllBookings(): void {
    this.dataService.getAllBookings().subscribe((data) => {
      this.bookings = data;
      console.log(this.bookings);
      this.filterData({ target: { value: this.segment } });
    });
  }
  public filterData(event: any): boolean {
    const filterValue = event.target.value;
    if (filterValue === 'all') {
      this.dataService.getAllBookings().subscribe((data) => {
        this.filteredItems = data;
      });
      this.router.navigate([], {
        queryParams: { filter: filterValue },
        queryParamsHandling: 'merge',
      });
      return true;
    }
    this.dataService
      .getAllBookingsByJobStatus(this.segment)
      .subscribe((data) => {
        this.filteredItems = data;
      });
    this.router.navigate([], {
      queryParams: { filter: filterValue },
      queryParamsHandling: 'merge',
    });
  }
  public getStatusColor(statusType: string, status: string): string {
    switch (statusType) {
      case 'booking':
        switch (status) {
          case 'confirm':
            return 'success';
          case 'pending':
            return 'danger';
          default:
            return '';
        }
      case 'agent':
        switch (status) {
          case 'pending':
            return 'warning';
          case 'assigned':
            return 'success';
          default:
            return '';
        }
      case 'job':
        switch (status) {
          case 'upcoming':
            return 'warning';
          case 'pending':
            return 'warning';
          case 'in-progress':
            return 'info';
          case 'completed':
            return 'success';
          default:
            return '';
        }
      case 'payment':
        switch (status) {
          case 'pending':
            return 'warning';
          case 'paid':
            return 'success';
          default:
            return '';
        }
      default:
        return '';
    }
  }
  public async changeStatus($event: any, id: any): Promise<void> {
    console.log($event.target.value);
    const catRef = doc(this.db, 'bookings', id);
    await updateDoc(catRef, {
      bookingStatus: $event.target.value,
    });
  }
  public async changePaymentStatus($event: any, id: any): Promise<void> {
    console.log($event.target.value);
    const catRef = doc(this.db, 'bookings', id);
    await updateDoc(catRef, {
      paymentStatus: $event.target.value,
    });
  }
  public async changeagentStatus(event: any, item: any): Promise<void> {
    console.log(event);
    console.log(item);
    if (event == 'assigned') {
      this.dataService
        .getUsersProvidersByCityArea(item.address.city, item.address.area)
        .subscribe((user) => {
          this.providers = user;
        });
      this.selectedService = item;
      document.getElementById('openModal').click();
    }
  }
  cancelbutton() {
    this.modal.dismiss('cancel');
  }
  public async changeJobStatus($event: any, id: any): Promise<void> {
    console.log($event.target.value);
    if ($event.target.value == 'completed') {
      const date = new Date();
      const isoDate = date.toISOString();
      const formatedDate = format(parseISO(isoDate), 'yyyy-MM-dd');
      const bookingRef = doc(this.db, 'bookings', id);
      const startedTime = new Date();
      const time = startedTime.toLocaleTimeString();
      updateDoc(bookingRef, {
        jobStatus: 'completed',
        completed_at: formatedDate,
        completedTime: time,
        completed: true,
        agentPaymentStatus: 'pending',
        isRated: false
      });
    }
    else {
      const catRef = doc(this.db, 'bookings', id);
      await updateDoc(catRef, {
        jobStatus: $event.target.value
      });
    }
  }
  public checkboxChanged(checked: boolean, index: number, provider: any) {
    if (checked) {
      this.selectedProvider = provider;
      console.log(this.selectedProvider);
      this.providers.forEach(
        (item: { checkboxChecked: boolean }, i: number) => {
          if (i !== index) {
            item.checkboxChecked = false;
          }
        }
      );
      this.providers[index].checkboxChecked = true;
    } else {
      this.selectedProvider = null;
    }
  }
  public async assignServiceProvider() {
    if (this.selectedProvider == null) {
    } else {
      console.log(this.selectedService, this.selectedProvider);
      if (this.selectedService != null && this.selectedProvider != null) {
        const catRef = doc(this.db, 'bookings', this.selectedService.id);
        await updateDoc(catRef, {
          agentStatus: 'assigned',
          agentId: this.selectedProvider.id,
          agentName: this.selectedProvider.name,
          jobStatus: 'upcoming',
        });
        this.sendMessageAndToken(
          'Job Assigned',
          'Your job has been assigned to ' + this.selectedProvider.name,
          this.getUserFcm(this.selectedService.uid)
        );
        this.sendMessageAndToken(
          'Job Assigned',
          'Hi ' +
            this.selectedProvider.name +
            ' , ' +
            this.selectedService.service.name +
            ' job has been assigned to You',
          this.selectedProvider.fcm_token
        );
        this.modal.dismiss('', 'cancel');
      }
      console.log('Firestore update attempted');
    }
  }
  async presentAlert(solutionOffered: any) {
    const alert = await this.alertController.create({
      header: 'Solutions Offered',
      message: solutionOffered,
      buttons: ['OK'],
    });
    await alert.present();
  }

  public openProviderModal3(item: any): void {
    this.serviceProviders.forEach((provider) => {
      if (provider.uid == item.rejectedBy) {
        this.selectedProvider = provider;
        console.log(this.selectedProvider);
        this.selectedProvider.booking = item;
        console.log(this.selectedProvider.booking);
        document.getElementById('openModal3')?.click();
      }
    });
  }

  openTransactionDetail(item){
    document.getElementById('openModal6')?.click();
    this.selectedProvider = item;
  }

  async viewBooking(item){
    const modal = await this.modalCtrl.create({
      component: DropdownmodalComponent,
      cssClass: 'custom-fullscreen-modal',
      componentProps: {
        bookingdetail: item
      }
    });
    modal.present();
  }

  public openProviderModal(item): void {
    this.serviceProviders.forEach((provider) => {
      if (provider.uid == item.agentId || provider.id == item.agentId) {
        this.selectedProvider = provider;
        this.selectedProvider.booking = item;
        console.log(this.selectedProvider);
        document.getElementById('openModal3')?.click();
      }
    });
  }

  onClick() {
    this.presentAlert2();
  }
  onClick3() {
    this.presentAlert3();
  }

  async presentAlert3() {
    const alert = await this.alertController.create({
      header: 'Are You Sure to Refund The Payment?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Yes',
          role: 'confirm',
          handler: () => {
            const date: Date = new Date();
            const isoDate: string = date.toISOString();
            const formattedDate: string = format(
              parseISO(isoDate),
              'yyyy-MM-dd'
            );
            updateDoc(
              doc(this.db, 'bookings', this.selectedServiceProviderPrice.id),
              {
                customerRefundStatus: 'paid',
                cusstomerRefundPaid: this.refund.payableAmount,
                customerRefundtransferID: this.refund.transferID,
                customerRefundtransferMode: this.refund.transferMode,
                customerRefundpaymentDate: formattedDate,
              }
            );
            // this.goToInvoice(this.selectedServiceProviderPrice);
          },
        },
      ],
    });
    await alert.present();
  }
  async presentAlert2() {
    const alert = await this.alertController.create({
      header: 'Are You Sure to Create The Payment?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Yes',
          role: 'confirm',
          handler: () => {
            const date: Date = new Date();
            const isoDate: string = date.toISOString();
            const formattedDate: string = format(
              parseISO(isoDate),
              'yyyy-MM-dd'
            );
            updateDoc(
              doc(this.db, 'bookings', this.selectedServiceProviderPrice.id),
              {
                agentPaymentStatus: 'paid',
                agentPaymentPaid: this.totalPayableAmount,
                transferID: this.transferID,
                transferMode: this.transferMode,
                paymentDate: formattedDate,
              }
            );
            this.segment = 'all';
            this.transferID = '';
            this.transferMode = '';
          },
        },
      ],
    });
    await alert.present();
  }
  private sendMessageAndToken(
    title: string,
    body: string,
    token: string
  ): void {
    this.fcm.sendMessageAndGetToken(title, body, token).subscribe(
      (response) => {
        console.log('FCM message sent successfully:', response);
      },
      (error) => {
        console.error('Error sending FCM message:', error);
      }
    );
  }
  public openProviderModal2(item): void {
    this.serviceProviders.forEach((provider) => {
      if (provider.uid == item.agentId) {
        this.selectedProvider = provider;
        this.transferMode = 'UPI'
      }
    });
    this.selectedServiceProviderPrice = item;
    console.log(this.selectedServiceProviderPrice);
    document.getElementById('openModal4')?.click();
    this.totalPayableAmount =
      this.selectedServiceProviderPrice.service.serviceProviderCharge;
  }
  public openProviderModal10(item): void {
    this.serviceProviders.forEach((provider) => {
      if (provider.uid == item.agentId) {
        this.selectedProvider = provider;
      }
    });
    this.selectedServiceProviderPrice = item;
    this.refund.payableAmount = this.selectedServiceProviderPrice.service.price;
    console.log(this.selectedServiceProviderPrice);
    document.getElementById('openModal5')?.click();
  }

  async goToInvoice(item) {
    this.serviceProviders.forEach((provider) => {
      if (provider.uid == item.agentId) {
        this.selectedProvider = provider;
      }
    });
    const modal = await this.modalCtrl.create({
      component: InvoiceComponentComponent,
      cssClass: 'custom-fullscreen-modal',
      componentProps: {
        item: item,
        serviceProviders: this.selectedProvider,
        type: 'capture',
      },
    });
    modal.present();
  }
  public viewReceipt(invoicePrintUrl: string): void {
    window.open(invoicePrintUrl, '_blank').focus();
  }
  public viewUserInvoice(booking: any): void {
    booking.customerName = this.getuser(booking.uid);
    pdfMake
      .createPdf(this.invoiceService.generateInvoice(booking))
      .download('userInvoice.pdf');
  }
  public viewProviderInvoice(booking: any): void {
    this.dataService
      .getUsersProviders()
      .pipe(take(1)) // Only take the first emission and then complete
      .subscribe((users: User[]) => {
        const provider = users;
        if (provider.length > 0) {
          const item = provider.find(
            (item: User) => item.uid === booking.agentId
          );
          if (item) {
            pdfMake
              .createPdf(
                this.invoiceService.generateProviderInvoice(booking, item)
              )
              .download('providerInvoice.pdf');
          }
        }
      });
  }

  public formatTimestamp(time: any): string {
    return time == undefined
      ? ''
      : time
          .toDate()
          .toLocaleTimeString('en-us', {
            timeZone: 'Asia/Kolkata',
            hour12: true,
          });
  }
  public getStars(rating): any {
    let starts = [];
    for (let i = 0; i < rating; i++) {
      starts.push(i);
    }
    return starts;
  }

  public searchData(event:any){
  console.log(event.target.value);  
  this.search=event.target.value.toLowerCase();
  }
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
