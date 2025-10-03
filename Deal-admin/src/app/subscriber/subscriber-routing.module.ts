import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubscriberPage } from './subscriber.page';

const routes: Routes = [
  {
    path: '',
    component: SubscriberPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubscriberPageRoutingModule {}
