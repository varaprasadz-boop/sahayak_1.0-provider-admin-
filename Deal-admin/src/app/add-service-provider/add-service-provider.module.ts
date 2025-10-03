import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddServiceProviderPageRoutingModule } from './add-service-provider-routing.module';

import { AddServiceProviderPage } from './add-service-provider.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddServiceProviderPageRoutingModule
  ],
  declarations: [AddServiceProviderPage]
})
export class AddServiceProviderPageModule {}
