import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewContentPageRoutingModule } from './view-content-routing.module';

import { ViewContentPage } from './view-content.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewContentPageRoutingModule
  ],
  declarations: [ViewContentPage]
})
export class ViewContentPageModule {}
