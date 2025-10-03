import { Component, Input, OnInit } from '@angular/core';
import { Booking } from '../model/booking.model';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.component.html',
  styleUrls: ['./booking-detail.component.scss'],
})
export class BookingDetailComponent implements OnInit {

  @Input() public booking: Booking;
  public constructor(public modalCtrl: ModalController) { }

  public ngOnInit() : void {}
  public convertTo12HourFormat(time: string): string {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const adjustedHour = hourNum % 12 || 12;
    return `${adjustedHour}:${minute.padStart(2, '0')} ${ampm}`;
}
}
