import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TimelineComponent } from '../timeline/timeline.component';
import { InvoiceService } from '../timeline/shared/service/invoice.service';

@NgModule({
  declarations: [TimelineComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [TimelineComponent],
  providers: [DatePipe, TitleCasePipe, InvoiceService]
})
export class SharedModule {}