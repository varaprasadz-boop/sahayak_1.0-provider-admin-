import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { BookingViewPageRoutingModule } from './booking-view-routing.module';
import { BookingViewPage } from './booking-view.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedModule,
    BookingViewPageRoutingModule
  ],
  declarations: [
    BookingViewPage
  ],
  providers: [DatePipe, TitleCasePipe]
})
export class BookingViewPageModule {}
