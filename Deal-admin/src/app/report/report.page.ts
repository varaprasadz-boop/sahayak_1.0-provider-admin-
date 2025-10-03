import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { format, parseISO } from 'date-fns';
import { Booking } from '../models/booking.model';
import domtoimage from 'dom-to-image';
import * as XSLX from 'xlsx';
import { User } from '../models/user';
import { user } from 'rxfire/auth';
import { MenuController, ModalController } from '@ionic/angular';
import { formatDistanceToNow } from 'date-fns';
import { DropdownmodalComponent } from '../service-bookings/component/dropdownmodal/dropdownmodal.component';
@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit, AfterViewInit {
  public selectedSegment: string = 'bookings';
  public bookings: Booking[] = [];
  public refundBookings: Booking[] = [];
  public serviceProviderNames: any[] = [];
  public services: any[] = [];
  public serviceProviderReports: any[] = [];
  private users: User[] = [];
  private categories: any[] = [];
  public subCategories: any[] = [];
  private cities: any[] = [];
  private areas: any[] = [];
  public items: any[] = [];
  public filter = {
    from: '',
    to: '',
  };
  public isMenuOpen:boolean = false;
  public constructor(private data: DataService, private menuController : MenuController, private modalCtrl: ModalController,) {}

  public ngOnInit(): void {
    this.data.getUsersProviders().subscribe((users) => {
      this.items = users;
      console.log(this.items);
    });
    this.data.getAllCities().subscribe((data) => {
      this.cities = data;
      console.log(this.cities);
    });
    this.data.getAllCityAreas().subscribe((data) => {
      this.areas = data;
    });

    this.getAllAreas();
    this.getAllCities();
    this.getAllUsers();
    this.getAllCategories();
    this.getAllSubCategories();
  }
  async ngAfterViewInit(): Promise<void> {
    this.menuController.enable(this.isMenuOpen)
  }
  public getBookingsReports(): void {
    const to = format(parseISO(this.filter.to), 'yyyy-MM-dd');
    const from = format(parseISO(this.filter.from), 'yyyy-MM-dd');
    this.data.getAllBookingReports(to, from).subscribe((data) => {
      console.log(data);
      this.bookings = this.selectedSegment === 'payments' ? data.filter((booking) => booking.jobStatus == 'completed')  : data.filter((booking) => booking.jobStatus !== 'cancel');
    });
  }
  valueChange(event){
    console.log(event.target.value);
  this.bookings=[]
  }
  public getProvidersReports(): void {
    const to = format(parseISO(this.filter.to), 'yyyy-MM-dd');
    const from = format(parseISO(this.filter.from), 'yyyy-MM-dd');
    this.data.getAllProviderReports(to, from).subscribe((data) => {
      this.serviceProviderReports = data;
      console.log(this.serviceProviderReports);
    });
  }
  public getRefundedBookingsReports(): void {
    const to = format(parseISO(this.filter.to), 'yyyy-MM-dd');
    const from = format(parseISO(this.filter.from), 'yyyy-MM-dd');
    this.data.getAllRefundedBookingReports(to, from).subscribe((data) => {
      console.log(data);
      this.refundBookings = data;
    });
  }
  public segmentChanged(): void {
    switch (this.selectedSegment) {
      case 'bookings': {
        this.getBookingsReports();
        break;
      }
      case 'providers': {
        this.getProvidersReports();
        break;
      }
      case 'transactions': {
        this.getBookingsReports();
        break;
      }
      case 'refund': {
        this.getRefundedBookingsReports();
        break;
      }
      case 'payments': {
        this.getBookingsReports();
        break;
      }
    }
  }
  public exportToExcel(): void {
    if (this.selectedSegment == 'bookings') {
      const formattedData = this.bookings.map((booking) => ({
        'Booking Id': booking.bookingId,
        'Customer Name': booking.address.name,
        'Customer Phone Number': booking.address.phone,
        City: this.getCityName(booking.address.city),
        Area: this.getAreaName(booking.address.area),
        Category: this.getCategoryName(booking.service.category),
        'Sub Category': this.getSubCategoryName(booking.service.subCategory),
        'Total Amount': booking.total,
        Status: booking.bookingStatus,
      }));
      const ws: XSLX.WorkSheet = XSLX.utils.json_to_sheet(formattedData);
      const wb: XSLX.WorkBook = XSLX.utils.book_new();
      XSLX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XSLX.writeFile(wb, this.selectedSegment + '.xlsx');
    } else if (this.selectedSegment == 'providers') {
      const formattedData = this.serviceProviderReports.map((provider) => ({
        'Service Provider ID': provider.SrNo,
        'Service Provider Name': provider.name,
        'Service Provider Ph No.': provider.mobile,
        City: this.getCities(provider.city),
        Area: this.getArea(provider.area),
        Category: this.getCategoryName(provider.category),
        'Sub Category': this.getSubCategoryName(provider.subCategory),
        'Date of Approval': provider.dateOfApproval,
        Status: provider.status,
      }));
      const ws: XSLX.WorkSheet = XSLX.utils.json_to_sheet(formattedData);
      const wb: XSLX.WorkBook = XSLX.utils.book_new();
      XSLX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XSLX.writeFile(wb, this.selectedSegment + '.xlsx');
    } else if (this.selectedSegment == 'transactions') {
      const formattedData = this.bookings.map((booking) => ({
        'Booking Id': booking.bookingId,
        'Date of Booking': booking.schedule.date,
        'Customer Phone Number': this.getUserPhone(booking.uid),
        City: booking.address.cityName,
        Area: booking.address.areaName,
        Category: this.getCategoryName(booking.service.category),
        'Sub Category': this.getSubCategoryName(booking.service.subCategory),
        Service: booking.service.name,
        Amount: booking.service.price,
        'Payment Mode': booking.paymentType,
        Status: booking.service.status,
      }));
      const ws: XSLX.WorkSheet = XSLX.utils.json_to_sheet(formattedData);
      const wb: XSLX.WorkBook = XSLX.utils.book_new();
      XSLX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XSLX.writeFile(wb, this.selectedSegment + '.xlsx');
    } else if (this.selectedSegment == 'payments') {
      const formattedData = this.bookings.map((booking) => ({
        'Booking Id': booking.bookingId,
        'Date of Booking': booking.schedule.date,
        'Service Provider Name': booking.agentName,
        'Service provider ID': this.getProviderID(booking.agentId),
        Category: this.getCategoryName(booking.service.category),
        'Sub Category': this.getSubCategoryName(booking.service.subCategory),
        Service: booking.service.name,
        'Total Amount': booking.service.price,
        'Net Payable': booking.service.serviceProviderCharge,
        'Job Status': booking.jobStatus,
        'Transfer ID': booking.transferID,
        'Transfer Mode': booking.transferMode,
        'Transfer Date': booking.paymentDate,
      }));
      const ws: XSLX.WorkSheet = XSLX.utils.json_to_sheet(formattedData);
      const wb: XSLX.WorkBook = XSLX.utils.book_new();
      XSLX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XSLX.writeFile(wb, this.selectedSegment + '.xlsx');
    } else if (this.selectedSegment == 'refund') {
      const formattedData = this.bookings.map((booking) => ({
        'Booking Id': booking.bookingId,
        'Date of Booking': booking.schedule.date,
        Category: this.getCategoryName(booking.service.category),
        'Sub Category': this.getSubCategoryName(booking.service.subCategory),
        Service: booking.service.name,
        'Total Amount': booking.service.price,
        'Net Payable': booking.service.serviceProviderCharge,
        'Job Status': booking.jobStatus,
        'Transfer ID': booking.transferID,
        'Transfer Mode': booking.transferMode,
        'Transfer Date': booking.paymentDate,
      }));
      const ws: XSLX.WorkSheet = XSLX.utils.json_to_sheet(formattedData);
      const wb: XSLX.WorkBook = XSLX.utils.book_new();
      XSLX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XSLX.writeFile(wb, this.selectedSegment + '.xlsx');
    }
  }
  public getAllUsers(): any {
    this.data.getUsersList().subscribe((data) => {
      this.users = data;
    });
  }
  public getAllCategories(): any {
    this.data.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }
  public getAllSubCategories(): any {
    this.data.getSubCategories().subscribe((data) => {
      this.subCategories = data;
    });
  }
  public getAllCities(): any {
    this.data.getAllCities().subscribe((data) => {
      this.cities = data;
    });
  }
  public getAllAreas(): any {
    this.data.getAllCityAreas().subscribe((data) => {
      this.areas = data;
    });
  }
  public getCategoryName(id): string {
    const category = this.categories.find((x) => x.id == id);
    return category.name;
  }

  // public getSubCategoryName(isubCategory: any): any {
  //   for (let item of this.subCategories) {
  //     if (item.id === isubCategory) {
  //       return item.name;
  //     }
  //   }
  // }

 public getSubCategoryName(ids: any): string {
    if (Array.isArray(ids)) {
      const names = ids.map((id) => {
        const subCategory = this.subCategories.find((x) => x.id == id);
        return subCategory ? subCategory.name : 'Unknown';
      });
      return names.join(', ');
    } else {
      const subCategory = this.subCategories.find((x) => x.id == ids);
      return subCategory ? subCategory.name : 'Unknown';
    }
  }
  public getCityName(id): string {
    console.log(this.cities);
    const city = this.cities.find((x) => x.id == id);
    return city.name;
  }
  public getAreaName(id): string {
    const area = this.areas.find((x) => x.id == id);
    return area.name;
  }
  public getUserName(id: string): any {
    for (let user of this.users) {
      if (user.id === id || user.uid === id) {
        return user.name ? user.name : user.displayName;
      }
    }
  }
  // public getUserPhone(id: string): any {
  //   for (let user of this.users) {
  //     if (user.id === id || user.uid === id) {
  //       return user.name ? user.name : user.displayName;
  //     }
  //   }
  // }

 public getProviderName(uid:any){
  for(let item of this.items){
    if(item.uid === uid){
      return item.name
    }
  }

  }
  public openSplitPane():void {
    this.isMenuOpen = !this.isMenuOpen;
    this.menuController.enable(this.isMenuOpen)
  }
  public getUserPhone(id: string): string {
    const user = this.users.find((x) => x.id === id || x.uid === id);
    return user ? user.phoneNumber || '' : '';
  }
  async viewBooking(item:any){
    const modal = await this.modalCtrl.create({
      component: DropdownmodalComponent,
      cssClass: 'custom-fullscreen-modal',
      componentProps: {
        bookingdetail: item
      }
    });
    modal.present();
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
            return 'warning';
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
  getProviderID(citi) {
    for (let item of this.items) {
      if (item.id === citi) {
        return item.SrNo;
      }
    }
  }
}
