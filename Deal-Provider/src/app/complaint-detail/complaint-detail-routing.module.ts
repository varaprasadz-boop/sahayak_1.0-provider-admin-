import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComplaintDetailPage } from './complaint-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ComplaintDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComplaintDetailPageRoutingModule {}
