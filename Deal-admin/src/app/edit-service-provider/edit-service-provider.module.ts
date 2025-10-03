import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditServiceProviderPageRoutingModule } from './edit-service-provider-routing.module';

import { EditServiceProviderPage } from './edit-service-provider.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditServiceProviderPageRoutingModule
  ],
  declarations: [EditServiceProviderPage]
})
export class EditServiceProviderPageModule {}
