import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditServiceProviderPage } from './edit-service-provider.page';

const routes: Routes = [
  {
    path: '',
    component: EditServiceProviderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditServiceProviderPageRoutingModule {}
