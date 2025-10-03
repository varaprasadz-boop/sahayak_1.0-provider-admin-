import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewCategoriesPageRoutingModule } from './view-categories-routing.module';

import { ViewCategoriesPage } from './view-categories.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewCategoriesPageRoutingModule
  ],
  declarations: [ViewCategoriesPage]
})
export class ViewCategoriesPageModule {}
