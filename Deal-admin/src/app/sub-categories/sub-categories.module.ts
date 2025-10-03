import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubCategoriesPageRoutingModule } from './sub-categories-routing.module';
import { SubCategoriesPage } from './sub-categories.page';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../shared/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubCategoriesPageRoutingModule,
    NgxPaginationModule,SharedModule
  ],
  declarations: [SubCategoriesPage]
})
export class SubCategoriesPageModule {}
