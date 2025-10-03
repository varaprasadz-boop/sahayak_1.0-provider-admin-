import {ChangeDetectionStrategy,NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UpdateCityModelPageRoutingModule } from './update-city-model-routing.module';
import { UpdateCityModelPage } from './update-city-model.page';
import { SearchPipe } from '../pipe/search.pipe';
// import { ScrollingModule } from '@angular/cdk/scrolling';
import { SharedModule } from '../shared/shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule.forRoot({scrollAssist:true}),
    UpdateCityModelPageRoutingModule,
    SharedModule
  ],
  declarations: [UpdateCityModelPage]
})
export class UpdateCityModelPageModule {}
