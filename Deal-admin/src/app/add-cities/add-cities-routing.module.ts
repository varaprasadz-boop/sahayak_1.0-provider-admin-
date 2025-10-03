import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddCitiesPage } from './add-cities.page';

const routes: Routes = [
  {
    path: '',
    component: AddCitiesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddCitiesPageRoutingModule {}
