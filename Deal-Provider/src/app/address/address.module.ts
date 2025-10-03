import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
// import { AddAddressPage } from '../add-address/add-address.page';
import { AddressPageRoutingModule } from './address-routing.module'; 
import { AddressPage } from './address.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddressPageRoutingModule
  ],
  declarations: [AddressPage]
})
export class AddressPageModule {}
