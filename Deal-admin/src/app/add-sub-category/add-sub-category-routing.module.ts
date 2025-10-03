import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddSubCategoryPage } from './add-sub-category.page';

const routes: Routes = [
  {
    path: '',
    component: AddSubCategoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddSubCategoryPageRoutingModule {}
