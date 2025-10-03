import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditSubcategoriesPage } from './edit-subcategories.page';

const routes: Routes = [
  {
    path: '',
    component: EditSubcategoriesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditSubcategoriesPageRoutingModule {}
