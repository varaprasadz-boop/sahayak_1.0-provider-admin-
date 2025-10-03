import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateCityModelPage } from './update-city-model.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateCityModelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateCityModelPageRoutingModule {}
