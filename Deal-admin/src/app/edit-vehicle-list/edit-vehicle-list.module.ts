import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditVehicleListPageRoutingModule } from './edit-vehicle-list-routing.module';

import { EditVehicleListPage } from './edit-vehicle-list.page';
import { AutoCompletePageModule } from './components/auto-complete/auto-complete.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditVehicleListPageRoutingModule,
    AutoCompletePageModule
  ],
  declarations: [EditVehicleListPage]
})
export class EditVehicleListPageModule {}
