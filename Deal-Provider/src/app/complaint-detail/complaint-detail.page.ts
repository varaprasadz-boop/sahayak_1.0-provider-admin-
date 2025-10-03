import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Complaints } from '../model/complaints.model';
import { BookingDetailComponent } from '../booking-detail/booking-detail.component';
import { Booking } from '../model/booking.model';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-complaint-detail',
  templateUrl: './complaint-detail.page.html',
  styleUrls: ['./complaint-detail.page.scss'],
})
export class ComplaintDetailPage implements OnInit {

  @Input() complaint: Complaints;
  public bookings: Booking;
  public constructor(public modalController: ModalController, private data: DataService) { }

  public ngOnInit() :void {
    this.data.getAllBookings().subscribe(res => {
      res.forEach(element => {
        if(element.bookingId == this.complaint.bookingId) {
          this.bookings = element;
        }
      })
    })
  }
  public openBooking(booking) :void {
    this.bookingDetail(this.bookings)
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

}
