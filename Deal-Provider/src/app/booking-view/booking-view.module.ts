import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookingViewPageRoutingModule } from './booking-view-routing.module';

import { BookingViewPage } from './booking-view.page';
import { TimelineComponent } from '../timeline/timeline.component';
import { InvoiceService } from '../timeline/shared/service/invoice.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookingViewPageRoutingModule
  ],
  declarations: [BookingViewPage, TimelineComponent],
  providers:[DatePipe, TitleCasePipe,InvoiceService]
})
export class BookingViewPageModule {}
