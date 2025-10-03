import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddSubCategoryPageRoutingModule } from './add-sub-category-routing.module';

import { AddSubCategoryPage } from './add-sub-category.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddSubCategoryPageRoutingModule
  ],
  declarations: [AddSubCategoryPage]
})
export class AddSubCategoryPageModule {}
