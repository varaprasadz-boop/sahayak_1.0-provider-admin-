import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoriesPageRoutingModule } from './categories-routing.module'; 
import { NgxPaginationModule } from 'ngx-pagination';
import { CategoriesPage } from './categories.page'; 
import { SharedModule } from '../shared/shared/shared.module';
@NgModule({
  imports: [
    SharedModule,
    NgxPaginationModule,
    CommonModule,
    FormsModule,
    IonicModule,
    CategoriesPageRoutingModule
  ],
  declarations: [CategoriesPage]
})
export class CategoriesPageModule {}
