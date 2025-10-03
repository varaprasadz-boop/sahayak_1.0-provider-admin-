import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared/shared.module';
import { AreaPageRoutingModule } from './area-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { AreaPage } from './area.page';

@NgModule({
  imports: [
    SharedModule,
    NgxPaginationModule,
    CommonModule,
    FormsModule,
    IonicModule,
    AreaPageRoutingModule
  ],
  declarations: [AreaPage]
})
export class AreaPageModule {}
