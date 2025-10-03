import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddSubscriptionPage } from './add-subscription.page';

const routes: Routes = [
  {
    path: '',
    component: AddSubscriptionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddSubscriptionPageRoutingModule {}
