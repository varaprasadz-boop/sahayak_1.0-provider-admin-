import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ItemsPageRoutingModule } from './items-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ItemsPage } from './items.page';
import { SharedModule } from "../shared/shared/shared.module";

@NgModule({
  imports: [
    NgxPaginationModule,
    CommonModule,
    FormsModule,
    IonicModule,
    ItemsPageRoutingModule,
    SharedModule
],
  declarations: [ItemsPage],
  providers: [CurrencyPipe]
})
export class ItemsPageModule {}
