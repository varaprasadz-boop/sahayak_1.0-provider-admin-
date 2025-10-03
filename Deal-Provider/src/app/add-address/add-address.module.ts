import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import {   ReactiveFormsModule } from '@angular/forms';
import { AddAddressPageRoutingModule } from './add-address-routing.module';

import { TranslateModule } from '@ngx-translate/core';
import { AddAddressPage } from './add-address.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    AddAddressPageRoutingModule
  ],
  declarations: [AddAddressPage]
})
export class AddAddressPageModule {}
