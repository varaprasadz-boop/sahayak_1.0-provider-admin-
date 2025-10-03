import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddServiceProviderPage } from './add-service-provider.page';

const routes: Routes = [
  {
    path: '',
    component: AddServiceProviderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddServiceProviderPageRoutingModule {}
