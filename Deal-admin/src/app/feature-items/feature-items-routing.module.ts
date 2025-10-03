import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FeatureItemsPage } from './feature-items.page';

const routes: Routes = [
  {
    path: '',
    component: FeatureItemsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeatureItemsPageRoutingModule {}
