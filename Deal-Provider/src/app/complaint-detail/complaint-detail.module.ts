import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComplaintDetailPageRoutingModule } from './complaint-detail-routing.module';

import { ComplaintDetailPage } from './complaint-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComplaintDetailPageRoutingModule
  ],
  declarations: [ComplaintDetailPage]
})
export class ComplaintDetailPageModule {}
