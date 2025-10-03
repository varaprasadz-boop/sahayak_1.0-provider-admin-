import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared/shared.module';
import { CitiesPageRoutingModule } from './cities-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { CitiesPage } from './cities.page';

@NgModule({
  imports: [
    SharedModule,
    NgxPaginationModule,
    CommonModule,
    FormsModule,
    IonicModule,
    CitiesPageRoutingModule
  ],
  declarations: [CitiesPage]
})
export class CitiesPageModule {}
