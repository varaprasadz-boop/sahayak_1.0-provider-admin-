import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddComplaintPageRoutingModule } from './add-complaint-routing.module';
import { SharedModule } from '../shared/shared/shared.module';
import { AddComplaintPage } from './add-complaint.page';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    IonicModule,
    AddComplaintPageRoutingModule
  ],
  declarations: [AddComplaintPage]
})
export class AddComplaintPageModule {}
