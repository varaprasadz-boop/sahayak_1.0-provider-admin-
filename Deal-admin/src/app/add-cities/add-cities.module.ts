import { ChangeDetectionStrategy, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddCitiesPageRoutingModule } from './add-cities-routing.module';
import { SearchPipe } from '../pipe/search.pipe';
import { AddCitiesPage } from './add-cities.page';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
 import { SharedModule } from '../shared/shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddCitiesPageRoutingModule,
    ScrollingModule,
    SharedModule
  ],
  declarations: [AddCitiesPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddCitiesPageModule {}
