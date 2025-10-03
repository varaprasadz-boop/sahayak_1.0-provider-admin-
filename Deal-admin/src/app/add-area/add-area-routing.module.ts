import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddAreaPage } from './add-area.page';

const routes: Routes = [
  {
    path: '',
    component: AddAreaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddAreaPageRoutingModule {}
