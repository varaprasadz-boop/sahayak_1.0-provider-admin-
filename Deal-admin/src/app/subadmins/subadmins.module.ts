import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubadminsPageRoutingModule } from './subadmins-routing.module';

import { SubadminsPage } from './subadmins.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubadminsPageRoutingModule
  ],
  declarations: [SubadminsPage]
})
export class SubadminsPageModule {}
