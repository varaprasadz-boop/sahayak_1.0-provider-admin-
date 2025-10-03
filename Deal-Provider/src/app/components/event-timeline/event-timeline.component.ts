import { Component, Input, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BookingDetailComponent } from 'src/app/booking-detail/booking-detail.component';
import { Booking } from 'src/app/model/booking.model';

@Component({
  selector: 'app-event-timeline',
  templateUrl: './event-timeline.component.html',
  styleUrls: ['./event-timeline.component.scss'],
})
export class EventTimelineComponent implements OnInit {
  @Input() public booking : Booking[];
  public constructor(private router : Router) { }

  public ngOnInit() {}
  public convertTo12HourFormat(time24: string): string {
    const [hours, minutes] = time24.split(':');
    let period = 'AM';
    let hours12 = parseInt(hours, 10);
    if (hours12 >= 12) {
      period = 'PM';
      if (hours12 > 12) {
        hours12 -= 12;
      }
    }
    return `${hours12}:${minutes} ${period}`;
  }
  public async bookingDetail(booking): Promise<void> {
    this.router.navigate(['/booking-view'],{state:{data:booking}})
  }
}
