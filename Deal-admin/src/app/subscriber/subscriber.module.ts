import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubscriberPageRoutingModule } from './subscriber-routing.module';

import { SubscriberPage } from './subscriber.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubscriberPageRoutingModule
  ],
  declarations: [SubscriberPage]
})
export class SubscriberPageModule {}
