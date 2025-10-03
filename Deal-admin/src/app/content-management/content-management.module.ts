import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContentManagementPageRoutingModule } from './content-management-routing.module';

import { ContentManagementPage } from './content-management.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContentManagementPageRoutingModule
  ],
  declarations: [ContentManagementPage]
})
export class ContentManagementPageModule {}
