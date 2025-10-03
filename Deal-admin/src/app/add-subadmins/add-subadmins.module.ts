import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { premissionsComponent } from '../components/premissions/premissions.component';
import { AddSubadminsPageRoutingModule } from './add-subadmins-routing.module';

import { AddSubadminsPage } from './add-subadmins.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule.forRoot()
    ,
    AddSubadminsPageRoutingModule
  ],
  declarations: [AddSubadminsPage,premissionsComponent]
})
export class AddSubadminsPageModule {}
