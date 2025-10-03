import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FeatureItemsPageRoutingModule } from './feature-items-routing.module';

import { FeatureItemsPage } from './feature-items.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FeatureItemsPageRoutingModule
  ],
  declarations: [FeatureItemsPage]
})
export class FeatureItemsPageModule {}
