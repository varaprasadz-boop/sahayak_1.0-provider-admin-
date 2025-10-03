import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalanderPageRoutingModule } from './calander-routing.module';

import { CalanderPage } from './calander.page';
import { FullCalendarModule } from '@fullcalendar/angular';
import { BookingDetailsComponent } from '../components/booking-details/booking-details.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalanderPageRoutingModule,
    FullCalendarModule
  ],
  declarations: [CalanderPage, BookingDetailsComponent]
})
export class CalanderPageModule {}
