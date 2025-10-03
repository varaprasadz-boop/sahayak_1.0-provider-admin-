import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Booking } from '../model/booking.model';
import { ModalController, ViewDidEnter } from '@ionic/angular';
import { BookingDetailComponent } from '../booking-detail/booking-detail.component';
import { Category, Subcategory } from '../model/category';
import { Router } from '@angular/router';
import { ImageConverterService } from '../services/image-converter.service';
import { Filesystem, Directory, Encoding, FilesystemDirectory } from '@capacitor/filesystem';

@Component({
  selector: 'app-earnings',
  templateUrl: './earnings.page.html',
  styleUrls: ['./earnings.page.scss'],
})
export class EarningsPage implements OnInit, ViewDidEnter {
  public filteredBookings: any[] = [];
  public categories: Category[];
  public currentSegment: string = 'pending';
  public subCategories: Subcategory[] = [];
  public earnings: Booking[] = [];
  public constructor(
    private data: DataService,
    private modalController: ModalController,
    private router: Router,
    private imageConverterService: ImageConverterService
  ) {}

  public ngOnInit(): void {
    this.getBookingsForEarning();
    this.data.getCategories().subscribe((data) => {
      if (data != null) {
        this.categories = data;
      } else {
      }
    });
    this.data.getSubCategoriesList().subscribe((data) => {
      if (data != null) {
        this.subCategories = data;
      } else {
      }
    });
  }

  public segmentChanged(event: any): void {
    this.currentSegment = event.detail.value;
    this.filterBookings();
  }
  public ionViewDidEnter(): void {
    this.getBookingsForEarning();
  }
  public getBookingsForEarning(): void {
    this.data
      .getEarningBookings(localStorage.getItem('providerUid'))
      .subscribe((data) => {
        this.earnings = data;
        this.filteredBookings = this.earnings;
        console.log(this.filteredBookings);
        this.filterBookings();
      });
  }

  public filterBookings(): void {
    if (this.currentSegment === 'pending') {
      this.filteredBookings = this.earnings.filter(
        (booking) => booking.agentPaymentStatus == 'pending'
      );
    } else {
      this.filteredBookings = this.earnings.filter(
        (booking) => booking.agentPaymentStatus === 'paid'
      );
    }
  }

  public categoryName(id): string {
    const category = this.categories.find((item) => item.id === id);
    return category ? category.name : '';
  }

  public async bookingDetail(booking): Promise<void> {
    const modal = await this.modalController.create({
      component: BookingDetailComponent,
      componentProps: {
        booking: booking,
      },
    });
    await modal.present();
  }
  toggleApproved() {
    // this.isApproved = !this.isApproved;
  }
  bookingView(item: any) {
    this.router.navigate(['/booking-view'], { state: { data: item } });
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

  public convertTo12HourFormat(time: string): string {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const adjustedHour = hourNum % 12 || 12;
    return `${adjustedHour}:${minute.padStart(2, '0')} ${ampm}`;
  }
  public async downloadInvoice(booking): Promise<void> {
    window.open(booking.invoicePrintUrl, '_blank');
    // console.log(booking.invoicePrintUrl);
    // const downloadInvoice = await Filesystem.downloadFile({
    //   path: booking.bookingId +'-invoice.png',
    //   directory: Directory.Documents,
    //   recursive: true,
    //   url: booking.invoicePrintUrl
    // });
  }
}
