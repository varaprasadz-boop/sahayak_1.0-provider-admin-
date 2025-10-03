import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewContentPage } from './view-content.page';

const routes: Routes = [
  {
    path: '',
    component: ViewContentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewContentPageRoutingModule {}
